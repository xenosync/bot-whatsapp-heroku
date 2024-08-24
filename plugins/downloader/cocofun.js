const axios = require('axios');

async function cocofun(url) {
  try {
    const { data } = await axios.get(`https://api.alyachan.dev/api/cocofun?url=${encodeURIComponent(url)}&apikey=6nY0bL`);
    return data;
  } catch {
    return { status: false, message: 'API request failed' };
  }
}

exports.run = {
  usage: ['cocofun'],
  hidden: [],
  use: 'url cocofun',
  category: 'downloader',
  async: async (m, { mecha }) => {
    const cocofunRegex = /https:\/\/(?:www\.)?icocofun\.com\/share\/post\/\d+/i;
    const match = m.text.match(cocofunRegex);
    if (!match) return m.reply('Invalid URL. Please provide a valid CocoFun URL.');
    const url = match[0];
    mecha.sendReact(m.chat, '🕒', m.key);
    const result = await cocofun(url);
    if (!result || !result.status) return m.reply('Failed to fetch video. Please try again later.');
    const downloadUrl = result.data.url;
    if (downloadUrl) {
      try {
        await mecha.sendMedia(m.chat, downloadUrl, m);
        mecha.sendReact(m.chat, '✅', m.key);
      } catch {
        m.reply('Failed to send the video. Please try again later.');
      }
    } else {
      m.reply('No video URL found.');
    }
  },
  premium: false,
  limit: 5
};
