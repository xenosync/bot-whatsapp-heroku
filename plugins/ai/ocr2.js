const axios = require('axios');
const { fromBuffer } = require('file-type');

exports.run = {
    usage: ['ocr2'],
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

        let anu;
        try {
            anu = await func.telegraPh(media);
            if (!anu.url) throw new Error('Upload gagal');
        } catch (e) {
            return await mecha.sendMessage(m.chat, { text: `Upload gagal: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
        }

        try {
            const { data } = await axios.get('https://image-to-text30.p.rapidapi.com/api/rapidapi/image-to-text', {
                params: { url: anu.url },
                headers: {
                    'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                    'x-rapidapi-host': 'image-to-text30.p.rapidapi.com'
                }
            });
            await mecha.sendMessage(m.chat, { text: data.text || 'Tidak ada teks yang ditemukan.', edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Terjadi kesalahan dalam proses OCR: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
        }
    },
    limit: true
};
