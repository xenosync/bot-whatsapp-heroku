const fetch = require('node-fetch');
const similarity = require('similarity');
const gamesUrl = 'https://suryadev.vercel.app/games/family100'
const sensitive = 0.75;
let database = {};
let player = 0;

exports.run = {
usage: ['family100'],
hidden: ['f100'],
category: 'games',
async: async (m, { func, mecha, setting, isPrem }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.chat in database) return mecha.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', database[m.chat].chat)
const { soal, jawaban } = await fetch(gamesUrl).then(response => response.json());
if (!Array.isArray(jawaban)) return m.reply(`Terjadi kesalahan, silahkan kirim ulang ${m.cmd}`)
let hadiah = func.hadiah(setting.hadiah);
let family = [];
for (let i of jawaban){
let a = i.split('/') ? i.split('/')[0] : i
let b = a.startsWith(' ') ? a.replace(' ','') : a
let c = b.endsWith(' ') ? b.replace(b.slice(-1), '') : b
family.push(c.toLowerCase())
}
let caption = `*G A M E - F A M I L Y 100*\n\n${func.texted('monospace', soal)}\n\nTotal Jawaban: ${jawaban.length}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
player = 0;
database[m.chat] = {
chat: await mecha.reply(m.chat, caption, m, {
expiration: m.expiration
}),
soal: soal,
jawaban: family,
hadiah: hadiah,
total: jawaban.length,
players: [],
waktu: setTimeout(function () {
if (m.chat in database) {
let txt = `Waktu habis!\nJawaban yang belum terjawab :`
let data = database[m.chat];
for (let key of data.jawaban) txt += `\n${key}`
mecha.reply(m.chat, txt, data.chat, {
expiration: m.expiration
});
delete database[m.chat];
};
}, setting.gamewaktu * 1000)
}
},
main: async (m, { func, mecha, setting }) => {
/* GAME FAMILY 100 BY SURYA */
if ((m.chat in database) && !m.fromMe && !m.isPrefix) {
let { soal, jawaban, hadiah, waktu, total, players } = database[m.chat]
if (/nyerah/i.test(m.budy)) {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
clearTimeout(waktu);
let txt = 'Jawaban yang belum terjawab :'
for (let key of jawaban) txt += `\n${key}`
let next = await mecha.sendMessage(m.chat, {text: txt}, {quoted: database[m.chat].chat, ephemeralExpiration: m.expiration})
delete database[m.chat];
setTimeout(async () => {
const result = await fetch(gamesUrl).then(response => response.json());
if (!Array.isArray(result.jawaban)) return m.reply(`Terjadi kesalahan, silahkan kirim ulang ${m.cmd}`)
let hadiah = func.hadiah(setting.hadiah);
let family = []
for (let i of result.jawaban){
let a = i.split('/') ? i.split('/')[0] : i
let b = a.startsWith(' ') ? a.replace(' ','') : a
let c = b.endsWith(' ') ? b.replace(b.slice(-1), '') : b
family.push(c.toLowerCase())
}
let caption = `*LANJUT SOAL BERIKUTNYA*\n\n${func.texted('monospace', result.soal)}\n\nTotal Jawaban: ${result.jawaban.length}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
database[m.chat] = {
chat: await mecha.sendMessage(m.chat, {text: caption, edit: next.key}, {quoted: m, ephemeralExpiration: m.expiration}),
soal: result.soal,
jawaban: family,
hadiah: hadiah,
total: result.jawaban.length,
players: [],
waktu: setTimeout(function () {
if (m.chat in database) {
let txt = `Waktu habis!\nJawaban yang belum terjawab :`
let data = database[m.chat];
for (let key of data.jawaban) txt += `\n${key}`
mecha.reply(m.chat, txt, data.chat, {
expiration: m.expiration
});
delete database[m.chat];
};
}, parseInt(setting.gamewaktu) * 1000)
}
}, 3000)
return !0
}
if (m.quoted && m.quoted.fromMe && m.quoted.id == database[m.chat].chat.key.id && !answer(jawaban, m.budy.toLowerCase()) && /conversation|extendedTextMessage/.test(m.mtype)) await mecha.sendMessage(m.chat, {react: {text: '❌', key: m.key}})
for (let kata of jawaban){
if (answer(kata, m.budy.toLowerCase())) {
player++
let anu = jawaban.indexOf(kata)
players.push({ jid: m.sender, jawaban: kata.toLowerCase() })
jawaban.splice(anu, 1)
let txt = m.isGc ? `${soal}..\n\nTerdapat *${total}* jawaban\n${players.map((v, index) => `${index + 1}. ${v.jawaban} @${v.jid.split('@')[0]}`).join('\n')}${jawaban.length < 1 ? `\n\nSelamat semua jawaban sudah tertebak!\ningin bermain lagi? kirim ${m.prefix}family100` : `\n\n$${hadiah}balance tiap jawaban benar\nketik *nyerah* untuk menyerah`}` : `Jawaban kamu benar!\nJawaban: ${kata}\n\n${jawaban.length < 1 ? `Selamat semua jawaban sudah tertebak!\ningin bermain lagi? kirim ${m.prefix}family100` : `Jawaban yang belum tertebak: ${jawaban.length}`}`
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
global.db.users[m.sender].balance += hadiah
global.db.users[m.sender].game.family100 += 1
if (jawaban.length < 1) clearTimeout(waktu), delete database[m.chat];
if (player > 1) return
player = 0;
}
}
}
}
}

function answer (data, text) {
let status;
if (Array.isArray(data)) {
status = data.some(kata => similarity(kata, text.toLowerCase()) >= sensitive)
}
if (!Array.isArray(data)) {
status = similarity(data, text.toLowerCase()) >= sensitive
}
return status;
}