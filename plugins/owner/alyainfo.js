const fetch = require('node-fetch');

exports.run = {
  usage: [],
  hidden: ['alya'],
  category: 'owner',
  async: async (m, { mecha }) => {
    const apiKey = '6nY0bL';
    const url = `https://api.alyachan.dev/v1/check-key?apikey=${apiKey}`;    
    try {
      const response = await fetch(url);
      const result = await response.json();      
      if (!response.ok || !result.status) {
        return m.reply('API Key tidak valid atau terjadi kesalahan pada server.');
      }
      const data = result.data;
      let txt = `乂  *A L Y A - I N F O*\n\n`;
      txt += `◦  Creator: ${result.creator}\n`;
      txt += `◦  Status: ${data.premium ? 'Premium' : 'Free'}\n`;
      txt += `◦  Limit: ${data.limit} dari 5000\n`;
      txt += `◦  Expired At: ${data.expired_at}\n`;
      txt += `◦  Joined At: ${data.joined_at}`;
      mecha.reply(m.chat, txt, m);
    } catch (error) {
      console.error(error);
      m.reply('Terjadi kesalahan saat menghubungi API AlyaChan. Silakan coba lagi nanti.');
    }
  },
  owner: true
};
