const fetch = require('node-fetch');

exports.run = {
usage: ['quranaudio'],
hidden: ['qa'],
use: 'surah',
category: 'islamic',
async: async (m, { func, mecha }) => {
if (isNaN(m.args[0])) return m.reply(func.example(m.cmd, '1'))
if (Number(m.args[0]) < 1) return m.reply(`Minimal 1!`)
if (Number(m.args[0]) > 114) return m.reply(`Maksimal 114!`)
let quranaudio = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/quranaudio.json').then(response => response.json())
let { number, ayatCount, urutan, asma, preBismillah, type, tafsir, audio } = quranaudio.find(v => v.number == Number(m.args[0]))
let txt = `No. ${number}\n`
txt += `Nama : ${asma.id.long}\n`
txt += `Jumlah Ayat : ${ayatCount}\n`
txt += `preBismillah : ${preBismillah}\n`
txt += `Type Surah : ${type}\n`
txt += `Tafsir : ${tafsir}`
await mecha.sendMessage(m.chat, {text: txt}, {quoted: m, ephemeralExpiration: m.expiration})
.then((q) => mecha.sendMessage(m.chat, {audio: {url: audio}, mimetype: 'audio/mpeg'}, {quoted: q, ephemeralExpiration: m.expiration}))
}
}