const cooldown = 900000

exports.run = {
usage: ['nebang'],
hidden: ['menebang'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
let user = global.db.users[m.sender];
if (user.aqua == 0) return m.reply(`Kamu belum memiliki aqua\nKetik *${m.prefix}buy aqua* untuk membeli Aqua`)
let timers = (cooldown - (new Date - user.lastnebang))
if (new Date - user.lastnebang <= cooldown) return m.reply(`Kamu sudah menebang dan kelelahan, mohon tunggu *${func.clockString(timers)}*`)
let wood = ranNumb(30, 100)
let aqua = ranNumb(10, 80)
user.wood += wood
user.aqua -= aqua
let txt = `💦 Aqua *-${aqua}* dan Kamu mendapatkan *${wood}🪵* Kayu`
m.reply('_Sedang menebang..._')
user.lastnebang = new Date * 1
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