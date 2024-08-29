const fetch = require('node-fetch');

exports.run = {
  usage: ['cekproxy'],
  use: 'proxy',
  category: 'tools',
  async: async (m, { func, mecha }) => {
    const proxy = m.args[0];
    if (!proxy) return m.reply('Harap masukkan proxy yang ingin diperiksa dalam format IP:PORT, contoh: 185.105.90.88:4444');
    if (!proxy.includes(':')) return m.reply('Format proxy tidak valid. Gunakan format IP:PORT, contoh: 185.105.90.88:4444');   
    try {
      const { data, status } = await fetch(`https://api.alyachan.dev/api/proxycheck?proxy=${proxy}&apikey=6nY0bL`)
        .then(res => res.json());
      if (!status || !data.length) return m.reply('Proxy tidak valid atau terjadi kesalahan saat memeriksa proxy.');
      const { ip, port, country, type, working } = data[0];
      const txt = [
        `◦  IP : ${ip}`,
        `◦  Port : ${port}`,
        `◦  Country : ${country}`,
        `◦  Type : ${type}`,
        `◦  Working : ${working ? 'Yes' : 'No'}`
      ].join('\n');
      mecha.reply(m.chat, txt, m, { expiration: m.expiration });      
    } catch (error) {
      m.reply(`Terjadi kesalahan: ${error.message}`);
    }
  },
  premium: true,
  limit: 5
};
