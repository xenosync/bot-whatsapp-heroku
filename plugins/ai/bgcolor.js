const fs = require('fs'),
axios = require('axios');

const bgColor = (media, color) => {
return new Promise(async (resolve, reject) => {
const base64 = Buffer.from(media, 'binary').toString('base64');
const payload = {
image_file_b64: base64,
image_url: '',
size: 'preview',
type: 'auto',
type_level: '1',
format: 'auto',
roi: '0% 0% 100% 100%',
crop: false,
crop_margin: '0',
scale: 'original',
position: 'original',
channels: 'rgba',
add_shadow: false,
semitransparency: true,
bg_color: color,
bg_image_url: '',
};
await axios({
method: 'POST',
url: 'https://api.remove.bg/v1.0/removebg',
data: payload,
headers: {
accept: 'application/json',
'X-API-Key': 'DWTaLTyVVV7wcVaYiiruXm6e',
'Content-Type': 'application/json',
},
})
.then((response) => {
const buffer = Buffer.from(response.data.data.result_b64, 'base64');
resolve(buffer);
})
.catch((e) => {
resolve(e?.response);
});
});
};

exports.run = {
usage: ['bgcolor'],
use: 'reply image with color',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'blue'))
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
mecha.sendReact(m.chat, '🕒', m.key)
try {
let buffer = await quoted.download();
let color = m.args[0].trim().toLowerCase();
let result = await bgColor(buffer, color);
mecha.sendMessage(m.chat, {image: result, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (e) {
return mecha.reply(m.chat, global.mess.error.api, m, {expiration: m.expiration})
}
} else m.reply(`Kirim/Reply gambar dengan caption *${m.cmd} color*`)
},
premium: true
}