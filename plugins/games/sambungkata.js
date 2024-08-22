const fetch = require('node-fetch'), gamesUrl = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/games/kbbi.json'

exports.run = {
usage: ['sambungkata'],
hidden: ['sk'],
use: 'options',
category: 'games',
async: async (m, { func, mecha, update, setting, errorMessage }) => {
try {
let id = m.chat;
let database = global.db.sambungkata;
let room = global.db.sambungkata[id];
let room_all = Object.values(database).find(x => x.id !== id && x.player.includes(m.sender));
let value = m.args[0] && m.args[0].toLowerCase();
let kata = await genKata();
let hadiah = func.hadiah(setting.hadiah);
let messageId = 'BAE5' + func.makeid(9).toUpperCase() + 'SKA'

// [ Membuat Room ]
if (value === 'create') {
if (room_all) return m.reply('Kamu sedang bermain sambung kata di chat lain, selesaikan game kamu terlebih dahulu.')
if (m.chat in global.db.sambungkata) return m.reply('Group masih dalam sesi permainan.');
global.db.sambungkata[id] = {
id: m.chat,
owner: m.sender,
status: 'wait',
player: [],
eliminated: [],
basi: [],
diam: false,
hadiah: 0,
dead: '',
kata: kata,
chat: mecha.reply(m.chat, `Room berhasil dibuat, ketik *${m.cmd} join* untuk bergabung`, m, {
expiration: m.expiration
}),
waktu: false
};
// [ Join sesi permainan ]
} else if (value === 'join') {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (!room) return m.reply('Belum ada sesi permainan.');
if (room.status == 'play') return m.reply('Sesi permainan sudah dimulai.');
if (room.player.includes(m.sender)) return m.reply('Kamu sudah join dalam room ini.');
room.player.push(m.sender)
let caption = `*LIST PLAYER*:\n${room.player.map((v, i) => (i + 1) + '. @' + v.split('@')[0]).join('\n')}\n\nSambung kata akan dimainkan sesuai urutan player *(Bergiliran)* dan hanya bisa dimainkan oleh player yang terdaftar.`.trim()
room.chat = await mecha.reply(m.chat, caption, m, {
expiration: m.expiration
})
} else if (value === 'start') {
if (!room) return m.reply('Belum ada sesi permainan.');
if (room.player.length === 0) return m.reply('Room belum memiliki player.');
if (!room.player.includes(m.sender)) return m.reply('Kamu belum join dalam room ini.');
if (room.player.length < 2) return m.reply('Maaf jumlah player belum memenuhi syarat.');
if (room.owner !== m.sender && !m.isOwner) return m.reply(`Hanya @${room.owner.split('@')[0]} yang dapat memulai permainan.`);
room.dead = room.player[0]
room.status = 'play'
room.chat = await mecha.sendMessage(m.chat, {text: `Giliran @${room.player[0].split('@')[0]}\nMulai : *${(room.kata).toUpperCase()}*\n*${filter(room.kata).toUpperCase()}... ?*\n*Balas soal ini untuk menjawab!*\nKirim *nyerah* untuk menyerah\nTotal: ${room.player.length} Player`, mentions: room.player}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId})
room.hadiah = hadiah
for (let i of room.player) {
let user = global.db.users[i]
if (!('sambungkata' in user.game)) user.game.sambungkata = 0
}
room.waktu = setTimeout(() => {
mecha.reply(m.chat, `Waktu jawab habis\n@${room.dead.split('@')[0]} tereliminasi.`, room.chat).then(async () => {
room.eliminated.push(room.dead)
let index = room.player.indexOf(room.dead)
room.player.splice(index, 1)
room.dead = room.player[0]
if (room.player.length == 1 && room.status == 'play') {
global.db.users[room.player[0]].game.sambungkata += 1
global.db.users[room.player[0]].balance += room.hadiah
mecha.reply(m.chat, `@${room.player[0].split('@')[0]} Menang\nHadiah: $${room.hadiah} balance`, room.chat, { mentions: room.player }).then(() => {
delete database[id]
return !0
})
}
room.diam = true
room.new = true
let who = room.dead
mecha.preSudo('nextkata', who, m, update)
})
}, 6000000)
} else if (value === 'exit') {
if (!room) return m.reply("Tidak ada sesi permainan");
if (!room.player.includes(m.sender)) return m.reply('Kamu tidak dalam sesi permainan.');
if (room.status == 'play') return m.reply("Permainan sudah dimulai, kamu tidak bisa keluar");
room.player.splice(room.player.indexOf(m.sender), 1);
m.reply(`@${m.sender.split("@")[0]} Keluar dari permainan`);
} else if (value === 'delete') {
if (!room) return m.reply('Tidak ada sesi permainan.');
if (room.owner !== m.sender && !m.isOwner) return m.reply(`Hanya @${room.owner.split('@')[0]} yang dapat menghapus sesi permainan ini`);
mecha.sendMessage(m.chat, {text: 'Sesi permainan berhasil dihapus.'}, {quoted: m, ephemeralExpiration: m.expiration}).then(() => {
delete database[id];
});
} else if (value === 'player') {
if (!room) return m.reply('Tidak ada sesi permainan.');
if (!room.player.includes(m.sender)) return m.reply('Kamu tidak dalam sesi permainan.');
if (room.player.length === 0) return m.reply('Sesi permainan belum memiliki player.');
let text = "*S A M B U N G - K A T A*\n\nLIST PLAYER:\n";
text += room.player.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n')
mecha.reply(m.chat, text.trim(), m);
} else {
let text = `*S A M B U N G - K A T A*\n\nGame sambung kata adalah permainan yang dimana setiap pemainnya diharuskan membuat kata dari akhir kata yang berasal dari kata sebelumnya.\nJawaban merupakan kata dasar yaitu tidak mengandung spasi dan imbuhan (me-, -an, dll).\nPemain yang bertahan akan menang dan mendapatkan balance × jumlah pemain.\n\n*C O M M A N D*\n`;
text += `${m.cmd} create\n`;
text += `${m.cmd} join\n`;
text += `${m.cmd} start\n`;
text += `${m.cmd} exit\n`;
text += `${m.cmd} delete\n`;
text += `${m.cmd} player\n`;
mecha.reply(m.chat, text.trim(), m);
}
} catch (error) {
console.error(error)
return errorMessage(error)
}
},
main: async (m, { func, mecha, update }) => {
if (m.chat in global.db.sambungkata) {
let room = global.db.sambungkata[m.chat]
let kata = await genKata()
let member = room.player
let hadiah = ranNumb(500, 1000)
let lose_sambungkata
let win_sambungkata
let messageId = 'BAE5' + func.makeid(9).toUpperCase() + 'SKA'

function mmr(type = '') {
if (type === 'win') {
if (member.length > 0) win_sambungkata = hadiah * member.length
} else if (type === 'lose') {
if (member.length > 0) lose_sambungkata = hadiah * member.length
}
if (type === 'win') return win_sambungkata
else return lose_sambungkata
}

if (room.new) {
if (!/nextkata/i.test(m.budy)) return !0
room.new = false
room.killer = false
room.kata = kata
room.chat = await mecha.sendMessage(m.chat, {text: `Giliran @${room.dead.split('@')[0]}\nMulai : *${(kata).toUpperCase()}*\n*${filter(kata).toUpperCase()}... ?*\n*Balas soal ini untuk menjawab!*\nKirim *nyerah* untuk menyerah\nBalance terkumpul: ${room.hadiah}\nTersisa :\n${func.readmore + room.player.map((v, i) => (i + 1) + '. @' + v.split('@')[0]).join('\n')}`, mentions: room.player}, {quoted: null, ephemeralExpiration: m.expiration, messageId: messageId})
}
if (room.diam) {
if (!/nextkata/i.test(m.budy)) return !0
room.diam = false
room.waktu = setTimeout(() => {
lose_sambungkata = mmr('lose')
win_sambungkata = (room.killer ? mmr('win') : 0)
mecha.sendMessage(m.chat, {text: `Waktu jawab habis\n@${room.dead.split('@')[0]} tereliminasi -${lose_sambungkata} balance${room.killer ? '\n@' + room.killer.split('@')[0] + ' +$' + win_sambungkata + ' balance' : ''}`, mentions: [room.dead, room.killer]}, {quoted: room.chat, ephemeralExpiration: m.expiration}).then(async () => {
room.eliminated.push(room.dead)
if (room.killer) {
global.db.users[room.killer].balance += win_sambungkata
global.db.users[room.dead].balance -= lose_sambungkata
}
let index = member.indexOf(room.dead)
member.splice(index, 1)
if (index == member.length) room.dead = member[0]
else room.dead = member[index]
if (member.length == 1 && room.status == 'play') {
global.db.users[member[0]].game.sambungkata += 1
global.db.users[member[0]].balance += room.hadiah
mecha.reply(m.chat, `@${member[0].split('@')[0]} Berhasil bertahan\nHadiah: $${room.hadiah} balance`, room.chat).then(() => {
delete global.db.sambungkata[m.chat]
return !0
})
} else {
room.diam = true
room.new = true
let who = room.dead
mecha.preSudo('nextkata', who, m, update)
}
})
}, 30000)
}

if (room.dead == m.sender) {
if (/nyerah/i.test(m.budy)) {
lose_sambungkata = mmr('lose')
win_sambungkata = (room.killer ? mmr('win') : 0)
clearTimeout(room.waktu)
mecha.reply(m.chat, `@${room.dead.split('@')[0]} tereliminasi -$${lose_sambungkata} balance${room.killer ? '\n@' + room.killer.split('@')[0] + ' +$' + win_sambungkata + ' balance' : ''}`, room.chat)
room.eliminated.push(room.dead)
if (room.killer) {
global.db.users[room.killer].balance += win_sambungkata
global.db.users[room.dead].balance -= lose_sambungkata
}
let index = member.indexOf(room.dead)
member.splice(index, 1)
if (index == (member.length)) room.dead = member[0]
else room.dead = member[index]
if (member.length == 1 && room.status == 'play') {
global.db.users[member[0]].game.sambungkata += 1
global.db.users[member[0]].balance += room.hadiah
mecha.reply(m.chat, `@${member[0].split('@')[0]} Berhasil bertahan\nHadiah: $${room.hadiah} balance`, room.chat, { mentions: member })
delete global.db.sambungkata[m.chat]
return !0
}
room.new = true
room.diam = true
let who = room.dead
mecha.preSudo('nextkata', who, m, update)
}
if (m.quoted && m.quoted.fromMe && m.quoted.isBot && m.quoted.id.endsWith('SKA')) {
if (m.quoted.id == room.chat.id) {
let answerF = (m.budy.toLowerCase().split(' ')[0]).trim().replace(/[^a-z]/gi, '')
let checkF = await cKata(m.budy.toLowerCase().split(' ')[0])
if (!answerF.startsWith(filter(room.kata))) {
return m.reply(`❌ *Salah!*\nJawaban harus dimulai dari kata *${filter(room.kata)}*`)
} else if (!checkF.status) {
return m.reply(`❌ *Salah!*\nKata *${m.budy.toUpperCase()}* tidak valid!`)
} else if ((filter(room.kata)) == answerF) {
return m.reply(`❌ *Salah!*\nJawabanmu sama dengan soal, silahkan cari kata lain!`)
} else if (room.basi.includes(answerF)) {
return m.reply(`❌ *Salah!*\nKata *${m.budy.toUpperCase()}* sudah pernah digunakan!`)
}
clearTimeout(room.waktu)
room.killer = room.dead
global.db.users[m.sender].balance += hadiah
let waktunya = member.indexOf(room.dead)
room.dead = member[waktunya + 1]
if (waktunya + 1 >= member.length) room.dead = member[0]
room.basi.push(answerF)
room.hadiah += 200
room.chat = await mecha.sendMessage(m.chat, {text: `✅ *Benar!* +$${hadiah} balance\nGiliran @${room.dead.split('@')[0]}\n*${filter(answerF).toUpperCase()}... ?*\n*Balas soal ini untuk menjawab!*\nKirim *nyerah* untuk menyerah\nBalance terkumpul: ${room.hadiah}\nTersisa :\n${func.readmore + room.player.map((v, i) => (i + 1) + '. @' + v.split('@')[0]).join('\n')}`, mentions: room.player}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId})
room.diam = true
room.kata = answerF
let who = room.dead
mecha.preSudo('nextkata', who, m, update)
}
}
} else if (room.dead !== m.sender) {
if (m.quoted && m.quoted.fromMe && m.quoted.isBot && m.quoted.id.endsWith('SKA')) {
if (m.quoted.id == room.chat.id) {
if (room.eliminated.includes(m.sender)) m.reply('Kamu sudah tereliminasi, tunggu hingga game ini selesai\n*Nice Try, next game*')
else if (room.player.includes(m.sender)) {
m.reply(`_Sekarang bukan giliranmu._`)
} else m.reply('Kamu tidak dapat menjawab soal tersebut karena kamu tidak bergabung dalam game ini.')
} else m.reply(`Soal itu sudah lewat.`)
}
}
}
},
group: true
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

