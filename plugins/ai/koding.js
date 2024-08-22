const axios = require('axios');

exports.run = {
    usage: ['koding'],
    hidden: ['kd'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'print hello'));
        
        mecha.sendReact(m.chat, '🕒', m.key);
        
        try {
            const response = await axios.get('https://api.kyuurzy.site/api/ai/aiprompt', {
                params: {
                    prompt: 'Anda adalah Asisten AI Koding. Tugas Anda adalah hanya memberikan jawaban berupa kode tanpa penjelasan atau komentar tambahan. Setiap kali saya mengajukan pertanyaan atau memberikan Anda sepotong kode, Anda harus merespons hanya dengan kode yang diminta.',
                    query: m.text
                },
                headers: { 'accept': 'application/json' }
            });

            if (response.data.status) {
                const kodingResponse = response.data.result.trim();
                mecha.reply(m.chat, kodingResponse, m, { expiration: m.expiration });
            } else {
                throw new Error('Response status is false');
            }
        } catch (error) {
            console.error(error);
            mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};