const axios = require('axios')

exports.run = {
usage: ['qcrandom'],
hidden: ['qcr'],
use: 'text',
category: 'convert',
async: async (m, { func, mecha, packname, author }) => {
let text
if (m.args.length >= 1) {
text = m.args.slice(0).join(" ")
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else return m.reply('Input teks atau reply teks yang ingin di jadikan quote!')
if (!text) return m.reply(func.example(m.cmd, 'surya sayang wulan'))
if (text.length > 50) return m.reply('Max 50 character!')
mecha.sendReact(m.chat, '🕒', m.key)
let randomColor = ['#ccffff', '#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500'];
const apiColor = randomColor[Math.floor(Math.random() * randomColor.length)];
let pp = await mecha.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
const obj = {
"type": "quote",
"format": "png",
"backgroundColor": apiColor,
"width": 512,
"height": 768,
"scale": 2,
"messages": [{
"entities": [],
"avatar": true,
"from": {
"id": 1,
"name": m.pushname,
"photo": {
"url": pp
}
},
"text": text,
"replyMessage": {}
}]
}
let res = await axios.post(global.quoteApi, obj, {
headers: {'Content-Type': 'application/json'}
})
const buffer = Buffer.from(res.data.result.image, 'base64')
mecha.sendSticker(m.chat, buffer, m, {
packname: packname, 
author: author,
expiration: m.expiration
})
},
restrict: true,
limit: 5
}