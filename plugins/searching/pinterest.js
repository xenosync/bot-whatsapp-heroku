const func = require('./function.js');
exports.run = {
  usage: ['pinterest'],
  hidden: ['pin'],
  use: 'text',
  category: 'searching',
  async: async (m, { mecha, isPrem }) => {
    if (!m.text) return m.reply(func.example(m.cmd, 'nakano miku'));
    if (m.text.startsWith('@62')) return m.reply('Stress ??');
    mecha.sendReact(m.chat, '🕒', m.key);
    let [query, num] = m.text.split('|').map(v => v.trim());
    let count = num ? Math.min(Math.max(parseInt(num), 1), 10) : 10;
    try {
      let data = await func.pinterestv2(query, count);
      if (data.length === 0) return m.reply('Tidak ditemukan.');
      await m.reply(`ditemukan *${data.length}* photo, wait sedang dikirim...`);
      for (let [index, url] of data.entries()) {
        await func.delay(900);
        mecha.sendMessage(m.chat, {
          image: { url: url },
          caption: `${data.length > 1 ? `Image *(${index + 1}/${data.length})*` : global.mess.ok}`
        }, { quoted: m, ephemeralExpiration: m.expiration });
      }
    } catch (error) {
      m.reply('Terjadi kesalahan saat memproses permintaan.');
      console.error(error);
    }
  },
  restrict: true,
  limit: 3
};
