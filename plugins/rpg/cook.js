//const cooldown = 1000 // 1 detik
//const cooldown = 60000 // 1 menit
//const cooldown = 3600000 // 1 jam
//const cooldown = 86400000 // 1 hari
//const cooldown = 2592000000 // 1 bulan

const cooldown = 1200000 // 10 masakan
const timeout = 300000 // 10 masakan

exports.run = {
usage: ['cook'],
hidden: ['cooking', 'masak', 'memasak'],
use: '[item] [count]',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let txt = `乂  *C O O K I N G - L I S T*

%🍝 steak%
%🍢 sate%
%🍜 rendang%
%🥣 kornet%
%🍱 nugget%
%🍲 bluefin%
%🍛 seafood%
%🥘 moluska%
%🍣 sushi%
%🍤 squidprawm%

Format: *${m.cmd} [item] [jumlah]*
Contoh: *${m.cmd} rendang 2*`

const item = (m.args[0] || '').toLowerCase()
const total = Math.floor(isNumber(m.args[1]) ? Math.min(Math.max(parseInt(m.args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if (new Date - user.lastmasak <= cooldown) return m.reply(`Kamu sudah memasak, mohon tunggu *${func.clockString(user.lastmasak - new Date())}*`)
if (item == 'steak') {
if (user.panda < 1 * total || user.ayam < 1 * total || user.kerbau < 1 * total || user.bawang < 33 * total || user.saus < 43 * total) {
m.reply(`Diperlukan ${1 * total} panda, ${1 * total} ayam, ${1 * total} kerbau, ${33 * total} bawang, ${43 * total} saus.\n\nAnda memiliki :\n- ${user.panda} panda\n- ${user.ayam} ayam\n- ${user.kerbau} kerbau\n- ${user.bawang} bawang\n- ${user.saus} saus`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.panda -= 1 * total
user.ayam -= 1 * total
user.kerbau -= 1 * total
user.bawang -= 33 * total
user.saus -= 43 * total
user.steak += total
user.masakcount += 1
m.reply(`Anda memasak *${total} steak*.\n\nTotal steak : ${user.steak}`)
}, timeout / 30)
}
} else if (item == 'sate') {
if (user.harimau < 1 * total || user.babihutan < 1 * total || user.sapi < 1 * total || user.bawang < 33 * total || user.saus < 43 * total) {
m.reply(`Diperlukan ${1 * total} harimau, ${1 * total} babihutan, ${1 * total} sapi, ${33 * total} bawang, ${43 * total} saus.\n\nAnda memiliki :\n- ${user.harimau} harimau\n- ${user.babihutan} babihutan\n- ${user.sapi} sapi\n- ${user.bawang} bawang\n- ${user.saus} saus`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.harimau -= 1 * total
user.babihutan -= 1 * total
user.sapi -= 1 * total
user.bawang -= 33 * total
user.saus -= 43 * total
user.sate += total
user.masakcount += 1
m.reply(`Anda memasak *${total} sate*.\n\nTotal sate : ${user.sate}`)
}, timeout / 30)
}
} else if (item == 'rendang') {
if (user.gajah < 1 * total || user.buaya < 1 * total || user.bawang < 27 * total || user.cabai < 16 * total || user.jahe < 30 * total) {
m.reply(`Diperlukan ${1 * total} gajah, ${1 * total} buaya, ${27 * total} bawang, ${16 * total} cabai, ${30 * total} jahe.\n\nAnda memiliki :\n- ${user.gajah} gajah\n- ${user.buaya} buaya\n- ${user.bawang} bawang\n- ${user.cabai} cabai, \n- ${user.jahe} jahe`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.gajah -= 1 * total
user.buaya -= 1 * total
user.bawang -= 27 * total
user.cabai -= 16 * total
user.jahe -= 30 * total
user.rendang += total
user.masakcount += 1
m.reply(`Anda memasak *${total} rendang*.\n\nTotal rendang : ${user.rendang}`)
}, timeout / 30)
}
} else if (item == 'kornet') {
if (user.kambing < 1 * total || user.monyet < 1 * total || user.saus < 72 * total || user.asam < 80 * total || user.kemiri < 40 * total) {
m.reply(`Diperlukan ${1 * total} kambing, ${1 * total} monyet, ${72 * total} saus, ${80 * total} asam, ${40 * total} kemiri.\n\nAnda memiliki :\n- ${user.kambing} kambing\n- ${user.monyet} monyet\n- ${user.saus} saus\n- ${user.asam} asam\n- ${user.kemiri} kemiri`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.kambing -= 1 * total
user.monyet -= 1 * total
user.saus -= 72 * total
user.asam -= 80 * total
user.kemiri -= 40 * total
user.kornet += total
user.masakcount += 1
m.reply(`Anda memasak *${total} kornet*.\n\nTotal kornet : ${user.kornet}`)
}, timeout / 30)
}
} else if (item == 'nugget') {
if (user.banteng < 1 * total || user.babi < 1 * total || user.saus < 72 * total || user.bawang < 34* total || user.kemiri < 50 * total) {
m.reply(`Diperlukan ${1 * total} banteng, ${1 * total} babi, ${72 * total} saus, ${34* total} bawang, ${50 * total} kemiri.\n\nAnda memiliki :\n- ${user.banteng} banteng\n- ${user.babi} babi\n- ${user.saus} saus\n- ${user.bawang} bawang, \n- ${user.kemiri} kemiri`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.banteng -= 1 * total
user.babi -= 1 * total
user.saus -= 72 * total
user.bawang -= 34* total
user.kemiri -= 50 * total
user.nugget += total
user.masakcount += 1
m.reply(`Anda memasak *${total} nugget*.\n\nTotal nugget : ${user.nugget}`)
}, timeout / 30)
}
} else if (item == 'sushi') {
if (user.lobster < 2 * total || user.hiu < 3 * total || user.bawal < 3 * total || user.asam < 60 * total || user.kemiri < 30 * total) {
m.reply(`Diperlukan ${2 * total} lobster, ${3 * total} hiu, ${3 * total} bawal, ${60 * total} asam, ${30 * total} kemiri.\n\nAnda memiliki :\n- ${user.lobster} lobster\n- ${user.hiu} hiu\n- ${user.bawal} bawal\n- ${user.asam} asam, \n- ${user.kemiri} kemiri`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.lobster -= 2 * total
user.hiu -= 3 * total
user.bawal -= 3 * total
user.asam -= 60 * total
user.kemiri -= 30 * total
user.sushi += total
user.masakcount += 1
m.reply(`Anda memasak *${total} sushi*.\n\nTotal sushi : ${user.sushi}`)
}, timeout / 30)
}
} else if (item == 'moluska') {
if (user.udang < 3 * total || user.cumi < 3 * total || user.lele < 5 * total || user.saus < 54 * total || user.asam < 75 * total) {
m.reply(`Diperlukan ${3 * total} udang, ${3 * total} cumi, ${5 * total} lele, ${54 * total} saus, ${75 * total} asam.\n\nAnda memiliki :\n- ${user.udang} udang\n- ${user.cumi} cumi\n- ${user.lele} lele\n- ${user.saus} saus, \n- ${user.asam} asam`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.udang -= 3 * total
user.cumi -= 3 * total
user.lele -= 5 * total
user.saus -= 54 * total
user.asam -= 75 * total
user.moluska += total
user.masakcount += 1
m.reply(`Anda memasak *${total} moluska*.\n\nTotal moluska : ${user.moluska}`)
}, timeout / 30)
}
} else if (item == 'squidprawm') {
if (user.kepiting < 2 * total || user.lumba < 3 * total || user.gurita < 7 * total || user.bawang < 26 * total || user.asam < 71 * total) {
m.reply(`Diperlukan ${2 * total} kepiting, ${3 * total} lumba, ${7 * total} gurita, ${26 * total} bawang, ${71 * total} asam.\n\nAnda memiliki :\n- ${user.kepiting} kepiting\n- ${user.lumba} lumba\n- ${user.gurita} gurita\n- ${user.bawang} bawang, \n- ${user.asam} asam`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.kepiting -= 2 * total
user.lumba -= 3 * total
user.gurita -= 7 * total
user.bawang -= 26 * total
user.asam -= 71 * total
user.squidprawm += total
user.masakcount += 1
m.reply(`Anda memasak *${total} squidprawm*.\n\nTotal squidprawm : ${user.squidprawm}`)
}, timeout / 30)
}
} else if (item == 'bluefin') {
if (user.paus < 1 * total || user.ikan < 2 * total || user.kemiri < 50 * total || user.cabai < 20 * total) {
m.reply(`Diperlukan ${1 * total} paus, ${2 * total} ikan, ${50 * total} kemiri, ${20 * total} cabai.\n\nAnda memiliki :\n- ${user.paus} paus\n- ${user.ikan} ikan\n- ${user.kemiri} kemiri, \n- ${user.cabai} cabai`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.paus -= 1 * total
user.ikan -= 2 * total
user.kemiri -= 50 * total
user.cabai -= 20 * total
user.bluefin += total
user.masakcount += 1
m.reply(`Anda memasak *${total} bluefin*.\n\nTotal bluefin : ${user.bluefin}`)
}, timeout / 30)
}
} else if (item == 'seafood') {
if (user.orca < 1 * total || user.nila < 10 * total || user.kemiri < 50 * total || user.cabai < 20 * total) {
m.reply(`Diperlukan ${1 * total} orca, ${10 * total} nila, ${50 * total} kemiri, ${20 * total} cabai.\n\nAnda memiliki :\n- ${user.orca} orca\n- ${user.nila} nila\n- ${user.kemiri} kemiri, \n- ${user.cabai} cabai`)
} else {
user.lastmasak = new Date * 1 + (cooldown * total)
setTimeout(() => {
user.orca -= 1 * total
user.nila -= 10 * total
user.kemiri -= 50 * total
user.cabai -= 20 * total
user.seafood += total
user.masakcount += 1
m.reply(`Anda memasak *${total} seafood*.\n\nTotal seafood : ${user.seafood}`)
}, timeout / 30)
}
} else {
mecha.reply(m.chat, txt.replaceAll('%', '```'), m)
}
},
register: true,
limit: true
}

function isNumber(number) {
if (!number) return number
number = parseInt(number)
return typeof number == 'number' && !isNaN(number)
}