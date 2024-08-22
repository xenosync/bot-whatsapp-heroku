const axios = require('axios')

exports.run = {
usage: ['quickchat', 'quickchat2', 'quickchat3', 'quickchat4'],
hidden: ['qc', 'qc2', 'qc3', 'qc4'],
use: 'text',
category: 'convert',
async: async (m, { func, mecha, packname, author }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'surya sayang wulan'))
if (m.text.length > 50) return m.reply('Max 50 character!')
mecha.sendReact(m.chat, '🕒', m.key)
let color
if (func.somematch(['quickchat', 'qc'], m.command)) color = '#CCFFFF'
if (func.somematch(['quickchat2', 'qc2'], m.command)) color = '#000000'
if (func.somematch(['quickchat3', 'qc3'], m.command)) color = '#999999'
if (func.somematch(['quickchat4', 'qc4'], m.command)) color = '#FF9999'
const obj = {
type: "quote",
format: "png",
backgroundColor: color,
width: 512,
height: 768,
scale: 2,
messages: [{
entities: [],
avatar: true,
from: {
id: 5,
name: m.quoted ? global.db.users[m.quoted.sender].name : m.pushname,
photo: {
url: await mecha.profilePictureUrl(m.quoted ? m.quoted.sender : m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
}
},
text: m.text,
replyMessage: {}
}]
}
let res = await axios.post(global.quoteApi, obj, {
headers: { 'Content-Type': 'application/json' }
})
const buffer = Buffer.from(res.data.result.image, 'base64')
mecha.sendSticker(m.chat, buffer, m, {
packname: packname, 
author: author,
expiration: m.expiration
})
},
//premium: true,
restrict: true,
limit: 3
}