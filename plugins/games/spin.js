const fetch = require('node-fetch')

exports.run = {
usage: ['spin'],
use: 'jumlah',
category: 'games',
async: async (m, { func, mecha, users, setting }) => {
if (!('lastSpin' in users)) users.lastSpin = 0
if (!m.text || !/^\d+$/.test(m.text)) return m.reply(func.example(m.cmd, '1000'))
let betAmount = parseInt(m.text)
if (users.balance < betAmount) return m.reply('Balance Anda tidak mencukupi.')

let result = Math.random() >= 0.5 
let wonAmount = result ? Math.ceil(betAmount * 1.31919) : -betAmount
users.balance += wonAmount

let delay = 10000 // 10 seconds delay
if (users.lastSpin && Number(new Date()) - users.lastSpin < delay) {
let time = Math.ceil((users.lastSpin + delay - Number(new Date())) / 1000) 
return m.reply(`Harap tunggu ${time} detik sebelum menjalankan putaran berikutnya.`)
}
users.lastSpin = Number(new Date())

let caption = `*🧐 Let's See the Results*\n\n`
caption += `*- ${betAmount.toLocaleString()}*\n`
caption += result ? `*+ ${wonAmount.toLocaleString()}*\n\n` : `\n\n`
caption += `• Total : *${users.balance.toLocaleString()}* Balance`

mecha.sendMessageModify(m.chat, caption, m, {
title: global.header,
body: 'S P I N - R E S U L T',
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
})
},
limit: true
}