function kata() {
return new Promise(async (resolve, reject) => {
function random(list) {
return list[Math.floor(Math.random() * list.length)]
}
let kbbi = await fetch(gamesUrl).then(response => response.json())
let huruf = random(['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u', 'w'])
let res = kbbi.filter(v => v.startsWith(huruf))
resolve({ status: true, kata: random(res) })
})
}

function cKata(input) {
return new Promise(async (resolve, reject) => {
let kbbi = await fetch(gamesUrl).then(response => response.json())
if (!kbbi.find(v => v == input.toLowerCase())) return resolve({ creator: '@neoxrs – Wildan Izzudin', status: false })
resolve({ status: true })
})
}

async function genKata() {
let json = await kata()
let result = json.kata
while (result.length < 3 || result.length > 7) {
json = await kata()
result = json.kata
}
return result
}

function filter(text) {
let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
let misah
if (text.length < 3) return text
// alarm
if (/([qwrtypsdfghjklzxcvbnm][qwrtypsdfhjklzxcvbnm])$/.test(text)) {
let mid = /([qwrtypsdfhjklzxcvbnm])$/.exec(text)[0]
return mid
}

// mati + voc + ng {kijang, pisang, dalang, dll}

if (/([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.test(text)) {
let mid = /([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.exec(text)[0]
return mid
}
// voc2x + mati(optional) {portofolio, manusia, tiup, dll}
else if (/([aiueo][aiueo]([qwrtypsdfghjklzxcvbnm]|ng)?)$/i.test(text)) {
if (/(ng)$/i.test(text)) return text.substring(text.length - 3) // ex tiang, riang, siang
else if (/([qwrtypsdfghjklzxcvbnm])$/i.test(text)) return text.substring(text.length - 2)
else return text.substring(text.length - 1)
}
// ng/ny + voc + mati { sinyal, langit, banyak, dll}
else if (/n[gy]([aiueo]([qwrtypsdfghjklzxcvbnm])?)$/.test(text)) {
let nyenye = /n[gy]/i.exec(text)[0]
misah = text.split(nyenye)
return nyenye + misah[misah.length - 1]
}
// mati { kuku, batu, kamu, aku, saya, dll}
else {
let res = Array.from(text).filter(v => mati.includes(v))
let resu = res[res.length - 1]
for (let huruf of mati) {
if (text.endsWith(huruf)) {
resu = res[res.length - 2]
}
}
misah = text.split(resu)
if (text.endsWith(resu)) {
return resu + misah[misah.length - 2] + resu
}
return resu + misah[misah.length - 1]
}
}