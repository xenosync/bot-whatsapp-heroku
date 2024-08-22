const fs = require('fs');

exports.run = {
usage: ['casino', 'delcasino'],
use: 'nominal @tag',
category: 'games',
async: async (m, { func, mecha }) => {
switch (m.command) {
case 'casino':{
if (!m.text) return m.reply(`Kirim perintah *${m.cmd}* nominal @tag`)
if (Object.values(global.db.casino).find(v => v.id.startsWith('casino') && [v.penantang, v.ditantang].includes(m.sender))) return m.reply(`Selesaikan casino mu yang sebelumnya.`)
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.text && m.quoted && m.quoted.sender) {
let nominal = m.args[0].toString().replace(/[^0-9]/g, '')
let tagnya = m.quoted.sender
if (!nominal) return m.reply('Masukan nominalnya.')
if (nominal.includes('-')) return m.reply(`Jangan menggunakan -`)
if (isNaN(parseInt(nominal))) return m.reply('Nominal harus berupa angka!')
if (nominal < 1000) return m.reply('Minimal 1000 untuk bisa casino!')
if (tagnya === m.bot) return m.reply(`Tidak bisa bermain dengan bot!`)
if (tagnya === m.sender) return m.reply(`Sad amat main ama diri sendiri`)
let penantang = global.db.users[m.sender].balance
let ditantang = global.db.users[tagnya].balance
if (penantang < nominal || penantang == null) return m.reply(`Balance tidak mencukupi, kumpulkan terlebih dahulu\nKetik ${m.prefix}balance untuk mengecek balancemu.`)
if (ditantang < nominal || ditantang == null) return m.reply(`Balance lawan tidak mencukupi untuk bermain denganmu\nKetik ${m.prefix}balance @${tagnya.split('@')[0]} untuk mengecek balance lawanmu.`)
let id = 'casino_' + Date.now()
global.db.casino[id] = {
id: id,
penantang: m.sender,
ditantang: tagnya,
nominal: parseInt(nominal)
}
let starGame = `Memulai Game Casino\n\n@${m.sender.split('@')[0]} menantang @${tagnya.split('@')[0]} dengan nominal *$${func.formatNumber(nominal)}* balance\n\nKetik *Y/N* untuk menerima atau menolak permainan!`
mecha.sendMessage(m.chat, {text: starGame, mentions: [m.sender, tagnya]}, {quoted: m, ephemeralExpiration: m.expiration})
} else if (m.text) {
let nominal = m.args[0].toString().replace(/[^0-9]/g, '')
let tagnya = m.text.slice(m.args[0].length + 1, m.text.length).replace(/[^0-9]/g, '') + '@s.whatsapp.net'
if (!nominal) return m.reply('Masukan nominalnya.')
if (nominal.includes('-')) return m.reply(`Jangan menggunakan -`)
if (isNaN(parseInt(nominal))) return m.reply('Nominal harus berupa angka!')
if (nominal < 1000) return m.reply('Minimal 1000 untuk bisa casino!')
if (tagnya === '@s.whatsapp.net') return m.reply(global.mess.wrongFormat)
if (tagnya === m.bot) return m.reply(`Tidak bisa bermain dengan bot!`)
if (tagnya === m.sender) return m.reply(`Sad amat main ama diri sendiri`)
if (global.db.users[tagnya] == undefined) return m.reply('User data not found.')
let penantang = global.db.users[m.sender].balance
let ditantang = global.db.users[tagnya].balance
if (penantang < nominal || penantang == null) return m.reply(`Balance tidak mencukupi, kumpulkan terlebih dahulu\nKetik ${m.prefix}balance untuk mengecek balancemu.`)
if (ditantang < nominal || ditantang == null) return m.reply(`Balance lawan tidak mencukupi untuk bermain denganmu\nKetik ${m.prefix}balance @${tagnya.split('@')[0]} untuk mengecek balance lawanmu.`)
let id = 'casino_' + Date.now()
global.db.casino[id] = {
id: id,
penantang: m.sender,
ditantang: tagnya,
nominal: parseInt(nominal)
}
let starGame = `Memulai Game Casino\n\n@${m.sender.split('@')[0]} menantang @${tagnya.split('@')[0]} dengan nominal *$${func.formatNumber(nominal)}* balance\n\nKetik *Y/N* untuk menerima atau menolak permainan!`
mecha.sendMessage(m.chat, {text: starGame, mentions: [m.sender, tagnya]}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply(func.example(m.prefix + m.command, `2000 @${global.mark.split('@')[0]} `))
}
break
case 'delcasino':
let casino = Object.values(global.db.casino).find(v => v.id.startsWith('casino') && [v.penantang, v.ditantang].includes(m.sender))
if (casino) {
if (casino.penantang.includes(m.sender)) {
delete global.db.casino[casino.id]
m.reply('Berhasil menghapus sesi casino.')
} else if (casino.ditantang.includes(m.sender)) {
delete global.db.casino[casino.id]
m.reply('Berhasil menghapus sesi casino.')
} else m.reply('Anda tidak bisa menghapus sesi casino, karena bukan pemain!')
} else m.reply('Tidak ada sesi yang berlangsung.')
break
}
},
main: async (m, { func, mecha }) => {
if (Object.values(global.db.casino).find(v => v.id.startsWith('casino') && [v.penantang, v.ditantang].includes(m.sender))) {
let casino = Object.values(global.db.casino).find(v => v.id.startsWith('casino') && [v.penantang, v.ditantang].includes(m.sender))
if (m.sender == casino.ditantang && m.budy.toLowerCase() === 'n') {
mecha.sendMessage(m.chat, {text: `GAME CASINO REJECTED\n\n@${casino.ditantang.split('@')[0]} Membatalkan Game`, mentions: [casino.ditantang] }, {quoted: m, ephemeralExpiration: m.expiration})
delete global.db.casino[casino.id]
}
if (m.sender == casino.ditantang && m.budy.toLowerCase() === 'y') {
let angka1 = await func.randomNomor(10, 20)
let angka2 = await func.randomNomor(10, 20)
if (angka1 > angka2) {
let starGame = `乂  *CASINO GAME*

◦ @${casino.penantang.split('@')[0]} --> ${angka1}
◦ @${casino.ditantang.split('@')[0]} --> ${angka2}

Pemenangnya adalah: @${casino.penantang.split('@')[0]}
Hadiah: $${func.formatNumber(casino.nominal)}`
mecha.sendMessage(m.chat, {text: starGame, mentions: [casino.penantang, casino.ditantang]}, {quoted: m, ephemeralExpiration: m.expiration})
global.db.users[casino.penantang].balance += casino.nominal
global.db.users[casino.ditantang].balance -= casino.nominal
global.db.users[casino.penantang].game.casino += 1
delete global.db.casino[casino.id]
} else if (angka1 < angka2) {
let starGame = `乂  *CASINO GAME*

◦ @${casino.penantang.split('@')[0]} --> ${angka1}
◦ @${casino.ditantang.split('@')[0]} --> ${angka2}

Pemenangnya adalah: @${casino.ditantang.split('@')[0]}
Hadiah: $${func.formatNumber(casino.nominal)}`
mecha.sendMessage(m.chat, {text: starGame, mentions: [casino.penantang, casino.ditantang]}, {quoted: m, ephemeralExpiration: m.expiration})
global.db.users[casino.ditantang].balance += casino.nominal
global.db.users[casino.penantang].balance -= casino.nominal
global.db.users[casino.ditantang].game.casino += 1
delete global.db.casino[casino.id]
} else if (angka1 == angka2) {
let starGame = `乂  *CASINO GAME*

◦ @${casino.penantang.split('@')[0]} --> ${angka1}
◦ @${casino.ditantang.split('@')[0]} --> ${angka2}

Hasil Seri, Tidak Ada Pemenang.`
mecha.sendMessage(m.chat, {text: starGame, mentions: [casino.penantang, casino.ditantang]}, {quoted: m, ephemeralExpiration: m.expiration})
delete global.db.casino[casino.id]
}
}
}
},
group: true
}