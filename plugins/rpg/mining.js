const cooldown = 900000

exports.run = {
usage: ['mining'],
hidden: ['menambang'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
let user = global.db.users[m.sender];
let timers = (cooldown - (new Date - user.lastmining))
if (user.health < 80) return m.reply(`Butuh minimal *❤️ 80 Health* untuk ${m.command}!\n\nKetik *${m.prefix}heal* untuk menambah health.\nAtau *${m.prefix}use potion* untuk menggunakan potion.`)
if (new Date - user.lastmining <= cooldown) return m.reply(`Kamu sudah berpetualang, mohon tunggu *${func.clockString(timers)}*`)
let money = ranNumb(1000, 3000)
let iron = ranNumb(10, 100)
let gold = ranNumb(10, 50)
let diamond = ranNumb(10, 30)
let emerald = ranNumb(10, 20)
let rock = ranNumb(50, 100)
let trash = ranNumb(10, 100)
let health = ranNumb(3, 10)
user.money += money
user.iron += iron
user.gold += gold
user.emerald += emerald
user.diamond += diamond
user.rock += rock
user.trash += trash
user.health -= health
let txt = `乂  *R P G - M I N I N G*

❤️health *-${health}*
Anda membawa pulang :
*Money :* ${money}
*Iron :* ${iron}
*Gold :* ${gold}
*Emerald :* ${emerald}
*Diamond :* ${diamond}
*Rock :* ${rock}
*Trash :* ${trash}`
m.reply('_Sedang menambang..._')
user.lastmining = new Date * 1
setTimeout(() => {
mecha.reply(m.chat, txt, m)
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