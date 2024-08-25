const axios = require('axios');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const apiKey = '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';
const groq = new Groq({ apiKey: apiKey });
const dataFilePath = path.join(__dirname, 'conversations2.json');
const cleanResponse = (text) => text.replace(/\*\*/g, '*').replace(/_/g, '').replace(/`|```/g, '').trim();

// Fungsi untuk menghapus memori setelah 10 menit
const deleteMemory = (sessionId) => {
    let conversations = {};
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        conversations = JSON.parse(data);
    }
    if (conversations[sessionId]) {
        delete conversations[sessionId];
        fs.writeFileSync(dataFilePath, JSON.stringify(conversations, null, 2));
        console.log(`Memory for session ${sessionId} has been deleted due to inactivity.`);
    }
};

// Simpan pesan ke dalam memori
const saveMessage = (sessionId, role, content) => {
    let conversations = {};
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        conversations = JSON.parse(data);
    }
    if (!conversations[sessionId]) {
        conversations[sessionId] = [];
    }
    conversations[sessionId].push({ role, content });
    fs.writeFileSync(dataFilePath, JSON.stringify(conversations, null, 2));

    // Set timeout untuk menghapus memori setelah 10 menit
    setTimeout(() => deleteMemory(sessionId), 10 * 60 * 1000); // 10 menit dalam milidetik
};

const getConversationHistory = (sessionId) => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        const conversations = JSON.parse(data);
        return conversations[sessionId] || [];
    }
    return [];
};

const ai = async (sessionId, userMessage) => {
    const history = getConversationHistory(sessionId);
    const messages = [
        { role: 'system', content: 'Kamu adalah asisten AI yang sangat canggih dan profesional, bahasa yang selalu kamu gunakan adalah bahasa Indonesia.' },
        ...history,
        { role: 'user', content: userMessage }
    ];
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-70b-versatile',
            temperature: 0.7,
            max_tokens: 5000,
            top_p: 1,
            stream: true,
            stop: null
        });
        let aiResponse = '';
        for await (const chunk of chatCompletion) {
            aiResponse += chunk.choices[0]?.delta?.content || '';
        }
        saveMessage(sessionId, 'assistant', aiResponse);
        return cleanResponse(aiResponse);
    } catch (error) {
        console.error('Error generating AI response:', error);
        return `Error: ${error.message}\nStack: ${error.stack}`;
    }
};

const processRequest = async (m, mecha) => {
    if (!m.text || typeof m.text !== 'string') return m.reply('Berikan pertanyaan atau perintah yang jelas.');
    await mecha.sendReact(m.chat, '🕒', m.key);
    const sessionId = m.sender;
    try {
        const aiResponse = await ai(sessionId, m.text);
        await mecha.sendReact(m.chat, '✅', m.key);
        return `*[ LLAMA-3.1-70B-VERSATILE ]*\n\n${aiResponse}`;
    } catch (error) {
        await mecha.sendReact(m.chat, '❌', m.key);
        return `Terjadi kesalahan: ${error.message}\nStack: ${error.stack}`;
    }
};

exports.run = {
    usage: [],
    hidden: ['ai2'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        try {
            const replyText = await processRequest(m, mecha);
            mecha.reply(m.chat, replyText, m);
        } catch (error) {
            mecha.reply(m.chat, `Terjadi kesalahan: ${error.message}\nStack: ${error.stack}`, m);
        }
    },
    limit: true
};
