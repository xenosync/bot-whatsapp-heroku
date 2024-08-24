const axios = require('axios');
const memory = {};
const cleanResponse = (text) => text.replace(/\*\*/g, '*').replace(/_/g, '').replace(/`|```/g, '').trim();
const getCurrentJakartaTime = () => new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000)
    .toISOString().replace('T', ' ').split('.')[0];

const apiRequest = async (options) => {
    try {
        const { data } = await axios.request({ ...options, timeout: 10000 });
        if (data.status) return cleanResponse(data.message);
        return 'Maaf, saya tidak dapat memberikan jawaban saat ini.';
    } catch (error) {
        return `Gagal memproses permintaan API: ${error.message}`;
    }
};

const processRequest = async (m, mecha) => {
    if (!m.text || typeof m.text !== 'string') return m.reply('Berikan pertanyaan atau perintah yang jelas.');
    await mecha.sendReact(m.chat, '🕒', m.key);
    const formattedDate = getCurrentJakartaTime();
    const userId = m.sender;
    if (!memory[userId]) memory[userId] = [];
    memory[userId].push({ role: 'user', content: m.text });
    if (memory[userId].length > 6) memory[userId].shift();
    const conversationHistory = memory[userId].map(item => `${item.role === 'user' ? 'User' : 'AI'}: ${item.content}`).join('\n');
    const commonParams = {
        prompt: `Kamu adalah asisten AI yang sangat canggih dan profesional. Tanggal dan waktu saat ini di zona waktu Jakarta/Asia adalah ${formattedDate}. Gunakan informasi ini jika relevan dengan pertanyaan pengguna.\nPercakapan sebelumnya:\n${conversationHistory}`
    };
    const apiOptions = {
        method: 'POST',
        url: 'https://api.itsrose.rest/chatGPT/completions',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b',
            'Content-Type': 'application/json'
        },
        data: commonParams
    };
    const responseText = await apiRequest(apiOptions);
    await mecha.sendReact(m.chat, '✅', m.key);
    memory[userId].push({ role: 'ai', content: responseText });
    if (memory[userId].length > 6) memory[userId].shift();
    return `*[ CHATGPT COMPLETIONS ]*\n\n${responseText}`;
};

exports.run = {
    usage: [],
    hidden: ['ai3'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        try {
            const replyText = await processRequest(m, mecha);
            mecha.reply(m.chat, replyText, m);
        } catch (error) {
            mecha.reply(m.chat, `Terjadi kesalahan: ${error.message}`, m);
        }
    },
    limit: true
};
