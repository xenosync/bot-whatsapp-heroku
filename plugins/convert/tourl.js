const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

exports.run = {
usage: ['tourl', 'tourl2'],
use: 'reply photo',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (m.command === 'tourl') {
if (/image|video/.test(quoted.mime)) {
let wait = await mecha.sendMessage(m.chat, {text: global.mess.wait}, {quoted: m, ephemeralExpiration: m.expiration})
let media = await mecha.downloadAndSaveMediaMessage(m)
let anu = await func.telegraPh(media)
await mecha.sendMessage(m.chat, {text: (anu.url || ''), edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
} else if (/audio|webp/.test(quoted.mime)) {
let wait = await mecha.sendMessage(m.chat, {text: mess.wait}, {quoted: m, ephemeralExpiration: m.expiration})
let media = await mecha.downloadAndSaveMediaMessage(m)
let anu = await func.UploadFileUgu(media)
await mecha.sendMessage(m.chat, {text: (anu.url || ''), edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
} else m.reply('Input media dengan benar!')
} else if (m.command === 'tourl2') {
if (/image|video|audio|webp/.test(quoted.mime)) {
let wait = await mecha.sendMessage(m.chat, {text: global.mess.wait}, {quoted: m, ephemeralExpiration: m.expiration})
let buffer = await quoted.download()
const { ext, mime } = (await fromBuffer(buffer)) || {};
const form = new FormData();
form.append("file", buffer, {
filename: `tmp.${ext}`,
contentType: mime
});
try {
const { data } = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
headers: form.getHeaders()
});
const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url);
await mecha.sendMessage(m.chat, {text: `https://tmpfiles.org/dl/${match[1]}`, edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (error) {
await mecha.sendMessage(m.chat, {text: String(error), edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
}
} else m.reply('Input media dengan benar!')
}
},
limit: true
}