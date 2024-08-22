const axios = require('axios');

async function downloadFacebook(query) {
  try {
    const response = await axios.get('https://skizo.tech/api/facebook', {
      params: {
        apikey: 'syauqi27',
        url: query
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal mengunduh video Facebook: ' + error.message);
  }
}

exports.run = {
  usage: ['facebook'],
  hidden: ['fbdl'],
  use: 'link facebook',
  category: 'downloader',
  async: async (m, { mecha }) => {
    if (!m.text) return m.reply(`Masukkan URL!\n\nContoh: *${m.cmd} https://www.facebook.com/watch/?v=1393572814172251*`);
    if (!m.args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(global.mess.error.url);
    if (m.args[0].includes('https://l.facebook.com/l.php?u=')) return m.reply(global.mess.error.url);
    
    mecha.sendReact(m.chat, '🕒', m.key);
    const start = performance.now();
    
    try {
      const res = await downloadFacebook(m.args[0]);
      if (!res.length) return m.reply(global.mess.error.api);
      
      const mediaUrl = res.find(video => video.quality === 'HD')?.url || res.find(video => video.quality === 'SD')?.url;
      if (!mediaUrl) return m.reply(global.mess.error.api);
      
      await mecha.sendMedia(m.chat, mediaUrl, m);
    } catch (error) {
      console.error(error);
      m.reply('Gagal mengunduh video Facebook. Silakan coba lagi nanti.');
    } finally {
      const end = performance.now();
      const processTime = ((end - start) / 1000).toFixed(3);
      await mecha.sendMessage(m.chat, { text: `*Waktu Proses*: ${processTime} Detik` }, { quoted: m });
      mecha.sendReact(m.chat, '✅', m.key);
    }
  },
  premium: true,
  limit: true
};