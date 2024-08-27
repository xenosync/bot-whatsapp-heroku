const axios = require('axios');

async function instagram(url) {
  const apiURL = `https://skizo.tech/api/instagram?apikey=syauqi27&url=${url}`;
  try {
    const response = await axios.get(apiURL);
    const data = response.data;
    if (!data || data.length === 0) return { status: false, message: 'Tidak ada data yang ditemukan.' };
    const result = data.map(item => ({ thumb: item.thumbnail, link: item.url, options: [] }));
    return { status: true, result };
  } catch (error) {
    return { status: false, message: String(error) };
  }
}

async function sendMediaSequentially(chat, mediaItems, mecha, message, retryCount = 3) {
  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    let success = false;
    while (retryCount > 0 && !success) {
      try {
        await mecha.sendMedia(chat, item.link, message, { expiration: message.expiration });
        success = true;
      } catch (error) {
        retryCount--;
        if (retryCount === 0) {
          message.reply(`Terjadi kesalahan saat mengirim media ${i + 1}: ${String(error)}`);
        }
      }
    }
  }
}

exports.run = {
  usage: ['instagram2'],
  hidden: ['igdl2'],
  use: 'link instagram',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    if (!m.text) return m.reply('Masukkan linknya!');
    if (!m.args[0].match(/https:\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) 
      return m.reply(`*Link salah! Perintah ini untuk mengunduh postingan ig/reel/tv, dan juga stories!*\n\nContoh:\n${m.cmd} https://www.instagram.com/p/BmjK1KOD_UG/?utm_medium=copy_link\n${m.cmd} https://www.instagram.com/stories/_.angelchan._/3428674101513415415`);
    mecha.sendReact(m.chat, '🕒', m.key);
    try {
      const res = await instagram(m.args[0]);
      if (!res.status) return m.reply(res.message);
      await sendMediaSequentially(m.chat, res.result, mecha, m);
      mecha.sendReact(m.chat, '✅', m.key);
    } catch (error) {
      m.reply(`Terjadi kesalahan: ${String(error)}`);
    }
  },
  premium: false,
  limit: 5
};
