const axios = require('axios');
const chatMemory = {};

exports.run = {
    usage: [],
    hidden: ['gptf'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'beritahukan fungsi mu secara lengkap & mendetail'));
        mecha.sendReact(m.chat, '🕒', m.key);        
        if (!chatMemory[m.chat]) chatMemory[m.chat] = [];
        chatMemory[m.chat].push({ role: "user", content: m.text });
        if (chatMemory[m.chat].length > 3) chatMemory[m.chat].shift();
        
        const now = new Date();
        const jakartaOffset = 7 * 60;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const jakartaTime = new Date(utc + (jakartaOffset * 60000));
        const formattedDate = jakartaTime.toISOString().replace('T', ' ').split('.')[0];
        
        try {
            const options = {
                method: 'POST',
                url: 'https://chat-gtp-free.p.rapidapi.com/v1/chat/completions',
                headers: {
                    'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                    'x-rapidapi-host': 'chat-gtp-free.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    chatId: '92d97036-3e25-442b-9a25-096ab45b0525',
                    messages: [
                        { 
                            role: 'system', 
                            content: `Kamu adalah asisten AI canggih. Tugasmu adalah membantu pengguna dengan segala pertanyaan atau tugas yang mereka miliki. Selalu berikan jawaban yang jelas, singkat, dan profesional. Tanggal dan waktu saat ini di zona waktu Jakarta/Asia adalah ${formattedDate}. Gunakan informasi ini jika relevan dengan pertanyaan pengguna.` 
                        },
                        { role: 'user', content: m.text }
                    ]
                }
            };
            const response = await axios.request(options);
            const gptResponse = response.data.text || "Maaf, saya tidak dapat memberikan jawaban saat ini.";
            const creditRemaining = response.headers['x-ratelimit-requests-remaining'] || 'Tidak tersedia';
            const totalCredit = response.headers['x-ratelimit-requests-limit'] || 'Tidak tersedia';
            const creditInfo = `*Credit Info*: ${creditRemaining}/${totalCredit}`;
            chatMemory[m.chat].push({ role: "assistant", content: gptResponse });
            mecha.reply(m.chat, `${gptResponse}\n\n${creditInfo}`, m);
        } catch (error) {
            console.error(error);
            mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};