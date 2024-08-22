const axios = require('axios');

exports.run = {
  usage: [],
  hidden: ['blackbox'],
  use: 'question',
  category: 'ai',
  async: async (m, { func, mecha }) => {
    if (!m.text) return mecha.reply(m.chat, func.example(m.cmd, 'hai siapa kamu'));

    mecha.sendReact(m.chat, '🕒', m.key);

    try {
      const response = await axios.get('https://api.kyuurzy.site/api/ai/blackbox', {
        params: { query: m.text },
        headers: { 'accept': 'application/json' }
      });

      if (response.data.status) {
        const blackboxResponse = response.data.result.replace(/\$@\$.+?\$@\$/g, '').trim();
        mecha.reply(m.chat, blackboxResponse, m, { expiration: m.expiration });
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