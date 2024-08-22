const { G4F } = require("g4f");
const g4f = new G4F();
const chatMemory = {};

exports.run = {
    usage: ['gpt4'],
    hidden: [],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'beritahu seluruh fungsi mu secara mendetail'));
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        const currentDate = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        if (!chatMemory[m.chat]) {
            chatMemory[m.chat] = [];
        }
        chatMemory[m.chat].push({ role: "user", content: m.text });
        try {
            const options = [{ model: "gpt4-o" }]; // Pastikan model ini tersedia dan didukung
            const messages = [
                { role: "system", content: `Tanggal dan waktu saat ini: ${currentDate}.` },
                ...chatMemory[m.chat]
            ];
            let response = await g4f.chatCompletion(messages, options);
            response = response
                .replace(/<\/?[^>]+(>|$)/g, '')
                .replace(/^\s+|\s+$/g, '')
                .trim();
            chatMemory[m.chat].push({ role: "assistant", content: response });
            mecha.reply(m.chat, response, m, {
                expiration: m.expiration
            });
        } catch (error) {
            console.error(error);
            return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};