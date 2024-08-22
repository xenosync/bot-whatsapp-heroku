/**
 * CREATE QR & READ QR
 * Author Asli & Penulis : https://whatsapp.com/channel/0029VaU3j0z2ER6liR0MY601
 * Uploader : SuryaDev.
 * Path plugin: tools/qrcode
 * Note: mohon untuk tidak mengubah credit yang sudah ada
 */
 
const qrcode = require("qrcode");
const jimp = require("jimp");
const reader = new (require("qrcode-reader"))();

async function createQr(query) {
return new Promise(async (resolve, reject) => {
try {
return resolve(await qrcode.toBuffer(query));
} catch (e) {
return reject(e);
}
});
}

async function readQr(buffer) {
return new Promise(async (resolve, reject) => {
try {
reader.callback = (err, value) => {
return resolve(value);
};

jimp.read(buffer, (err, image) => {
reader.decode(image.bitmap);
});
} catch (e) {
return reject(e);
}
});
}

exports.run = {
usage: ['createqr', 'readqr'],
use: 'parameter',
category: 'tools',
async: async (m, { func, mecha, quoted }) => {
switch (m.command) {
case 'createqr':{
if (!m.text) return m.reply(func.example(m.cmd, 'SuryaDev'))
mecha.sendReact(m.chat, '🕒', m.key)
let buffer = await createQr(m.text)
mecha.sendMessage(m.chat, {
image: buffer,
caption: `QR Code from \`${m.text}\``
}, {quoted: m, ephemeralExpiration: m.expiration})
}
break
case 'readqr':{
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
mecha.sendReact(m.chat, '🕒', m.key)
try {
let buffer = await quoted.download()
let result = await readQr(buffer)
mecha.reply(m.chat, result.result, m, {
expiration: m.expiration
})
} catch (error) {
return mecha.reply(m.chat, String(error), m)
}
} else m.reply(`Kirim atau reply QR Code dengan caption ${m.cmd}`)
}
break
}
},
limit: true
}