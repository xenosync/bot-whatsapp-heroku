const axios = require('axios');
const chatMemory = {};

exports.run = {
    usage: [],
    hidden: ['gptm'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'beritahukan fungsi mu secara lengkap & mendetail'));
        mecha.sendReact(m.chat, '🕒', m.key);
        const currentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' });
        if (!chatMemory[m.chat]) chatMemory[m.chat] = [];
        chatMemory[m.chat].push({ role: "assistant", content: m.text });
        if (chatMemory[m.chat].length > 3) chatMemory[m.chat].shift();  
        try {
            const options = {
                method: 'POST',
                url: 'https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions',
                headers: {
                    'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                    'x-rapidapi-host': 'chatgpt-best-price.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'assistant',
                            content: m.text
                        }
                    ]
                }
            };
            const response = await axios.request(options);
            const gptResponse = response.data.choices[0].message.content;
            chatMemory[m.chat].push({ role: "assistant", content: gptResponse });
            const creditsRemaining = response.headers['x-ratelimit-requests-remaining'];
            const creditsLimit = response.headers['x-ratelimit-requests-limit'];
            const finalResponse = `${gptResponse}\n\nKredit yang tersisa: ${creditsRemaining}/${creditsLimit}`;
            mecha.reply(m.chat, finalResponse, m, { expiration: m.expiration });
        } catch (error) {
            console.error(error);
            return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};