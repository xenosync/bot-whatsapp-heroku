exports.run = {
usage: ['bansos'],
hidden: ['korupsi'],
category: 'rpg',
async: async (m, { func, mecha, errorMessage }) => {
const cooldown = 864000000
try {
let user = global.db.users[m.sender]
let timers = (cooldown - (new Date - user.lastbansos))
let aku = Math.ceil(Math.random() * 101)
let kamu = Math.floor(Math.random() * 76) //hehe Biar Susah Menang :v
if (new Date - user.lastbansos <= cooldown) return m.reply(`Kamu sudah melakukan Korupsi Bansos.\nCooldown *${func.clockString(timers)}*`)
if (user.atm < 2000000) return m.reply(`Minimal memiliki tabungan 2000000 money.*`)
if (aku > kamu) {
await mecha.sendMessageModify(m.chat, `Kamu tertangkap setelah kamu korupsi dana bansos🕴️💰\nMembayar denda *3.000.000* money.`, m, {
title: global.header,
body: global.footer, 
thumbUrl: 'https://telegra.ph/file/afcf9a7f4e713591080b5.jpg', 
largeThumb: true, 
expiration: m.expiration
})
user.money -= 3000000
} else if (aku < kamu) {
let hasil = ranNumb(1500000, 2450000)
user.money += hasil
await mecha.sendMessageModify(m.chat, `Kamu berhasil  korupsi dana bansos🕴️💰\nMendapatkan *${hasil}* money.`, m, {
title: global.header,
body: global.footer,
thumbUrl: 'https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg', 
largeThumb: true, 
expiration: m.expiration
})
} else {
m.reply(`Tidak berhasil korupsi, namun berhasil *kabur keluar negeri 🏃*`)
}
user.lastbansos = new Date * 1
} catch (e) {
console.log(e)
return errorMessage(e)
}
},
register: true,
limit: true
}

function ranNumb(min, max = null) {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}