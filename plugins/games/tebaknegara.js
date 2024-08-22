const fetch = require('node-fetch'), similarity = require('similarity');
let gamesUrl = 'https://api.vyturex.com/country';
let sensitive = 0.75;
let database = {};
let player = 0;

exports.run = {
usage: ['tebaknegara'],
hidden: ['tnegara'],
category: 'games',
async: async (m, { func, mecha, setting, isPrem }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.chat in database) return mecha.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', database[m.chat].chat)

let data = await fetch(gamesUrl).then(response => response.json())
let { country, link } = data;
let hadiah = func.hadiah(setting.hadiah)
let id = Date.now();
let caption = `*G A M E - T E B A K N E G A R A*\n\nSoal: ${func.texted('monospace', `Bendera negara apa ini?`)}\n${isPrem ? '\nPetunjuk: ' + func.texted('monospace', country.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')) : ''}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`

player = 0;
database[m.chat] = {
id: id,
chat: await mecha.sendMessageModify(m.chat, caption, m, {
thumbUrl: link,
largeThumb: true,
title: 'GAME TEBAK NEGARA', 
body: '',
expiration: m.expiration
}),
soal: 'Bendera negara manakah itu?',
jawaban: country.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(async function () {
if (database[m.chat].id == id) {
mecha.sendMessage(m.chat, {text: `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', country)}`}, {quoted: database[m.chat].chat, ephemeralExpiration: m.expiration});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
},
main: async (m, { func, mecha, setting }) => {
/* GAME TEBAK NEGARA BY SURYA */
if ((m.chat in database) && !m.fromMe && !m.isPrefix) {
let { soal, jawaban, hadiah, waktu } = database[m.chat]
if (similarity(jawaban, m.budy.toLowerCase()) >= sensitive) {
player++
mecha.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
global.db.users[m.sender].balance += hadiah
global.db.users[m.sender].game.tebaknegara += 1
clearTimeout(waktu);
delete database[m.chat];
setTimeout(async () => {
if (player > 1) return
if (global.db.users[m.sender].limit < 1) return m.reply('Soal dihentikan karena limit kamu sudah habis.')
global.db.users[m.sender].limit -= 1
let data = await fetch(gamesUrl).then(response => response.json())
let { country, link } = data;
let hadiah = func.hadiah(setting.hadiah)
let id = Date.now();
let caption = `*LANJUT SOAL BERIKUTNYA*\n\nSoal: ${func.texted('monospace', `Bendera negara apa ini?`)}\n${global.db.users[m.sender].premium ? '\nPetunjuk: ' + func.texted('monospace', country.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')) : ''}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.sendMessageModify(m.chat, caption, m, {
thumbUrl: link,
largeThumb: true,
title: 'GAME TEBAK NEGARA', 
body: '',
expiration: m.expiration
}),
soal: 'Bendera negara manakah itu?',
jawaban: country.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(async function () {
if (database[m.chat].id == id) {
mecha.sendMessage(m.chat, {text: `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', country)}`}, {quoted: database[m.chat].chat, ephemeralExpiration: m.expiration});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
}, 1000)
} else if (/conversation|extendedTextMessage/.test(m.mtype)) await mecha.sendMessage(m.chat, {react: {text: '❌', key: m.key}})
}
}
}