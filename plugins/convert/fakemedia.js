const axios = require('axios')

exports.run = {
usage: ['fakemedia'],
hidden: ['fm'],
use: 'text2 | text2',
category: 'convert',
async: async (m, { func, mecha, comand, setting, packname }) => {
const text1 = m.text && m.text.split('|')[0];
const text2 = m.text && m.text.split('|')[1];
if (!text1 || !text2) return m.reply(func.example(comand, 'Assalamualaikum | Waalaikumsalam'))
if (m.text.length > 50) return m.reply('Max 50 character!')
if (!m.quoted) return m.reply(`Reply chat target dengan caption ${comand} teks target | teks kamu`)
m.reply(global.mess.wait)
let nom = mecha.getName(m.quoted.sender).replace(/[^0-9]/g, '')
let name = isNaN(nom) ? global.db.users[m.quoted.sender].name : mecha.getName(m.quoted.sender)
const obj = {
type: "quote",
format: "png",
backgroundColor: "#CCFFFF",
width: 512,
height: 768,
scale: 2,
messages: [{
entities: [],
avatar: true,
from: {
id: 5,
name: m.pushname,
photo: {url: await mecha.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/ea7ef3f59921d1821a0d1.jpg')}
},
text: text2,
replyMessage: {
name: name,
text: text1
}
}]
}
const res = await axios.post(global.quoteApi, obj, {headers: {'Content-Type': 'application/json'}})
const buffer = Buffer.from(res.data.result.image, 'base64')
mecha.sendSticker(m.chat, buffer, m, {packname: packname, author: setting.author})
},
restrict: true,
limit: 5
}