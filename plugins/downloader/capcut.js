const axios = require('axios');

async function capcut(url) {
  try {
    let { data } = await axios.get(`https://api.shannmoderz.xyz/downloader/capcut?url=${encodeURIComponent(url)}`, {
      headers: { 'accept': 'application/json' }
    });
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

exports.run = {
  usage: ['capcut'],
  hidden: ['cc'],
  use: 'url capcut',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    if (!m.text) return m.reply(`Masukkan URL!\n\nContoh: *${m.cmd} https://www.capcut.com/t/Zs8YEmRmj/*`);
    if (!m.args[0].includes('www.capcut.com')) return m.reply(global.mess.error.url);
    mecha.sendReact(m.chat, '🕒', m.key);
    let result = await capcut(m.args[0]);
    if (result == null || !result.status) return m.reply(global.mess.error.api);

    const { title, size, url: downloadUrl } = result.result;
    let responseMessage = `*Title:* ${title}\n*Size:* ${size} MB\n*URL:* ${downloadUrl}`;

    await mecha.sendMessage(m.chat, {
      text: responseMessage
    }, { quoted: m });
  },
  premium: true,
  limit: 5
};