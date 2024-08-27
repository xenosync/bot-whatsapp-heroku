const axios = require('axios');
function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}
exports.run = {
  usage: ['tiktok', 'tiktokslide'],
  hidden: ['tt', 'ttslide'],
  use: 'link tiktok',
  category: 'downloader',
  async: async (m, { func, mecha, isPrem }) => {
    if (!m.text || !m.args[0].includes('tiktok.com')) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSF4cWcA2/') || global.mess.error.url);
    mecha.sendReact(m.chat, '🕒', m.key);
    try {
      let response = await axios.get(`https://api.tiklydown.eu.org/api/download/v5?url=${encodeURIComponent(m.args[0])}`, {
        headers: { 'accept': 'application/json' }
      });
      if (response.status !== 200) return m.reply(global.mess.error.api);
      let res = response.data.result;
      let txt = `*TIKTOK - DOWNLOADER*\n◦  *Author*: ${res.author.nickname}\n◦  *Duration*: ${res.duration} seconds\n◦  *Views*: ${formatNumber(res.play_count)}\n◦  *Likes*: ${formatNumber(res.digg_count)}\n◦  *Comments*: ${formatNumber(res.comment_count)}\n◦  *Shares*: ${formatNumber(res.share_count)}\n◦  *Downloads*: ${formatNumber(res.download_count)}\n◦  *Title*: ${res.title || 'No Description'}`.trimEnd();
      if (res.duration === 0 && res.images && res.images.length > 0) {
        let slide_info = `*TIKTOK - SLIDE*\n◦  *Author*: ${res.author.nickname}\n◦  *Views*: ${formatNumber(res.play_count)}\n◦  *Likes*: ${formatNumber(res.digg_count)}\n◦  *Comments*: ${formatNumber(res.comment_count)}\n◦  *Shares*: ${formatNumber(res.share_count)}\n◦  *Downloads*: ${formatNumber(res.download_count)}\n◦  *Total Images*: ${res.images.length}\n◦  *Title*: ${res.title || 'No Description'}`.trimEnd();
        await mecha.sendMessage(m.chat, { text: slide_info }, { quoted: m, ephemeralExpiration: m.expiration });

        for (let url of res.images) {
          await mecha.sendMessage(m.chat, { image: { url } }, { quoted: m, ephemeralExpiration: m.expiration });
        }

        if (res.music) {
          await mecha.sendMessage(m.chat, { audio: { url: res.music }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m, ephemeralExpiration: m.expiration });
        }
      } else {
        await mecha.sendMessage(m.chat, { video: { url: res.hdplay || res.play }, caption: txt }, { quoted: m, ephemeralExpiration: m.expiration });
        if (res.music) await mecha.sendMessage(m.chat, { audio: { url: res.music }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m, ephemeralExpiration: m.expiration });
      }
    } catch (error) {
      await mecha.sendMessage(m.chat, { text: `Maaf terjadi kesalahan:\n\nAn error occurred: ${error.message}\n\nStack Trace:\n${error.stack}` }, { quoted: m, ephemeralExpiration: m.expiration });
    }
  },
  premium: false,
  limit: 5
};
