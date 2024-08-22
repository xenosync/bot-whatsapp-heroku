const axios = require('axios');

exports.run = {
    usage: [],
    hidden: ['llama'],
    use: 'question',
    category: 'ai',
    async: async (m, { mecha }) => {
        if (!m.text) return m.reply('Harap berikan pertanyaan.');
        mecha.sendReact(m.chat, '🕒', m.key);
        const query = m.text.length > 200 ? m.text.substring(0, 200) : m.text;
        try {
            let response = await axios.get('https://llm-chat.vercel.app/api', {
                params: { text: query },
                headers: { 'accept': 'application/json' }
            });
            let llamaResponse = response.data;
            if (llamaResponse.includes('butuh informasi waktu')) {
                const date = new Date();
                const options = {
                    timeZone: 'Asia/Jakarta',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                const dateTime = date.toLocaleString('id-ID', options).replace(',', '');
                response = await axios.get('https://llm-chat.vercel.app/api', {
                    params: { text: `${query} (waktu: ${dateTime})` },
                    headers: { 'accept': 'application/json' }
                });

                llamaResponse = response.data;
            }
            mecha.reply(m.chat, llamaResponse || "Maaf, saya tidak dapat memberikan jawaban saat ini.", m);
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            mecha.reply(m.chat, "Terjadi kesalahan saat memproses permintaan Anda.", m);
        }
    },
    limit: true
};