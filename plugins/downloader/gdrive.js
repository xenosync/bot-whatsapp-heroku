const axios = require('axios');

async function GDriveDl(url) {
  if (!(url && url.match(/drive\.google/i))) {
    throw new Error('Invalid URL');
  }
  const id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
  if (!id) {
    throw new Error('ID Not Found');
  }
  const apiURL = `https://skizo.tech/api/gdrive?apikey=syauqi27&url=${encodeURIComponent(url)}`;
  try {
    const response = await axios.get(apiURL);
    const { fileName, sizeBytes, downloadUrl } = response.data;
    return {
      downloadUrl,
      fileName,
      fileSize: formatSize(sizeBytes),
      mimetype: 'application/octet-stream' // Skizo API tidak memberikan mimetype, sehingga menggunakan default value
    };
  } catch (error) {
    throw new Error('Bot tidak memiliki akses ke GoogleDrive ini: ' + error.message);
  }
}

function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

exports.run = {
  usage: ['gdrive'],
  hidden: ['googledrive'],
  use: 'link google drive',
  category: 'downloader',
  async: async (m, { func, mecha, setting }) => {
    let url = m.quoted && m.quoted.text ? m.quoted.text.trim() : m.text.trim();
    if (!url) return m.reply('Masukkan link google drive yang ingin di download.');
    if (!url.includes('drive.google.com')) return m.reply(global.mess.error.url);
    mecha.sendReact(m.chat, '🕒', m.key);
    const start = performance.now();
    try {
      const res = await GDriveDl(url);
      let txt = `乂  *GOOGLE DRIVE DOWNLOADER*\n`
      txt += `\n*File Name:* ${res.fileName}`;
      txt += `\n*File Size:* ${res.fileSize}`;
      txt += `\n*MIME Type:* ${res.mimetype}`;
      txt += `\n\n_Please wait, media is being sent..._`;
      mecha.reply(m.chat, txt, m);
      await mecha.sendMedia(m.chat, res.downloadUrl, m, {
        caption: global.mess.ok,
        fileName: res.fileName,
        expiration: m.expiration
      });
      const end = performance.now();
      const processTime = ((end - start) / 1000).toFixed(3);
      await mecha.sendMessage(m.chat, { text: `*Waktu Proses*: ${processTime} Detik` }, { quoted: m });
      mecha.sendReact(m.chat, '✅', m.key);
    } catch (error) {
      console.error(error);
      m.reply('Gagal mengunduh file Google Drive. Silakan coba lagi nanti.');
    }
  },
  premium: true,
  limit: 5
};