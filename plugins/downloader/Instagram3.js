const axios = require('axios');

function processApiResponse(response) {
  if (response.data.status !== true || !response.data.result || !response.data.result.urls || response.data.result.urls.length === 0) {
    return { status: false, message: 'Tidak ada data yang ditemukan.' };
  }
  return {
    status: true,
    result: response.data.result.urls.map(url => ({
      link: url
    }))
  };
}

async function fetchInstagramData(url) {
  try {
    const apiUrl = `https://api.itsrose.rest/downloader/ig?url=${encodeURIComponent(url)}`;
    const headers = {
      'accept': 'application/json',
      'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b'
    };
    const response = await axios.get(apiUrl, { headers });
    return processApiResponse(response);
  } catch (error) {
    return { status: false, message: `Terjadi kesalahan: ${error.message}` };
  }
}

async function sendMediaAndReact(chat, results, mecha) {
  try {
    for (const item of results) {
      await mecha.sendMedia(chat, item.link, null, { caption: results.length === 1 ? global.mess.ok : '' });
    }
    await mecha.sendReact(chat, '✅', null);
  } catch (error) {
    throw new Error(`Gagal mengirim media: ${error.message}`);
  }
}

exports.run = {
  usage: ['instagram3'],
  hidden: ['igdl3'],
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