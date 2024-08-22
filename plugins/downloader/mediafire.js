const fetch = require('node-fetch');
exports.run = {
  usage: ['mediafire'],
  hidden: ['mfire', 'mfdl'],
  use: 'link mediafire',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    const mediafireLink = m.text.match(/https?:\/\/(www\.)?mediafire\.com\/[^\s]+/);
    if (!mediafireLink) return m.reply(func.example(m.cmd, 'https://www.mediafire.com/file/a61862y1tgvfiim/ZackBotMans+(+Versi+1.0.1+).zip/file'));
    mecha.sendReact(m.chat, '🕒', m.key);
    const apiUrl = 'https://itzpire.com/download/mediafire?url=' + encodeURIComponent(mediafireLink[0]);
    try {
      const response = await fetch(apiUrl);
      const res = await response.json();
      if (res.status !== 'success') return m.reply(global.mess.error.api);
      let txt = `乂  *MEDIAFIRE DOWNLOADER*\n\n◦ File Name: ${res.data.title}\n◦ File Size: ${res.data.size?.trim()}\n\n_Please wait media is being sent..._`;
      mecha.reply(m.chat, txt, m);
      await mecha.sendMedia(m.chat, res.data.url, m, { caption: global.mess.ok, fileName: res.data.title, expiration: m.expiration });
    } catch (error) {
      console.error('Error:', error);
      m.reply(global.mess.error.api);
    }
  },
  premium: true,
  limit: 5
};