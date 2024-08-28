const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const formatOCRResult = r => r.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/^\s*[\r\n]/gm, '');
exports.run = {
    usage: ['ocr4'],
    use: 'reply photo',
    category: 'convert',
    async: async (m, { func, mecha, quoted }) => {
        if (!/image/.test(quoted.mime)) {
            return m.reply('Input media dengan benar!');
        }
        let wait;
        try {
            wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
        } catch (e) {
            return m.reply('Gagal mengirim pesan tunggu.');
        }
        let media;
        try {
            media = await mecha.downloadAndSaveMediaMessage(quoted);
        } catch (e) {
            return await mecha.sendMessage(m.chat, { text: `Gagal mengunduh media: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
        }
        try {
            const data = new FormData();
            data.append('base64', fs.readFileSync(media, 'base64'));
            const ocrResult = await axios.request({
                method: 'POST',
                url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
                headers: {
                    'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                    'x-rapidapi-host': 'ocr-extract-text.p.rapidapi.com',
                    ...data.getHeaders()
                },
                data: data
            });
            await mecha.sendMessage(m.chat, { text: formatOCRResult(ocrResult.data.text), edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Terjadi kesalahan dalam proses OCR: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
        }
    },
    limit: true
};
