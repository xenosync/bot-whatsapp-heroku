exports.run = {
usage: ['berburu'],
hidden: ['hunting', 'hunt'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
const cooldown = 3600000
let user = global.db.users[m.sender]
if (new Date - user.lasthunt <= cooldown) return m.reply(`Kamu sudah berburu, mohon tunggu *${func.clockString((user.lasthunt + cooldown) - new Date())}*`)
if (user.armor == 0 || user.sword == 0 || user.bow == 0) return m.reply(`Perlu *${m.prefix}craft* armor, sword, dan bow terlebih dahulu.\n\nAnda memiliki :\n- 🥼 ${user.armor} Armor\n- ⚔️ ${user.sword} Sword\n- 🏹 ${user.bow} Bow`)
let buruan = [
{"hewan": 0}, {"hewan": 0}, {"hewan": 0}, {"hewan": 0}, {"hewan": 0}, {"hewan": 0},
{"hewan": 0}, {"hewan": 0}, {"hewan": 0}, {"hewan": 0}, {"hewan": 0}, {"hewan": 0}
]

for (let x of buruan) {
let random = ranNumb(1, 5)
x.hewan += random
}

let txt = `乂  *R P G - B E R B U R U*

Hasil tangkapan hari ini :
*🐂 Banteng :* ${buruan[0].hewan}
*🐅 Harimau :* ${buruan[1].hewan}
*🐘 Gajah :* ${buruan[2].hewan}
*🐐 Kambing :* ${buruan[3].hewan}
*🐼 Panda :* ${buruan[4].hewan}
*🐊 Buaya :* ${buruan[5].hewan}
*🐃 Kerbau :* ${buruan[6].hewan}
*🐮 Sapi :* ${buruan[7].hewan}
*🐒 Monyet :* ${buruan[8].hewan}
*🐗 Babi hutan :* ${buruan[9].hewan}
*🐖 Babi :* ${buruan[10].hewan}
*🐓 Ayam :* ${buruan[11].hewan}`

user.armordurability -= ranNumb(80, 120)
user.sworddurability -= ranNumb(80, 120)
user.bowdurability -= ranNumb(80, 120)
if (user.armordurability <= 0) {
user.armordurability = 0
user.armor = 0
}
if (user.sworddurability <= 0) {
user.sworddurability = 0
user.sword = 0
}
if (user.bowdurability <= 0) {
user.bowdurability = 0
user.bow = 0
}

user.lasthunt = new Date * 1
m.reply('_Perburuan Dimulai..._')

setTimeout(() => {
user.banteng += buruan[0].hewan
user.harimau += buruan[1].hewan
user.gajah += buruan[2].hewan
user.kambing += buruan[3].hewan
user.panda += buruan[4].hewan
user.buaya += buruan[5].hewan
user.kerbau += buruan[6].hewan
user.sapi += buruan[7].hewan
user.monyet += buruan[8].hewan
user.babihutan += buruan[9].hewan
user.babi += buruan[10].hewan
user.ayam += buruan[11].hewan
mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer, 
thumbUrl: 'https://telegra.ph/file/295a6d5105771875e1797.jpg',
largeThumb: true, 
expiration: m.expiration
})
}, setting.gamewaktu * 1000)
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