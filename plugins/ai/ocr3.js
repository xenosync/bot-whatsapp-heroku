const axios = require('axios');

exports.run = {
    usage: ['ocr3'],
    use: 'reply photo',
    category: 'convert',
    async: async (m, { func, mecha, quoted }) => {
        if (/image/.test(quoted.mime)) {
            let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
            let media = await mecha.downloadAndSaveMediaMessage(m), anu;
            try {
                anu = await func.telegraPh(media);
                if (!anu.url) throw new Error('Upload gagal');
            } catch (e) {
                return await mecha.sendMessage(m.chat, { text: `Upload gagal: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
            }
            try {
                const { data } = await axios.get('https://ocr-image-to-text-extractor.p.rapidapi.com/api.php', {
                    params: { language: 'eng', image_url: anu.url },
                    headers: {
                        'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                        'x-rapidapi-host': 'ocr-image-to-text-extractor.p.rapidapi.com'
                    }
                });
                await mecha.sendMessage(m.chat, { text: data.text || 'Tidak ada teks yang ditemukan.', edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
            } catch (e) {
                await mecha.sendMessage(m.chat, { text: `Terjadi kesalahan dalam proses OCR: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
            }
        } else {
            m.reply('Input media dengan benar!');
        }
    },
    limit: true
};
