const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const fs = require('fs');
const path = require('path');

exports.run = {
    usage: ['gfpgan'],
    hidden: [''],
    use: 'reply photo',
    category: 'ai',
    async: async (m, { func, mecha, quoted }) => {
        if (/image\/(jpe?g|png)/.test(quoted.mime)) {
            let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
            let media = await quoted.download();
            const { ext, mime } = (await fromBuffer(media)) || {};
            const mediaPath = path.join(__dirname, `tmp.${ext}`);
            
            fs.writeFileSync(mediaPath, media);
            const originalSize = fs.statSync(mediaPath).size / 1024; // Size in KB

            const form = new FormData();
            form.append("file", media, { filename: `tmp.${ext}`, contentType: mime });
            try {
                const uploadResponse = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
                    headers: form.getHeaders()
                });
                const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(uploadResponse.data.data.url);
                const imageUrl = `https://tmpfiles.org/dl/${match[1]}`;
                
                const gfpganStartTime = Date.now();
                const gfpganResult = await applyGfpgan(imageUrl);
                const gfpganEndTime = Date.now();
                const processingTime = ((gfpganEndTime - gfpganStartTime) / 1000).toFixed(3);
                
                if (gfpganResult) {
                    const response = await axios.get(gfpganResult, { responseType: 'arraybuffer' });
                    const processedFilePath = path.join(__dirname, 'processed_image.jpg');
                    fs.writeFileSync(processedFilePath, response.data);
                    const processedSize = response.data.length / 1024; // Size in KB
                    
                    await mecha.sendMessage(m.chat, {
                        image: { url: gfpganResult },
                        caption: `*Waktu Proses*: ${processingTime} Detik\n*Ukuran Sebelumnya*: ${originalSize.toFixed(2)} KB\n*Ukuran Setelah*: ${processedSize.toFixed(2)} KB`,
                        mentions: [m.sender]
                    }, { quoted: m, ephemeralExpiration: m.expiration });
                    
                    // Send the processed image as a document
                    await mecha.sendMessage(m.chat, {
                        document: { url: processedFilePath },
                        mimetype: 'image/jpeg',
                        mentions: [m.sender]
                    }, { quoted: m, ephemeralExpiration: m.expiration });

                    fs.unlinkSync(processedFilePath);
                } else {
                    await mecha.sendMessage(m.chat, { text: "Tidak ada respons dari API atau terjadi kesalahan." }, { quoted: m, ephemeralExpiration: m.expiration });
                }
            } catch (e) {
                await mecha.sendMessage(m.chat, { text: `Terjadi kesalahan: ${e.message}` }, { quoted: m, ephemeralExpiration: m.expiration });
            } finally {
                fs.unlinkSync(mediaPath);
            }
        } else {
            m.reply(`Kirim/Reply foto dengan caption ${m.cmd}`);
        }
    },
    premium: true
};

async function applyGfpgan(imageUrl) {
    try {
        const apiResponse = await axios.post('https://api.itsrose.rest/image/gfpgan', {
            init_image: imageUrl,
            enhance_bg: true,
            enhance_faces: true,
            fix_scratches: true
        }, {
            headers: {
                'accept': 'application/json',
                'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b',
                'Content-Type': 'application/json'
            }
        });

        if (apiResponse.data.status) {
            return apiResponse.data.result.images[0];
        } else {
            throw new Error(`API Rose Error: ${apiResponse.data.message}`);
        }
    } catch (error) {
        throw new Error(`API Rose Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
}