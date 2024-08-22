const fetch = require('node-fetch');
const FormData = require('form-data');

exports.run = {
usage: ['outpainting'],
hidden: ['outpaint'],
use: 'reply image or input url',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
let link = '';
if (m.text) {
if (!func.isUrl(m.text)) return m.reply(global.mess.error.url);
// Jika URL diberikan secara langsung
link = m.text;
} else if (/image\/(png|jpe?g|gif)/.test(quoted.mime)) {
// Jika gambar direply
let media = await mecha.downloadAndSaveMediaMessage(m);
link = await (await func.UploadFileUgu(media)).url;
} else {
return m.reply(`Balas Gambar/Url\nExample: ${m.cmd} https://telegra.ph/file/db308811777d4f7bb83dc.png`);
}
mecha.sendReact(m.chat, '🕒', m.key);
let apiUrl = `https://api.itsrose.rest/image/outpainting`;
let payload = {
expand_ratio: 125,
init_image: link
};
try {
let response = await fetch(apiUrl, {
method: 'POST',
headers: {
'accept': 'application/json',
'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b',
'Content-Type': 'application/json'
},
body: JSON.stringify(payload)
});
let data = await response.json();
if (data.status && data.result) {
let buffer = await func.fetchBuffer(data.result.image)
// Mengirim gambar hasil outpainting dengan caption
await mecha.sendMessage(m.chat, {
image: buffer, 
caption: global.mess.ok
}, {quoted: m, ephemeralExpiration: m.expiration});
} else {
m.reply('❌ Failed to perform outpainting. Please try again later.');
}
} catch (error) {
console.error(error);
m.reply('❌ An error occurred. Please try again later.');
}
},
premium: true
}