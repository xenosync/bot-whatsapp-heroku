const axios = require('axios');

// Fungsi untuk mencari video TikTok
async function ttSearch(query) {
return new Promise(async (resolve, reject) => {
axios("https://tikwm.com/api/feed/search", {
headers: {
"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
cookie: "current_language=en",
"User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
},
data: {
keywords: query,
count: 50,
cursor: 0,
web: 1,
hd: 1,
},
method: "POST",
}).then((res) => {
resolve(res.data.data.videos);
}).catch((err) => {
reject(err);
});
});
}

// Eksport fungsi utama
exports.run = {
usage: ['tiktoksearch2'],
hidden: ['ttsearch2'],
use: 'text',
category: 'downloader',
async: async (m, { func, mecha }) => {
try {
if (!m.text) return m.reply(func.example(m.cmd, 'jedag jedug'))
mecha.sendReact(m.chat, '🕒', m.key);
// Cari video TikTok berdasarkan query pengguna
let result = await ttSearch(m.text);
if (result.length === 0) {
return mecha.reply(m.chat, 'Tidak ada video ditemukan.', m);
}
// Kirim semua video hasil pencarian satu per satu
for (let video of result) {
let message = `Title: ${video.title}\nRegion: ${video.region}\nNo Watermark: ${video.play}\nWatermark: ${video.wmplay}\nMusic: ${video.music}`;
await mecha.sendMedia(m.chat, video.play, m, {
caption: message,
expiration: m.expiration
});
}
} catch (error) {
console.log(error);
mecha.reply(m.chat, 'Terjadi kesalahan dalam menjalankan perintah', m);
}
},
premium: true
}