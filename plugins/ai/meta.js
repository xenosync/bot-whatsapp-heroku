const axios = require('axios');

const chatMemory = {};

exports.run = {
    usage: [],
    hidden: ['meta'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'Berikan pertanyaan untuk diajukan kepada Meta Llama'));
        }

        mecha.sendReact(m.chat, '🕒', m.key);

        if (!chatMemory[m.chat]) {
            chatMemory[m.chat] = [];
        }

        chatMemory[m.chat].push({ role: 'user', content: m.text });

        const options = {
            method: 'POST',
            url: 'https://meta-llama-fast-api.p.rapidapi.com/mistralchat',
            headers: {
                'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                'x-rapidapi-host': 'meta-llama-fast-api.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                message: m.text
            }
        };

        try {
            const response = await axios.request(options);
            let responseText = response.data.trim();
            if (responseText.endsWith('</s>')) {
                responseText = responseText.slice(0, -4).trim();
            }
            if (responseText) {
                chatMemory[m.chat].push({ role: 'assistant', content: responseText });
                mecha.reply(m.chat, responseText, m);
            } else {
                mecha.reply(m.chat, 'Tidak ada respons dari Meta Llama', m);
            }
        } catch (error) {
            const errorMsg = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
            console.error("Error Response:", errorMsg);
            mecha.reply(m.chat, `Terjadi kesalahan: ${errorMsg}`, m);
        }
    },
    limit: true
};