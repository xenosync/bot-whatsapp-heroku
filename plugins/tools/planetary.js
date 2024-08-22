const axios = require('axios');

exports.run = {
usage: ['planetary'],
hidden: ['nasa'],
category: 'tools',
async: async (m, { func, mecha }) => {
const apiKey = 'KgUfOXRfiCl4DgPZeMabglgWCcGE8wwWXmVxtuhL'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
m.reply(global.mess.wait)
try {
const response = await axios.get(apiUrl);
if (response.status === 200) {
if (response.data.url) {
const image_url = response.data.hdurl;
await mecha.sendMessage(m.chat, {image: {url: image_url}, caption: global.mess.ok }, {quoted: m, ephemeralExpiration: m.expiration})
} else {
m.reply('Tidak ada URL gambar yang ditemukan dalam respons NASA.');
}
} else {
m.reply(`Gagal Mengambil Data Dari Api NASA`);
}
} catch (error) {
m.reply(`Terjadi kesalahan: ${error.message}`);
}
},
limit: 5
}