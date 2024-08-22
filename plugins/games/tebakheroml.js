const fetch = require('node-fetch');
const axios = require('axios');
const similarity = require('similarity');
let sensitive = 0.75;
let database = {};
let player = 0;

const TebakHeroML = async (language = 'id') => { // language 'id' or 'en'
try {
const result = await fetch('https://suryadev.vercel.app/games/tebakheroml?language=' + language).then(response => response.json())
const response = await axios({
method: 'GET',
url: result.audio,
responseType: 'arraybuffer'
});
const base64 = Buffer.from(response.data, 'base64');
return {
status: true,
creator: 'SuryaDev',
name: result.name,
audio: base64
}
} catch (error) {
return {
status: false,
creator: 'SuryaDev',
message: String(error)
}
}
}

exports.run = {
usage: ['tebakheroml'],
hidden: ['tebakvoiceml', 'tebakml'],
category: 'games',
async: async (m, { func, mecha, setting, isPrem }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.chat in database) return mecha.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', database[m.chat].chat)
let { name, audio } = await TebakHeroML('id')
let hadiah = func.hadiah(setting.hadiah);
let id = Date.now();
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.sendMessage(m.chat, {
audio: audio,
mimetype: 'audio/mpeg',
contextInfo: {
mentionedJid: [m.sender], 
externalAdReply: {
title: 'GAME TEBAK-HEROML', 
body: `Hadiah: $${hadiah} ( ${setting.gamewaktu} detik )`, 
mediaType: 1, 
previewType: 'PHOTO', 
thumbnailUrl: setting.cover, 
sourceUrl: null, 
renderLargerThumbnail: false
}
}
}, {quoted: m, ephemeralExpiration: m.expiration}),
jawaban: name.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(async function () {
if (database[m.chat]?.id == id) {
mecha.sendMessage(m.chat, {text: `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', name)}`}, {quoted: database[m.chat].chat, ephemeralExpiration: m.expiration});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
},
main: async (m, { func, mecha, setting }) => {
/* GAME TEBAK HERO ML BY SURYA & WULAN */
if ((m.chat in database) && !m.fromMe && !m.isPrefix) {
let { jawaban, hadiah, waktu } = database[m.chat]
if (similarity(jawaban, m.budy.toLowerCase()) >= sensitive) {
player++
mecha.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
global.db.users[m.sender].balance += hadiah
global.db.users[m.sender].game.tebakheroml += 1
clearTimeout(waktu);
delete database[m.chat];
setTimeout(async () => {
if (player > 1) return
if (global.db.users[m.sender].limit < 1) return m.reply('Soal dihentikan karena limit kamu sudah habis.')
global.db.users[m.sender].limit -= 1
let { name, audio } = await TebakHeroML('id')
let hadiah = func.hadiah(setting.hadiah);
let id = Date.now();
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.sendMessage(m.chat, {
audio: audio,
mimetype: 'audio/mpeg',
contextInfo: {
mentionedJid: [m.sender], 
externalAdReply: {
title: 'GAME TEBAK-HEROML', 
body: `Hadiah: $${hadiah} ( ${setting.gamewaktu} detik )`, 
mediaType: 1, 
previewType: 'PHOTO', 
thumbnailUrl: setting.cover, 
sourceUrl: null, 
renderLargerThumbnail: false
}
}
}, {quoted: m, ephemeralExpiration: m.expiration}),
jawaban: name.toLowerCase(),
hadiah: hadiah,
waktu: setTimeout(async function () {
if (database[m.chat]?.id == id) {
mecha.sendMessage(m.chat, {text: `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', name)}`}, {quoted: database[m.chat].chat, ephemeralExpiration: m.expiration});
delete database[m.chat];
}
}, setting.gamewaktu * 1000)
}
}, 1000)
} else if (/conversation|extendedTextMessage/.test(m.mtype)) await mecha.sendMessage(m.chat, {react: {text: '❌', key: m.key}})
}
}
}