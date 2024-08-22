const axios = require('axios');

const apiUrlMorphic = 'https://api.shannmoderz.xyz/ai/morphic';

exports.run = {
  usage: [],
  hidden: ['morphic'],
  use: 'question',
  category: 'ai',
  async: async (m, { func, mecha }) => {
    if (!m.text) {
      return m.reply(func.example(m.cmd, 'Berikan pertanyaan untuk diajukan kepada Morphic'));
    }
    
    mecha.sendReact(m.chat, '🕒', m.key);

    const options = {
      method: 'GET',
      url: apiUrlMorphic,
      params: {
        query: m.text
      },
      headers: {
        'accept': 'application/json'
      }
    };

    try {
      const response = await axios.request(options);
      const responseText = response.data.result || 'Tidak ada respons dari Morphic';
      mecha.reply(m.chat, responseText, m, {
        expiration: m.expiration
      });
    } catch (error) {
      console.error(error);
      mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
    }
  },
  limit: true
};