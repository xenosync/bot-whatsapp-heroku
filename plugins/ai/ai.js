const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const chatMemoryFilePath = path.join(__dirname, 'chatMemory.json');

const cleanResponse = (text) => 
    text.replace(/\*\*/g, '*').replace(/_/g, '').replace(/`|```/g, '').trim();

const loadChatMemory = async () => {
    if (await fs.pathExists(chatMemoryFilePath)) {
        return await fs.readJson(chatMemoryFilePath);
    }
    return {};
};

const saveChatMemory = async (chatMemory) => {
    await fs.writeJson(chatMemoryFilePath, chatMemory);
};

const updateChatMemory = async (chatId, message) => {
    const chatMemory = await loadChatMemory();
    chatMemory[chatId] = chatMemory[chatId] || [];
    if (chatMemory[chatId].length >= 100) {
        chatMemory[chatId].shift();
    }
    chatMemory[chatId].push(message);
    await saveChatMemory(chatMemory);
};

const getCurrentJakartaTime = () => {
    const jakartaOffset = 7 * 60;
    const utc = Date.now() + (new Date().getTimezoneOffset() * 60000);
    return new Date(utc + (jakartaOffset * 60000)).toISOString().replace('T', ' ').split('.')[0];
};

const apiRequestBard = async (query) => {
    try {
        const response = await axios.get('https://api.alyachan.dev/api/bard-google-ai', {
            params: { q: query, apikey: '6nY0bL' },
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000
        });
        let bardResponse = response.data.data.chats || 'Maaf, saya tidak dapat memberikan jawaban saat ini.';
        return cleanResponse(bardResponse);
    } catch (error) {
        throw new Error(`Gagal memproses permintaan API Bard: ${error.message}`);
    }
};

const apiRequestGemini = async (query) => {
    try {
        const { data } = await axios.get('https://api.alyachan.dev/api/ai-gemini', {
            params: { q: query, apikey: '6nY0bL' },
            timeout: 60000
        });
        if (data && data.data && data.data.content) {
            return cleanResponse(data.data.content);
        } else {
            return 'Maaf, saya tidak dapat memberikan jawaban saat ini. Coba lagi nanti.';
        }
    } catch (error) {
        throw new Error(`Gagal memproses permintaan API Gemini: ${error.message}`);
    }
};

const processRequest = async (m, mecha) => {
    if (!m.text || typeof m.text !== 'string') return m.reply('Berikan pertanyaan atau perintah yang jelas.');
    await mecha.sendReact(m.chat, '🕒', m.key);
    await updateChatMemory(m.chat, { role: 'user', content: m.text });
    const formattedDate = getCurrentJakartaTime();
    try {
        const responseText = await apiRequestBard(m.text);
        await updateChatMemory(m.chat, { role: 'assistant', content: responseText });
        await mecha.sendReact(m.chat, '✅', m.key);
        return `*[ GOOGLE BARD ]*\n\n${responseText}`;
    } catch (bardError) {
        try {
            const responseText = await apiRequestGemini(m.text);
            await updateChatMemory(m.chat, { role: 'assistant', content: responseText });
            await mecha.sendReact(m.chat, '✅', m.key);
            return `*[ GOOGLE GEMINI ]*\n\n${responseText}`;
        } catch (geminiError) {
            await mecha.sendReact(m.chat, '❌', m.key);
            return `Terjadi kesalahan: ${geminiError.message}`;
        }
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
