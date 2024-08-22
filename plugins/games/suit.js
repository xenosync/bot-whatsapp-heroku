let database = {};

exports.run = {
usage: ['suit'],
use: 'mention or reply',
category: 'games',
async: async (m, { func, mecha, froms, setting }) => {
if (!m.isGc) return m.reply(global.mess.group)
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (Object.values(database).find(v => v.id.startsWith('suit') && [v.penantang, v.ditantang].includes(m.sender))) return m.reply(`Selesaikan suit mu yang sebelumnya`)
if (!froms) return m.reply('Invalid number.')
if (froms === m.bot) return m.reply(`Tidak bisa bermain dengan bot!`)
if (froms === m.sender) return m.reply(`Sad amat main ama diri sendiri`)
if (Object.values(database).find(v => v.id.startsWith('suit') && [v.penantang, v.ditantang].includes(froms))) return m.reply(`Orang yang kamu tantang sedang bermain suit bersama orang lain :)`)
let hadiah = func.hadiah(setting.hadiah);
let timeout = setting.gamewaktu * 1000
let id = 'suit_' + Date.now()
await m.reply(`@${m.sender.split('@')[0]} menantang @${froms.split('@')[0]} untuk bermain suit\n\n*Kirim (Y/N)* untuk bermain\n\nHadiah : ${hadiah} balance`)
database[id] = {
id: id,
penantang: m.sender,
ditantang: froms,
status: 'WAIT',
hadiah: hadiah,
timeout: timeout,
waktu: setTimeout(() => {
if (database[id]) m.reply(func.texted('monospace', 'Waktu suit habis!'))
delete database[id]
}, timeout)
}
},
main: async (m, { func, mecha, fkon, setting, errorMessage }) => {
/* FUNCTION SUIT PVP BY SURYA */
try {
let roof = Object.values(database).find(v => v.status && [v.penantang, v.ditantang].includes(m.sender))
let pollcmd = m.budy.replace(m.prefix, '')
if (roof) {
let win = ''
let tie = false
if (m.sender == roof.ditantang && m.isGc && roof.status == 'WAIT') {
if (m.budy.toLowerCase() === 'y') {
roof.status = 'PLAY'
roof.asal = m.chat
clearTimeout(roof.waktu)
await mecha.reply(m.chat, `Suit telah dikirimkan ke chat\n\n@${roof.penantang.split('@')[0]} dan @${roof.ditantang.split('@')[0]}\n\nSilahkan pilih suit di chat masing²\nklik wa.me/${m.bot.split('@')[0]}`, fkon)
if (!roof.pilih) await mecha.sendPoll(roof.penantang, 'SILAHKAN PILIH SUIT BERIKUT', ['Batu', 'Gunting', 'Kertas'])
//mecha.reply(roof.penantang, `SILAHKAN PILIH\n\nBatu🗿\nKertas📄\nGunting✂️`, m)
if (!roof.pilih2) await mecha.sendPoll(roof.ditantang, 'SILAHKAN PILIH SUIT BERIKUT', ['Batu', 'Gunting', 'Kertas'])
//mecha.reply(roof.ditantang, `SILAHKAN PILIH\n\nBatu🗿\nKertas📄\nGunting✂️`, m)
roof.waktu_milih = setTimeout(async() => {
if (!roof.pilih && !roof.pilih2) await mecha.sendMessage(m.chat, {text: `Kedua pemain tidak niat main!\nSuit dibatalkan`})
else if (!roof.pilih || !roof.pilih2) {
win = !roof.pilih ? roof.ditantang : roof.penantang
await mecha.reply(m.chat, `@${(roof.pilih ? roof.ditantang : roof.penantang).split('@')[0]} tidak memilih suit, game berakhir`)
}
delete database[roof.id]
return !0
}, roof.timeout)
} else if (m.budy.toLowerCase() === 'n') {
await mecha.reply(m.chat, `@${roof.ditantang.split('@')[0]} menolak suit, suit dibatalkan`, fkon)
delete database[roof.id]
return !0
}
}
let jwb = m.sender == roof.penantang
let jwb2 = m.sender == roof.ditantang
let g = /gunting/i
let b = /batu/i
let k = /kertas/i
let reg = /^(gunting|batu|kertas)/i
if (jwb && reg.test(pollcmd) && !roof.pilih && m.isPc) {
roof.pilih = reg.exec(pollcmd.toLowerCase())[0]
roof.text = pollcmd
await mecha.sendMessage(m.chat, {text: `Kamu telah memilih ${pollcmd} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`}, {quoted: m, ephemeralExpiration: m.expiration})
if (!roof.pilih2) await mecha.sendMessage(roof.ditantang, {text: '_Lawan sudah memilih_\nSekarang giliran kamu'})
}
if (jwb2 && reg.test(pollcmd) && !roof.pilih2 && m.isPc) {
roof.pilih2 = reg.exec(pollcmd.toLowerCase())[0]
roof.text2 = pollcmd
await mecha.sendMessage(m.chat, {text: `Kamu telah memilih ${pollcmd} ${!roof.pilih ? '\n\nMenunggu lawan memilih...' : ''}`}, {quoted: m, ephemeralExpiration: m.expiration})
if (!roof.pilih) await mecha.sendMessage(roof.penantang, {text: '_Lawan sudah memilih_\nSekarang giliran kamu'})
}
let stage = roof.pilih
let stage2 = roof.pilih2
if (roof.pilih && roof.pilih2) {
clearTimeout(roof.waktu_milih)
if (b.test(stage) && g.test(stage2)) win = roof.penantang
else if (b.test(stage) && k.test(stage2)) win = roof.ditantang
else if (g.test(stage) && k.test(stage2)) win = roof.penantang
else if (g.test(stage) && b.test(stage2)) win = roof.ditantang
else if (k.test(stage) && b.test(stage2)) win = roof.penantang
else if (k.test(stage) && g.test(stage2)) win = roof.ditantang
else if (stage == stage2) tie = true
let teks = `${tie ? '*HASIL SERI*\n\n' : ''}@${roof.penantang.split('@')[0]} (${roof.text}) ${tie ? '' : roof.penantang == win ? ' Menang' : ' Kalah'}\n@${roof.ditantang.split('@')[0]} (${roof.text2}) ${tie ? '' : roof.ditantang == win ? ' Menang' : ' Kalah'}${tie ? '' : '\n\nHadiah : ' + roof.hadiah + ' balance'}`
await mecha.sendMessage(roof.asal, {text: teks, contextInfo: {mentionedJid: [roof.penantang, roof.ditantang], externalAdReply: {showAdAttribution: true, title: 'H A S I L - S U I T', body: global.header, mediaType: 1, previewType: 'PHOTO', thumbnailUrl: setting.cover, sourceUrl: global.saweria, renderLargerThumbnail: false }}}, {quoted: null, ephemeralExpiration: m.expiration});
if (roof.penantang == win) {
global.db.users[roof.penantang].game.suit += 1
roof.penantang == win ? global.db.users[roof.penantang].balance += roof.hadiah : global.db.users[roof.penantang].balance -= roof.hadiah
} else if (roof.ditantang == win) {
global.db.users[roof.ditantang].game.suit += 1
roof.ditantang == win ? global.db.users[roof.ditantang].balance += roof.hadiah : global.db.users[roof.ditantang].balance -= roof.hadiah
}
delete database[roof.id]
}
}
} catch (e) {
return errorMessage(e)
}
}
}