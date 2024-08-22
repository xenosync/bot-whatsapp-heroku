const axios = require('axios');
const chatMemory = {};

exports.run = {
    usage: [],
    hidden: ['rad3'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'apakah kamu gpt3?'));
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        const currentDate = new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!chatMemory[m.chat]) {
            chatMemory[m.chat] = [];
        }
        chatMemory[m.chat].push({ role: "user", content: m.text });
        if (chatMemory[m.chat].length > 3) {
            chatMemory[m.chat].shift();
        }
        try {
            const options = {
                method: 'POST',
                url: 'https://chatgpt-api8.p.rapidapi.com/',
                headers: {
                    'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                    'x-rapidapi-host': 'chatgpt-api8.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: [
                    {
                        role: 'system',
                        content: `You are ChatGPT, a large language model trained by OpenAI. You are chatting with the user via the ChatGPT Android app. This means most of the time your lines should be a sentence or two, unless the user's request requires reasoning or long-form outputs. Current date: ${currentDate}.`
                    },
                    ...chatMemory[m.chat]
                ]
            };
            const response = await axios.request(options);
            const gptResponse = response.data.text;
            chatMemory[m.chat].push({ role: "assistant", content: gptResponse });
            mecha.reply(m.chat, gptResponse, m, {
                expiration: m.expiration
            });
        } catch (error) {
            console.error(error);
            return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};