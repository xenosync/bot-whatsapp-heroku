const cooldown = 43200000
const timeout = 180000

exports.run = {
usage: ['mancing'],
hidden: ['fishing'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
let user = global.db.users[m.sender]
let timers = (cooldown - (new Date - user.lastfishing))
if (new Date - user.lastfishing <= cooldown) return m.reply(`Kamu sudah memancing, mohon tunggu *${func.clockString(timers)}*`)
if (user.fishingrod == 0) return m.reply(`Perlu *${m.prefix}craft* fishingrod terlebih dahulu.\n\nAnda memiliki *${user.fishingrod}* FishingRod`)
let mancing = [
{"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0},
{"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0}, {"ikan": 0}
]

for (let x of mancing) {
let random = func.randomNomor(0, 100)
x.ikan += random
}

let txt = `乂  *R P G - M A N C I N G*

Hasil tangkapan hari ini :
*🐋 Orca : ${mancing[0].ikan}* 
*🐳 Paus : ${mancing[1].ikan}* 
*🐬 Lumba : ${mancing[2].ikan}* 
*🦈 Hiu : ${mancing[3].ikan}* 
*🐟 Ikan : ${mancing[4].ikan}* 
*🐟 Lele : ${mancing[5].ikan}* 
*🐡 Bawal : ${mancing[6].ikan}*
*🐠 Nila : ${mancing[7].ikan}*
*🦀 Kepiting : ${mancing[8].ikan}*
*🦞 Lobster : ${mancing[9].ikan}*
*🐙 Gurita : ${mancing[10].ikan}*
*🦑 Cumi : ${mancing[11].ikan}*
*🦐 Udang : ${mancing[12].ikan}*`
user.fishingroddurability -= func.randomNomor(80, 120)
if (user.fishingroddurability <= 0) {
user.fishingroddurability = 0
user.fishingrod = 0
}

m.reply('_Sedang memancing..._')
user.lastfishing = new Date * 1
user.mancingcount += 1

setTimeout(async () => {
user.orca += mancing[0].ikan
user.paus += mancing[1].ikan
user.lumba += mancing[2].ikan
user.hiu += mancing[3].ikan
user.ikan += mancing[4].ikan
user.lele += mancing[5].ikan
user.bawal += mancing[6].ikan
user.nila += mancing[7].ikan
user.kepiting += mancing[8].ikan
user.lobster += mancing[9].ikan
user.gurita += mancing[10].ikan
user.cumi += mancing[11].ikan
user.udang += mancing[12].ikan
await mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbUrl: 'https://telegra.ph/file/4a2dad6f0f6dfef650bf3.jpg', 
largeThumb: true, 
expiration: m.expiration
})
}, setting.gamewaktu * 1000)
},
register: true
}

exports.cooldown = cooldown;