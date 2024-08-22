let modes = {
noob: [-3, 3,-3, 3, '+-', 15000, 1500],
easy: [-10, 10, -10, 10, '*/+-', 20000, 2000],
medium: [-40, 40, -20, 20, '*/+-', 40000, 3000],
hard: [-100, 100, -70, 70, '*/+-', 60000, 4000],
extreme: [-999999, 999999, -999999, 999999, '*/', 90000, 5000],
impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 15000],
impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 30000]
} 

let operators = {
'+': '+',
'-': '-',
'*': '×',
'/': '÷'
}

function randomInt(from, to) {
if (from > to) [from, to] = [to, from]
from = Math.floor(from)
to = Math.floor(to)
return Math.floor((to - from) * Math.random() + from)
}

function randomNomor(min, max = null) {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

function genMath(mode) {
return new Promise((resolve, reject) => {
let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
let a = randomInt(a1, a2)
let b = randomInt(b1, b2)
let op = pickRandom([...ops])
let hadiah = randomNomor(1000, bonus)
let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? (b) : b}`))()
if (op == '/') [a, result] = [result, a]
hasil = { 
soal: `${a} ${operators[op]} ${b}`,
mode: mode,
waktu: time,
hadiah: hadiah,
jawaban: result
}
resolve(hasil)
})
}

let database = {};
let player = 0;
let mode = ''

exports.run = {
usage: ['math'],
category: 'games',
async: async (m, { func, mecha, setting, isPrem }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.chat in database) return mecha.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', database[m.chat].chat)
if (!m.text) return m.reply( `┌─〔 Mode 〕\n├ ${Object.keys(modes).join('\n├ ')}\n└────\ncontoh:\n${m.prefix}math hard`)
if (!(Object.keys(modes)).includes(m.args[0])) return m.reply('Pilih mode yang bener!')
let { soal, jawaban, waktu, hadiah } = await genMath(m.args[0].toLowerCase())
let id = Date.now();
let caption = `*GAME MATH ${m.args[0].toUpperCase()}*\n\n${func.texted('monospace', 'Berapa hasil dari ' + soal.toLowerCase())}\nHadiah: $${hadiah} balance\nWaktu: ${waktu / 1000} detik`
mode = m.args[0].toLowerCase();
player = 0;
database[m.chat] = {
id: id,
chat: await mecha.reply(m.chat, caption, m, {
expiration: m.expiration
}),
soal: soal,
jawaban: jawaban,
hadiah: hadiah,
waktu: setTimeout(function () {
if (database[m.chat]?.id == id) {
mecha.reply(m.chat, `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', jawaban)}`, database[m.chat].chat, {
expiration: m.expiration
});
delete database[m.chat];
}
}, waktu)
}
},
main: async (m, { func, mecha, setting }) => {
/* GAME KUIS MATH BY SURYA */
if ((m.chat in database) && !m.fromMe && !m.isPrefix) {
let { soal, jawaban, hadiah, waktu } = database[m.chat]
if (m.budy == jawaban) {
player++
mecha.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
global.db.users[m.sender].balance += hadiah
global.db.users[m.sender].game.math += 1
clearTimeout(waktu);
delete database[m.chat];
setTimeout(async () => {
if (player > 1) return
if (global.db.users[m.sender].limit < 1) return m.reply('Soal dihentikan karena limit kamu sudah habis.')
global.db.users[m.sender].limit -= 1
if (!(Object.keys(modes)).includes(mode)) return m.reply('Mode tidak valid, soal dihentikan.')
const { soal, jawaban, waktu, hadiah } = await genMath(mode)
let id = Date.now();
let caption = `*LANJUT SOAL BERIKUTNYA*\n\n${func.texted('monospace', 'Berapa hasil dari ' + soal.toLowerCase())}\nHadiah: $${hadiah} balance\nWaktu: ${waktu / 1000} detik`
player = 0
database[m.chat] = {
id: id,
chat: await mecha.reply(m.chat, caption, m, {
expiration: m.expiration
}),
soal: soal,
jawaban: jawaban,
hadiah: hadiah,
waktu: setTimeout(function () {
if (database[m.chat]?.id == id) {
mecha.reply(m.chat, `Waktu habis!\n\nJawabannya adalah: ${func.texted('monospace', jawaban)}`, database[m.chat].chat, {
expiration: m.expiration
});
delete database[m.chat];
}
}, waktu)
}
}, 1000)
} else if (/conversation|extendedTextMessage/.test(m.mtype)) await mecha.sendMessage(m.chat, {react: {text: '❌', key: m.key}})
}
}
}

exports.database = database;