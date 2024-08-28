const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const fs = require('fs');
async function performOCR(imageUrl) {
    try {
        const response = await axios.get(`https://api.alyachan.dev/api/ocr?image=${imageUrl}&apikey=6nY0bL`);
        return response.data.status ? { success: true, text: response.data.data.text.trim() } : { success: false, error: 'AlyaChan API error' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
exports.run = {
    usage: ['ocr'],
    use: 'reply photo',
    category: 'convert',
    async: async (m, { func, mecha, quoted }) => {
        if (!/image/.test(quoted.mime)) return m.reply('Input media dengan benar!');
        let wait;
        try {
            wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m });
        } catch (e) {
            return m.reply('Gagal mengirim pesan tunggu.');
        }
        let media;
        try {
            media = await mecha.downloadAndSaveMediaMessage(quoted);
        } catch (e) {
            return await mecha.sendMessage(m.chat, { text: `Gagal mengunduh media: ${e.message}` }, { quoted: m });
        }
        let imageUrl;
        try {
            const buffer = fs.readFileSync(media);
            const { ext, mime } = (await fromBuffer(buffer)) || {};
            const form = new FormData();
            form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
            const uploadResponse = await axios.post("https://tmpfiles.org/api/v1/upload", form, { headers: form.getHeaders() });
            const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(uploadResponse.data.data.url);
            imageUrl = `https://tmpfiles.org/dl/${match[1]}`;
        } catch (error) {
            return await mecha.sendMessage(m.chat, { text: `Gagal mengupload gambar: ${error.message}` }, { quoted: m });
        }
        const ocrResult = await performOCR(imageUrl);
        if (ocrResult.success) {
            await mecha.sendMessage(m.chat, { text: ocrResult.text.replace(/\n+$/, ''), edit: wait.key }, { quoted: m });
        } else {
            await mecha.sendMessage(m.chat, { text: `Terjadi kesalahan dalam proses OCR: ${ocrResult.error}` }, { quoted: m });
        }
    },
    limit: true
};
