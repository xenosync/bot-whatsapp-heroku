exports.run = {
  usage: ['tiktok', 'tiktokslide'],
  hidden: ['tt', 'ttslide'],
  use: 'link tiktok',
  category: 'downloader',
  async: async (m, { func, mecha, isPrem }) => {
    if (!m.text || !m.args[0].includes('tiktok.com')) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSF4cWcA2/') || global.mess.error.url);
    mecha.sendReact(m.chat, '🕒', m.key);
    try {
      let res = await func.fetchJson(`https://api.itsrose.rest/downloader/tiktok?url=${encodeURIComponent(m.args[0])}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b'
        }
      });
      if (!res.status) return m.reply(global.mess.error.api);
      let txt = `*TIKTOK - DOWNLOADER*\n◦  *Author*: ${res.author.nickname}\n◦  *Duration*: ${res.duration} seconds\n◦  *Title*: ${res.desc || 'No Description'}`;
      if (res.type === 'video') {
        await mecha.sendMessage(m.chat, { video: { url: res.download.nowm || res.download.wm }, caption: txt }, { quoted: m, ephemeralExpiration: m.expiration });
        if (res.download.music) await mecha.sendMessage(m.chat, { audio: { url: res.download.music }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m, ephemeralExpiration: m.expiration });
      } else if (res.download.images && res.download.images.length > 0) {
        txt = `*TIKTOK - SLIDE*\n- Total Images: ${res.download.images.length}\n\n_Please wait, the images are being sent..._`;
        await mecha.sendMessage(m.chat, { text: txt }, { quoted: m, ephemeralExpiration: m.expiration });
        await Promise.all(res.download.images.map(url => mecha.sendMessage(m.chat, { image: { url } }, { quoted: m, ephemeralExpiration: m.expiration })));
        if (res.download.music) await mecha.sendMessage(m.chat, { audio: { url: res.download.music }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m, ephemeralExpiration: m.expiration });
      } else {
        m.reply('Content not found.');
      }
    } catch {
      m.reply('Maaf terjadi kesalahan.');
    }
  },
  premium: false,
  limit: 5
};