const axios = require('axios');
const memory = {};

const cleanResponse = (text) => text.replace(/\*\*/g, '*').replace(/_/g, '').replace(/`|```/g, '').trim();

const getCurrentJakartaTime = () => new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000)
    .toISOString().replace('T', ' ').split('.')[0];

const apiRequest = async (query) => {
    try {
        const { data } = await axios.get('https://api.alyachan.dev/api/ai-gemini', {
            params: {
                q: query,
                apikey: '6nY0bL'
            },
            timeout: 10000
        });
        if (data && data.data && data.data.content) {
            return cleanResponse(data.data.content);
        } else {
            return 'Maaf, saya tidak dapat memberikan jawaban saat ini. Coba lagi nanti.';
        }
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
    
    const responseText = await apiRequest(m.text);
    await mecha.sendReact(m.chat, '✅', m.key);
    
    memory[userId].push({ role: 'ai', content: responseText });
    if (memory[userId].length > 6) memory[userId].shift();
    return `*[ GEMINI ]*\n\n${responseText}`;
};

exports.run = {
    usage: [],
    hidden: ['gemini'],
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