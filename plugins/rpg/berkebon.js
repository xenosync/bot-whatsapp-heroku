exports.run = {
usage: ['berkebon'],
hidden: ['berkebun'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
const cooldown = 4500000
const timeout = 120000
const need = 100
let user = global.db.users[m.sender]
if (new Date - user.lastberkebon <= cooldown) return m.reply(`Kamu sudah berkebun, mohon tunggu *${func.clockString((user.lastberkebon + cooldown) - new Date())}*`)
if (user.pickaxe == 0) return m.reply(`Perlu *${m.prefix}craft* pickaxe terlebih dahulu.\n\nAnda memiliki :\n⛏️ ${user.pickaxe} PickAxe`)
let ran = [{"buah": 0}, {"buah": 0}, {"buah": 0}, {"buah": 0}, {"buah": 0}]
for (let x of ran) {
let random = ranNumb(80, 100)
x.buah += random
}
if (user.bibitmangga > need - 1 && user.bibitapel > need - 1 && user.bibitpisang > need - 1 && user.bibitjeruk > need - 1 && user.bibitanggur > need - 1) {
user.bibitmangga -= need
user.bibitapel   -= need
user.bibitpisang -= need
user.bibitjeruk  -= need
user.bibitanggur -= need

user.pickaxedurability -= ranNumb(80, 120)
if (user.pickaxedurability <= 0) {
user.pickaxedurability = 0
user.pickaxe = 0
}

m.reply('_Sedang Berkebun..._')
user.lastberkebon = new Date * 1

setTimeout(() => {
user.mangga += ran[0].buah
user.apel   += ran[1].buah
user.pisang += ran[2].buah
user.jeruk  += ran[3].buah
user.anggur += ran[4].buah
mecha.sendMessageModify(m.chat, `乂  *R P G - B E R K E B U N*\n\nKamu mendapatkan :\n🥭 +${ran[0].buah} Mangga\n🍎 +${ran[1].buah} Apel\n🍌 +${ran[2].buah} Pisang\n🍊 +${ran[3].buah} Jeruk\n🍇 +${ran[4].buah} Anggur`, m, {
title: global.header,
body: global.footer, 
thumbUrl: 'https://i.ibb.co/XpyTNc6/pickebon.jpg', 
largeThumb: true, 
expiration: m.expiration
})
}, setting.gamewaktu * 1000)
} else {
return m.reply(`Diperlukan masing-masing *${need}* bibit terdiri dari bibitmangga, bibitapel, bibitpisang, bibitjeruk, bibitanggur\n\nKamu memiliki :\n- 🌾 ${user.bibitmangga} bibitmangga\n- 🌾 ${user.bibitapel} bibitapel\n- 🌾 ${user.bibitpisang} bibitpisang\n- 🌾 ${user.bibitjeruk} bibitjeruk\n- 🌾 ${user.bibitanggur} bibitanggur`)
}
},
register: true,
limit: true
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