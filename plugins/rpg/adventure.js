//const cooldown = 1000 // 1 detik
//const cooldown = 60000 // 1 menit
//const cooldown = 3600000 // 1 jam
//const cooldown = 86400000 // 1 hari
//const cooldown = 2592000000 // 1 bulan
const cooldown = 900000

exports.run = {
usage: ['adventure'],
hidden: ['petualang', 'berpetualang'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
let user = global.db.users[m.sender]
let timers = (cooldown - (new Date - user.lastadventure))
if (user.health < 80) return m.reply(`Butuh minimal *❤️ 80 Health* untuk ${m.command}!!\n\nKetik *${m.prefix}heal* untuk menambah health.\nAtau *${m.prefix}use potion* untuk menggunakan potion.`)
if (new Date - user.lastadventure <= cooldown) return m.reply(`Kamu sudah berpetualang, mohon tunggu *${func.clockString(timers)}*`)

user.adventurecount += 1

const health = ranNumb(3, 6)
const money = ranNumb(1000, 3000)
const exp = ranNumb(500, 1000)
const trash = ranNumb(10, 50)
const rock = ranNumb(1, 4)
const wood = ranNumb(1, 4)
const string = ranNumb(1, 3)
const common = ranNumb(1, 2)
const gold = 1
const emerald = 1
const diamond = 1

user.health -= health
user.money += money
user.exp += exp
user.trash += trash
user.rock += rock
user.wood += wood
user.string += string
if (user.adventurecount % 25  == 0) user.common += common
if (user.adventurecount % 50  == 0) user.gold += gold
if (user.adventurecount % 150 == 0) user.emerald += emerald
if (user.adventurecount % 400 == 0) user.diamond += diamond
let txt = `乂  *RPG - ADVENTURE*\n\n`
txt += `❤️ health *-${health}*\nAnda membawa pulang :\n`
txt += `*Money :* ${money}\n`
txt += `*Exp :* ${exp}\n`
txt += `*Trash :* ${trash}\n`
txt += `*Rock :* ${rock}\n`
txt += `*Wood :* ${wood}\n`
txt += `*String :* ${string}`
if (user.adventurecount % 25  == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*Common :* ${common}`
if (user.adventurecount % 50  == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*Gold :* ${gold}`
if (user.adventurecount % 150 == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*Emerald :* ${emerald}`
if (user.adventurecount % 400 == 0) txt += `\n\nBonus adventure ${user.adventurecount} kali\n*Diamond :* ${diamond}`
m.reply('_Sedang berpetualang..._')
user.lastadventure = new Date * 1
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