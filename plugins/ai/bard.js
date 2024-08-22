const axios = require('axios');
const chatMemory = {};

const cleanResponse = (text) => text.replace(/\*\*/g, '*').replace(/_/g, '').replace(/`|```/g, '').trim();

const updateChatMemory = (chatId, message) => {
    chatMemory[chatId] = chatMemory[chatId] || [];
    if (chatMemory[chatId].length >= 100) {
        chatMemory[chatId].shift();
    }
    chatMemory[chatId].push(message);
};

const getCurrentJakartaTime = () => {
    const jakartaOffset = 7 * 60;
    const utc = Date.now() + (new Date().getTimezoneOffset() * 60000);
    return new Date(utc + (jakartaOffset * 60000)).toISOString().replace('T', ' ').split('.')[0];
};

const apiRequestAlyaChan = async (query) => {
    try {
        const response = await axios.get('https://api.alyachan.dev/api/bard-google-ai', {
            params: { q: query, apikey: '6nY0bL' },
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        let alyaChanResponse = response.data.data.chats || 'Maaf, saya tidak dapat memberikan jawaban saat ini.';
        return cleanResponse(alyaChanResponse);
    } catch (error) {
        throw new Error(`Gagal memproses permintaan API AlyaChan: ${error.message}`);
    }
};

const processRequest = async (m, mecha) => {
    if (!m.text || typeof m.text !== 'string') return m.reply('Berikan pertanyaan atau perintah yang jelas.');
    await mecha.sendReact(m.chat, '🕒', m.key);
    updateChatMemory(m.chat, { role: 'user', content: m.text });
    const formattedDate = getCurrentJakartaTime();
    try {
        const responseText = await apiRequestAlyaChan(m.text);
        updateChatMemory(m.chat, { role: 'assistant', content: responseText });
        await mecha.sendReact(m.chat, '✅', m.key);
        return `*[ BARD GOOGLE ]*\n\n${responseText}`;
    } catch (error) {
        throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
};

exports.run = {
    usage: [],
    hidden: ['bard'],
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