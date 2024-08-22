const axios = require('axios');

const formatOCRResult = (result) => {
    return result
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/^\s*[\r\n]/gm, '');
};

exports.run = {
    usage: ['ocr2'],
    use: 'reply photo',
    category: 'convert',
    async: async (m, { func, mecha, quoted }) => {
        if (/image/.test(quoted.mime)) {
            let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
            let media = await mecha.downloadAndSaveMediaMessage(quoted);
            let anu = await func.telegraPh(media);
            try {
                const ocrResult = await axios.post('https://api.itsrose.rest/image/ocr', {
                    init_image: anu.url
                }, {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b',
                        'Content-Type': 'application/json'
                    }
                });
                if (ocrResult.data.status) {
                    const formattedResult = formatOCRResult(ocrResult.data.result.text);
                    await mecha.sendMessage(m.chat, { text: formattedResult, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
                } else {
                    await mecha.sendMessage(m.chat, { text: 'Tidak dapat memproses gambar.' }, { quoted: m, ephemeralExpiration: m.expiration });
                }
            } catch {
                await mecha.sendMessage(m.chat, { text: 'Terjadi kesalahan dalam proses OCR.' }, { quoted: m, ephemeralExpiration: m.expiration });
            }
        } else {
            m.reply('Input media dengan benar!');
        }
    },
    limit: true
};