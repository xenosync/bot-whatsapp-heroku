const request = require('request');
const fs = require('fs');

const makeZombie = async(path) => {
return new Promise(async(resolve, reject) => {
let img = await fs.createReadStream(path)   
request.post({
url: "https://deepgrave-image-processor-no7pxf7mmq-uc.a.run.app/transform_in_place",
formData: {
image: img
},
contentType: 'multipart/form-data'
},
async (error, response, body) => {
resolve({ base64: body })
})
})
}

exports.run = {
usage: ['jadizombie'],
hidden: ['tozombie'],
use: 'reply photo',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
mecha.sendReact(m.chat, '🕒', m.key)
let media = await mecha.downloadAndSaveMediaMessage(m)
let res = await makeZombie(media)
let buffer = new Buffer.from(res.base64, 'base64')
await mecha.sendMessage(m.chat, {image: buffer, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply(`Kirim/Reply foto dengan caption ${m.cmd}`)
},
premium: true,
limit: true
}