const fetch = require('node-fetch');

exports.run = {
usage: ['osmage'],
hidden: ['osm'],
use: 'reply image or input url',
category: 'ai',
async: async (m, { func, mecha }) => {
let q = m.quoted ? m.quoted : m;
let mime = (q.msg || q).mimetype || '';
let url = m.text.split(' ')[1];
if (url) {
if (!func.isUrl(url)) return m.reply(global.mess.error.url)
var link = url;
} else if (/image\/(png|jpe?g|gif)|video\/mp4/.test(mime)) {
// Jika gambar direply
let media = await mecha.downloadAndSaveMediaMessage(m)
var link = await (await func.UploadFileUgu(media)).url
} else {
return m.reply(`✳️ Balas Gambar/Url\nExample: ${m.prefix}osmage https://telegra.ph/file/db308811777d4f7bb83dc.png`)
}
mecha.sendReact(m.chat, '🕒', m.key)
let apiUrl = `https://api.ryochinel.my.id/api/osmage?url=${encodeURIComponent(link)}&apikey=yk`;
try {
let response = await fetch(apiUrl);
let data = await response.json();
if (data.status && data.result) {
let { city, country, explanation, latitude, longitude, state } = data.result;
let resultMessage = `*HOSHIYUKI OSINT IMAGE*\n\n- *City*: ${city}\n- *Country*: ${country}\n- *Explanation*: ${explanation}\n- *Latitude*: ${latitude}\n- *Longitude*: ${longitude}\n- *State*: ${state}`;
m.reply(resultMessage);
} else {
m.reply('❌ Failed to get image information. Please try again later.');
}
} catch (error) {
m.reply('❌ An error occurred. Please try again later.');
}
},
premium: true
}