const axios = require('axios');
const chatMemory = {};

exports.run = {
    usage: [],
    hidden: ['infinite'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'beritahukan fungsi mu secara lengkap & mendetail'));
        mecha.sendReact(m.chat, '🕒', m.key);
        const currentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' });
        if (!chatMemory[m.chat]) chatMemory[m.chat] = [];
        chatMemory[m.chat].push({ role: "user", content: m.text });
        if (chatMemory[m.chat].length > 3) chatMemory[m.chat].shift();
        try {
            const options = {
                method: 'POST',
                url: 'https://infinite-gpt.p.rapidapi.com/infinite-gpt',
                headers: {
                    'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                    'x-rapidapi-host': 'infinite-gpt.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    query: m.text,
                    sysMsg: `Tanggal saat ini: ${currentDate}, Waktu saat ini: ${currentTime} dan responlah menggunakan bahasa Indonesia, bersikaplah professional tapi fokus pada jawaban (meminimalkan respon yang tidak perlu)`
                }
            };
            const response = await axios.request(options);
            const gptResponse = response.data.msg;
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