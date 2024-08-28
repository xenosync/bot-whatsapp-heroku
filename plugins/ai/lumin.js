const cleanResponse = (text) => {
    return text.replace(/\*\*/g, '*')
               .replace(/_/g, '')
               .replace(/`|```/g, '')
               .trim();
};
const axios = require('axios');
exports.run = {
    usage: ['lumin'],
    category: 'ai',
    async: async (m, { mecha, quoted }) => {
        if (!m.text) return m.reply('Silakan masukkan teks.');
        mecha.sendReact(m.chat, '🕒', m.key);
        const prompt = "Kamu adalah asisten AI yang pintar, responsif, dan informatif. Jawablah setiap pertanyaan dengan penjelasan yang lengkap namun mudah dimengerti, seolah-olah kamu sedang berdialog dengan manusia. Berikan informasi yang relevan dan akurat, dan jika ada pertanyaan yang ambigu, klarifikasi sebelum memberikan jawaban. Pastikan jawabanmu tetap sopan dan profesional. Selalu gunakan bahasa Indonesia dalam setiap responsmu.";
        try {
            let response = (await axios.post('https://lumin-ai.xyz', {
                content: m.text,
                user: m.sender,
                prompt: prompt,
                imageBuffer: quoted && /image/.test(quoted.mime) ? await quoted.download() : null
            })).data.result;
            response = cleanResponse(response);
            m.reply(response);
        } catch (err) {
            m.reply(err.toString());
        }
    },
    limit: true
};
