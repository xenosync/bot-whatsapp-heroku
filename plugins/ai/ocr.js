const axios = require('axios');

const formatOCRResult = (result) => {
    return result
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/^\s*[\r\n]/gm, '');
};

exports.run = {
    usage: ['ocr'],
    use: 'reply photo',
    category: 'convert',
    async: async (m, { func, mecha, quoted }) => {
        if (/image/.test(quoted.mime)) {
            let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
            let media = await mecha.downloadAndSaveMediaMessage(quoted);
            let anu = await func.telegraPh(media);
            try {
                const ocrResult = await axios.get(`https://api.yanzbotz.my.id/api/tools/ocr?url=${anu.url}`);
                const formattedResult = formatOCRResult(ocrResult.data.result);
                await mecha.sendMessage(m.chat, { text: formattedResult, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
            } catch {
                await mecha.sendMessage(m.chat, { text: 'Terjadi kesalahan dalam proses OCR.' }, { quoted: m, ephemeralExpiration: m.expiration });
            }
        } else {
            m.reply('Input media dengan benar!');
        }
    },
    limit: true
};