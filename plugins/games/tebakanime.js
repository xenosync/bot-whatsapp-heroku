const similarity = require('similarity');
const gamesUrl = 'https://suryadev.vercel.app/games/tebakanime'
const sensitive = 0.75;
let database = {};
let player = 0;

exports.run = {
usage: ['tebakanime'],
hidden: ['tanime'],
category: 'games',
async: async (m, { func, mecha, setting, isPrem }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.chat in database) return mecha.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', database[m.chat].chat)
const { image, name } = await func.fetchJson(gamesUrl);
let hadiah = func.hadiah(setting.hadiah);
let id = Date.now();
let caption = `*G A M E - T E B A K A N I M E*\n${isPrem ? '\nPetunjuk: ' + func.texted('monospace', name.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')) : ''}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.sendMessage(m.chat, {
image: {
url: image
},
caption: caption
}, {quoted: m, ephemeralExpiration: m.expiration}),
jawaban: name.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(function () {
if (database[m.chat]?.id == id) {
mecha.reply(m.chat, `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', name)}`, database[m.chat].chat, {
expiration: m.expiration
});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
},
main: async (m, { func, mecha, setting }) => {
/*GAME TEBAK ANIME BY SURYA*/
if ((m.chat in database) && !m.fromMe && !m.isPrefix) {
let { jawaban, hadiah, waktu } = database[m.chat]
if (similarity(jawaban, m.budy.toLowerCase()) >= sensitive) {
player++
await mecha.sendReact(m.chat, '✅', m.key)
global.db.users[m.sender].balance += hadiah
global.db.users[m.sender].game.tebakanime += 1
clearTimeout(waktu);
delete database[m.chat];
setTimeout(async () => {
if (player > 1) return
if (global.db.users[m.sender].limit < 1) return m.reply('Soal dihentikan karena limit kamu sudah habis.')
global.db.users[m.sender].limit -= 1
const { image, name } = await func.fetchJson(gamesUrl);
let hadiah = func.hadiah(setting.hadiah);
let id = Date.now();
let caption = `*LANJUT SOAL BERIKUTNYA*\n${global.db.users[m.sender].premium ? '\nPetunjuk: ' + func.texted('monospace', name.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-')) : ''}\nHadiah: $${hadiah} balance\nWaktu: ${setting.gamewaktu} detik`
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.sendMessage(m.chat, {
image: {
url: image
},
caption: caption
}, {quoted: m, ephemeralExpiration: m.expiration}),
jawaban: name.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(function () {
if (database[m.chat]?.id == id) {
mecha.reply(m.chat, `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', name)}`, database[m.chat].chat, {
expiration: m.expiration
});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
}, 1000)
} else if (/conversation|extendedTextMessage/.test(m.mtype)) await mecha.sendMessage(m.chat, {react: {text: '❌', key: m.key}})
}
}
}