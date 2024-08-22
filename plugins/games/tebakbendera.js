const similarity = require('similarity');
const gamesUrl = 'https://suryadev.vercel.app/games/tebakbendera'
const sensitive = 0.75;
let database = {};
let player = 0;

exports.run = {
usage: ['tebakbendera'],
hidden: ['tbendera'],
category: 'games',
async: async (m, { func, mecha, setting, users }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.chat in database) return mecha.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', database[m.chat].chat)
const { soal, jawaban } = await func.fetchJson(gamesUrl);
let hadiah = func.hadiah(setting.hadiah);
let id = Date.now();
let caption = `*G A M E - T E B A K B E N D E R A*\n\nSoal: ${func.texted('monospace', soal)}\n${users.premium ? '\nPetunjuk: ' + func.texted('monospace', jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')) : ''}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.reply(m.chat, caption, m, {
expiration: m.expiration
}),
soal: soal,
jawaban: jawaban.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(function () {
if (database[m.chat].id == id) {
mecha.reply(m.chat, `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', jawaban)}`, database[m.chat].chat, {
expiration: m.expiration
});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
},
main: async (m, { func, mecha, setting, users }) => {
/* GAME TEBAK BENDERA BY SURYA */
if ((m.chat in database) && !m.fromMe && !m.isPrefix) {
let { soal, jawaban, hadiah, waktu } = database[m.chat]
if (similarity(jawaban, m.budy.toLowerCase()) >= sensitive) {
player++
await mecha.sendReact(m.chat, '✅', m.key)
global.db.users[m.sender].balance += hadiah
global.db.users[m.sender].game.tebakbendera += 1
clearTimeout(waktu);
delete database[m.chat];
setTimeout(async () => {
if (player > 1) return
if (global.db.users[m.sender].limit < 1) return m.reply('Soal dihentikan karena limit kamu sudah habis.')
global.db.users[m.sender].limit -= 1
const { soal, jawaban } = await func.fetchJson(gamesUrl);
let hadiah = func.hadiah(setting.hadiah);
let id = Date.now();
let caption = `*LANJUT SOAL BERIKUTNYA*\n\nSoal: ${func.texted('monospace', soal)}\n${users.premium ? '\nPetunjuk: ' + func.texted('monospace', jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')) : ''}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.reply(m.chat, caption, m, {
expiration: m.expiration
}),
soal: soal,
jawaban: jawaban.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(function () {
if (database[m.chat].id == id) {
mecha.reply(m.chat, `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', jawaban)}`, database[m.chat].chat, {
expiration: m.expiration
});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
}, 1000)
} else if (/conversation|extendedTextMessage/.test(m.mtype)) await mecha.sendReact(m.chat, '❌', m.key)
}
}
}