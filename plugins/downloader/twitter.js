const axios = require('axios');

async function downloadTwitter(url) {
  try {
    const response = await axios.get('https://skizo.tech/api/x', {
      params: {
        apikey: 'syauqi27',
        url: url
      }
    });
    const { media, authorName, authorUsername, date, likes, replies, retweets } = response.data;
    return {
      media,
      authorName,
      authorUsername,
      date,
      likes,
      replies,
      retweets
    };
  } catch (error) {
    throw new Error('Gagal mengunduh media Twitter: ' + error.message);
  }
}

exports.run = {
  usage: ['twitter'],
  hidden: ['twitterdl'],
  use: 'link twitter',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    let url = m.quoted && m.quoted.text ? m.quoted.text.trim() : m.text.trim();
    if (!url) return m.reply(func.example(m.cmd, 'https://x.com/ElonMuskAOC/status/1819812231468785942?s=19'));
    if (!url.includes('twitter.com') && !url.includes('x.com')) return m.reply(global.mess.error.url);

    mecha.sendReact(m.chat, '🕒', m.key);
    const start = performance.now();
    try {
      const data = await downloadTwitter(url);
      const caption = `*Author:* ${data.authorName} (@${data.authorUsername})\n` +
        `*Date:* ${data.date}\n` +
        `*Likes:* ${data.likes}\n` +
        `*Replies:* ${data.replies}\n` +
        `*Retweets:* ${data.retweets}`;

      const mediaMessages = data.media.map(item => {
        if (item.type === 'video') {
          return mecha.sendMessage(m.chat, { video: { url: item.url } }, { quoted: m });
        } else {
          return mecha.sendMessage(m.chat, { image: { url: item.url } }, { quoted: m });
        }
      });

      // Process all media messages in parallel
      await Promise.all(mediaMessages);

      const end = performance.now();
      const processTime = ((end - start) / 1000).toFixed(3);
      await mecha.sendMessage(m.chat, { text: `${caption}\n\n*Waktu Proses*: ${processTime} Detik` }, { quoted: m });
      mecha.sendReact(m.chat, '✅', m.key);
    } catch (error) {
      console.error(error);
      m.reply('Gagal mengunduh media Twitter. Silakan coba lagi nanti.');
    }
  },
  limit: 5
};