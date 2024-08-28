const axios = require('axios');
const cheerio = require('cheerio');
const pinterest = async (url) => {
  const start = Date.now();
  try {
    const { data } = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`);
    const $ = cheerio.load(data);
    const download = [];
    $("tbody tr").each((_i, el) => {
      const quality = $(el).find(".video-quality").text().trim();
      const format = $(el).find("td").eq(1).text().trim().toLowerCase();
      const href = $(el).find("a").attr("href");
      if (href) {
        const link = `https://www.savepin.app/${href}`;
        download.push({ quality, format, link });
      }
    });
    return { download, duration: (Date.now() - start) / 1000 };
  } catch (err) {
    throw new Error(`Gagal mengunduh data Pinterest: ${err.message}\n\nError Details: ${err.response ? `Request failed with status code ${err.response.status}\nStatus Code: ${err.response.status}\nHeaders: ${JSON.stringify(err.response.headers, null, 2)}\n` : 'No response data available'}\nStack Trace: ${err.stack}`);
  }
};
exports.run = {
  usage: [],
  hidden: ['pindl', 'pinterestdl'],
  use: 'link pinterest',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    const url = (m.quoted && m.quoted.text || m.text).trim();
    if (!url) return m.reply(func.example(m.cmd, 'https://www.pinterest.com/pin/1234567890/'));
    mecha.sendReact(m.chat, '🕒', m.key);
    try {
      const { download, duration } = await pinterest(url);
      let sentMedia = false;
      const caption = `*Waktu proses*: ${duration.toFixed(3)} detik.`;
      for (const link of download) {
        console.log(`Checking media format: ${link.format}, link: ${link.link}`);
        if (['mp4', 'gif'].includes(link.format)) {
          await mecha.sendMessage(m.chat, {
            video: { url: link.link, gifPlayback: link.format === 'gif' },
            caption
          }, { quoted: m });
          sentMedia = true;
          break;
        } else if (['jpg', 'png'].includes(link.format)) {
          await mecha.sendMessage(m.chat, {
            image: { url: link.link },
            caption
          }, { quoted: m });
          sentMedia = true;
          break;
        }
      }
      if (sentMedia) {
        mecha.sendReact(m.chat, '✅', m.key);
      } else {
        mecha.sendReact(m.chat, '❌', m.key);
        m.reply(`No media found. ${caption}`);
      }
    } catch (error) {
      m.reply(`Internal Error: ${error.message}\n\nFull Error: ${JSON.stringify(error, null, 2)}`);
    }
  },
  premium: true,
  limit: 5
};
