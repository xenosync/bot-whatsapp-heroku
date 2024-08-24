const axios = require('axios');

async function capcut(url) {
  try {
    let { data } = await axios.get(`https://api.alyachan.dev/api/capcut-dl?url=${encodeURIComponent(url)}&type=nowatermark&apikey=6nY0bL`, {
      headers: { 'accept': 'application/json' }
    });
    return data;
  } catch (error) {
    return null;
  }
}

exports.run = {
  usage: ['capcut'],
  hidden: [],
  use: 'url capcut',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    const capcutRegex = /https:\/\/www\.capcut\.com\/[^\s]+/i;
    const match = m.text.match(capcutRegex);
    if (!match) return m.reply(global.mess.error.url);
    const url = match[0];
    mecha.sendReact(m.chat, '🕒', m.key);
    let result = await capcut(url);
    if (!result || !result.status) return m.reply(global.mess.error.api);
    const { title, description, url: downloadUrl } = result.data;
    if (downloadUrl) {
      await mecha.sendMedia(m.chat, downloadUrl, m, { caption: `*Title:* ${title}\n*Description:* ${description.trim()}` });
      mecha.sendReact(m.chat, '✅', m.key);
    } else {
      m.reply(global.mess.error.api);
    }
  },
  premium: false,
  limit: 5
};
