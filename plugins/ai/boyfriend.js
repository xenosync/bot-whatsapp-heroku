const axios = require('axios');

const chatMemory = {};

exports.run = {
    usage: [],
    hidden: ['boyfriend'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'Provide a message for the virtual girlfriend'));
        }

        mecha.sendReact(m.chat, '🕒', m.key);

        if (!chatMemory[m.chat]) {
            chatMemory[m.chat] = [];
        }

        chatMemory[m.chat].push({ role: 'user', content: m.text });

        const options = {
            method: 'POST',
            url: 'https://adult-gpt.p.rapidapi.com/adultgpt',
            headers: {
                'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                'x-rapidapi-host': 'adult-gpt.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                messages: [
                    {
                        role: 'user',
                        content: m.text
                    }
                ],
                genere: 'ai-bf-1',
                bot_name: '',
                temperature: 0.9,
                top_k: 10,
                top_p: 0.9,
                max_tokens: 200
            }
        };

        try {
            const response = await axios.request(options);
            let responseText = response.data.result.trim();
            if (responseText) {
                chatMemory[m.chat].push({ role: 'assistant', content: responseText });
                mecha.reply(m.chat, responseText, m);
            } else {
                mecha.reply(m.chat, 'No response from the virtual girlfriend', m);
            }
        } catch (error) {
            const errorMsg = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
            console.error("Error Response:", errorMsg);
            mecha.reply(m.chat, `An error occurred: ${errorMsg}`, m);
        }
    },
    limit: true
};