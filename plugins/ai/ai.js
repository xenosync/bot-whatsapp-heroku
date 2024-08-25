const axios = require('axios');
const memory = {};
const cleanResponse = (text) => text.replace(/\*\*/g, '*').replace(/_/g, '').replace(/`|```/g, '').trim();

const apiRequest = async (options) => {
    try {
        const { data } = await axios.request({ ...options, timeout: 10000 });
        return cleanResponse(data.result || 'Maaf, saya tidak dapat memberikan jawaban saat ini.');
    } catch (error) {
        return `Gagal memproses permintaan API: ${error.message}`;
    }
};

const processRequest = async (m, mecha) => {
    if (!m.text || typeof m.text !== 'string') return m.reply('Berikan pertanyaan atau perintah yang jelas.');
    await mecha.sendReact(m.chat, '🕒', m.key);
    const userId = m.sender;
    if (!memory[userId]) memory[userId] = [];
    memory[userId].push({ role: 'user', content: m.text });
    if (memory[userId].length > 6) memory[userId].shift();
    const conversationHistory = memory[userId].map(item => `${item.role === 'user' ? 'User' : 'AI'}: ${item.content}`).join('\n');
    const commonParams = {
        apikey: 'syauqi27',
        text: m.text,
        system: `Kamu adalah asisten AI yang sangat canggih dan profesional.\nPercakapan sebelumnya:\n${conversationHistory}`
    };
    const apiOptions = {
        method: 'GET',
        url: 'https://skizo.tech/api/openai',
        params: commonParams,
        headers: { 'Content-Type': 'application/json' }
    };
    const responseText = await apiRequest(apiOptions);
    await mecha.sendReact(m.chat, '✅', m.key);
    memory[userId].push({ role: 'ai', content: responseText });
    if (memory[userId].length > 6) memory[userId].shift();
    return `*[ CHATGPT4-O ]*\n\n${responseText}`;
};

exports.run = {
    usage: [],
    hidden: ['ai'],
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
