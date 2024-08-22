const axios = require('axios');

exports.run = {
    usage: ['bochi'],
    hidden: [''],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'peluk bochi'));
        
        mecha.sendReact(m.chat, '🕒', m.key);
        
        try {
            const response = await axios.get('https://api.kyuurzy.site/api/ai/Bocchi', {
                params: { query: m.text },
                headers: { 'accept': 'application/json' }
            });

            if (response.data.status) {
                const bochiResponse = response.data.result.trim();
                mecha.reply(m.chat, bochiResponse, m, { expiration: m.expiration });
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