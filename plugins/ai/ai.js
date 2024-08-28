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

const splitText = (text, maxLength) => {
    const parts = [];
    let current = '';

    for (const word of text.split(' ')) {
        if ((current + word).length > maxLength) {
            parts.push(current.trim());
            current = word;
        } else {
            current += ' ' + word;
        }
    }

    if (current.trim().length > 0) {
        parts.push(current.trim());
    }

    return parts;
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
        const textParts = splitText(m.text, 100); // Pecah teks menjadi bagian-bagian dengan panjang maksimal 100 karakter
        let fullResponse = '';

        for (const part of textParts) {
            const responseText = await apiRequestAlyaChan(part);
            fullResponse += responseText + ' ';
        }

        updateChatMemory(m.chat, { role: 'assistant', content: fullResponse.trim() });
        await mecha.sendReact(m.chat, '✅', m.key);
        return `*[ GOOGLE BARD ]*\n\n${fullResponse.trim()}`;
    } catch (error) {
        throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
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
