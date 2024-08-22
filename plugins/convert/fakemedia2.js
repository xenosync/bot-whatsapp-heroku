const axios = require('axios')

exports.run = {
usage: ['fakemedia2'],
hidden: ['fm2'],
use: 'text',
category: 'convert',
async: async (m, { func, mecha, quoted, mime, makeid, comand, setting, packname }) => {
if (!m.text) return m.reply(func.example(comand, 'surya sayang wulan'))
if (m.text.length > 50) return m.reply('Max 50 character!')
if (/image\/(jpe?g|png)/.test(mime)) {
m.reply(global.mess.wait)
let media = await mecha.downloadAndSaveMediaMessage(quoted, makeid)
let url = (await func.telegraPh(media)).url
const obj = {
"type": "quote",
"format": "png",
"backgroundColor": "#CCFFFF",
"width": 512,
"height": 768,
"scale": 2,
"messages": [{
"entities": [],
"avatar": true,
"media": {
"url": url
},
"from": {
"id": 5,
"name": m.pushname,
"photo": {"url": await mecha.profilePictureUrl(m.sender, 'image').catch(_ => global.ppkosong)}
},
"text": m.text,
"replyMessage": {}
}]
}
let res = await axios.post(global.quoteApi, obj, {
headers: {'Content-Type': 'application/json'}
})
const buffer = Buffer.from(res.data.result.image, 'base64')
mecha.sendSticker(m.chat, buffer, m, {packname: packname, author: setting.author})
} else m.reply(`Kirim/Reply gambar dengan caption ${comand} text`)
},
restrict: true,
limit: 5
}