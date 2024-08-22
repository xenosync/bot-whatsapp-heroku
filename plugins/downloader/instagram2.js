const axios = require('axios');

function processApiResponse(response) {
  if (response.data.status !== 200 || !response.data.result || response.data.result.length === 0) {
    return { status: false, message: 'Tidak ada data yang ditemukan.' };
  }
  return {
    status: true,
    result: response.data.result.map(item => ({
      type: item.type,
      thumb: item.thumbnail,
      link: item.url
    }))
  };
}

async function fetchInstagramData(url) {
  try {
    const apiUrl = `https://api.yanzbotz.my.id/api/downloader/instagram?url=${encodeURIComponent(url)}&apiKey=yanzdev`;
    const response = await axios.get(apiUrl);
    return processApiResponse(response);
  } catch (error) {
    return { status: false, message: `Terjadi kesalahan: ${error.message}` };
  }
}

async function sendMediaAndReact(chat, results, mecha) {
  try {
    for (const item of results) {
      await mecha.sendMedia(chat, item.link, null, { caption: results.length === 1 ? global.mess.ok : '', thumbnail: item.thumb });
    }
    await mecha.sendReact(chat, '✅', null);
  } catch (error) {
    throw new Error(`Gagal mengirim media: ${error.message}`);
  }
}

exports.run = {
  usage: ['instagram2'],
  hidden: ['igdl2'],
  use: 'link instagram',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    if (!m.text || !/^https:\/\/www\.instagram\.com\/(p|reel|tv|stories)/gi.test(m.args[0])) {
      return m.reply(!m.text ? 'Masukkan linknya!' : `*Link salah! Perintah ini untuk mengunduh postingan ig/reel, dan juga stories!*\n\nContoh:\n${m.cmd} https://www.instagram.com/p/BmjK1KOD_UG/?utm_medium=copy_link\n${m.cmd} https://www.instagram.com/stories/_.angelchan._/3428674101513415415`);
    }
    mecha.sendReact(m.chat, '🕒', m.key);
    try {
      const { status, result, message } = await fetchInstagramData(m.args[0]);
      if (!status) return m.reply(message);
      await sendMediaAndReact(m.chat, result, mecha);
    } catch (error) {
      m.reply(`Terjadi kesalahan: ${error.message}`);
    }
  },
  premium: false,
  limit: 5
};