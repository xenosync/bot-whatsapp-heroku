const axios = require('axios');
const cleanResponse = (text) => {
    return text.replace(/\*\*/g, '*')
               .replace(/_/g, '')
               .replace(/`|```/g, '')
               .trim();
};
exports.run = {
    usage: ['lumin'],
    category: 'ai',
    async: async (m, { mecha, quoted }) => {
        if (!m.text) return m.reply('Silakan masukkan teks.');
        mecha.sendReact(m.chat, '🕒', m.key);
        const prompt = `
        Kamu adalah asisten AI yang pintar, responsif, dan informatif. 
        Jawablah setiap pertanyaan dengan penjelasan yang lengkap namun mudah dimengerti, seolah-olah kamu sedang berdialog dengan manusia. 
        Berikan informasi yang relevan dan akurat, dan jika ada pertanyaan yang ambigu, klarifikasi sebelum memberikan jawaban. 
        Pastikan jawabanmu tetap sopan dan profesional. Selalu gunakan bahasa Indonesia dalam setiap responsmu. 
        Jika diperlukan, sertakan referensi atau sumber tambahan yang relevan untuk memberikan jawaban yang lebih lengkap.
        `;
        try {
            let response = (await axios.post('https://lumin-ai.xyz', {
                content: m.text,
                user: m.sender,
                prompt: prompt,
                imageBuffer: quoted && /image/.test(quoted.mime) ? await quoted.download() : null
            })).data.result;

            response = cleanResponse(response);
            m.reply(response || 'Maaf, saya tidak dapat memberikan jawaban pada saat ini.');
        } catch (err) {
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    },
    limit: true
};
