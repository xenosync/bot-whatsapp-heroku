const axios = require('axios');

exports.run = {
    usage: ['gemgo'],
    hidden: ['gg'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'apa saja fungsi utama mu'));
        
        mecha.sendReact(m.chat, '🕒', m.key);
        
        try {
            const response = await axios.get('https://api.firda.uz/gemgoai', {
                params: { t: m.text },
                headers: { 'accept': 'application/json' }
            });

            if (response.data.response) {
                const gemgoaiResponse = response.data.response.trim();
                mecha.reply(m.chat, gemgoaiResponse, m, { expiration: m.expiration });
            } else {
                throw new Error('Response data is missing');
            }
        } catch (error) {
            console.error(error);
            mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};