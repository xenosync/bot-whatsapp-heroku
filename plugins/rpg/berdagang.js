exports.run = {
usage: ['berdagang'],
hidden: ['dagang'],
use: 'mention or reply',
category: 'rpg',
async: async (m, { func, mecha, froms, setting }) => {
const cooldown = 7200000
if (!froms) return m.reply('Tag salah satu yang kamu ingin ajak berdagang')
if (typeof global.db.users[froms] == 'undefined') return m.reply('Pengguna tidak ada didalam database.')
let kamu = global.db.users[m.sender];
let teman = global.db.users[froms];
if (!teman.register) return m.reply('Pengguna tersebut belum terverifikasi.')
if (new Date - kamu.lastdagang <= cooldown) return m.reply(`Kamu sudah berdagang, mohon tunggu *${func.clockString((kamu.lastdagang + cooldown) - new Date())}* lagi.`)
if (10000 > kamu.money) return m.reply('Modal diperlukan, Kamu tidak memiliki 10000 money.')
if (new Date - teman.lastdagang <= cooldown) return m.reply(`Teman anda sedang berdagang, cari partner lain atau tunggu *${func.clockString((teman.lastdagang + cooldown) - new Date())}* lagi . . .`)
if (10000 > teman.money) return m.reply('Modal diperlukan, Rekanmu tidak memiliki 10000 money.')
let dapat
kamu.money -= 10000
teman.money -= 10000
kamu.lastdagang = new Date * 1
teman.lastdagang = new Date * 1
mecha.reply(m.chat, `Mohon bersabar, Kamu dan ${global.db.users[froms].name} sedang berdagang..\n\nModal masing² adalah 10.000 money.`, m)
setTimeout(() => {
dapat = ranNumb(7000, 12000)
kamu.money  += dapat
teman.money += dapat
mecha.reply(m.chat, `*PENGHASILAN DAGANG*\n\n+${dapat} money untukmu dan ${mecha.getName(froms)}`, m)
}, setting.gamewaktu * 1000)
setTimeout(() => {
dapat = ranNumb(7000, 12000)
kamu.money  += dapat
teman.money += dapat
mecha.reply(m.chat, `*PENGHASILAN DAGANG*\n\n+${dapat} money untukmu dan ${mecha.getName(froms)}`, m)
}, setting.gamewaktu * 2000)
setTimeout(() => {
dapat = ranNumb(7000, 12000)
kamu.money  += dapat
teman.money += dapat
mecha.reply(m.chat, `*PENGHASILAN DAGANG*\n\n+${dapat} money untukmu dan ${mecha.getName(froms)}`, m)
}, setting.gamewaktu * 3000)
setTimeout(() => {
dapat = ranNumb(7000, 12000)
kamu.money  += dapat
teman.money += dapat
mecha.reply(m.chat, `*PENGHASILAN DAGANG*\n\n+${dapat} money untukmu dan ${mecha.getName(froms)}`, m)
}, setting.gamewaktu * 4000)
},
group: true,
register: true,
limit: true
}

exports.cooldown = cooldown;

function ranNumb(min, max = null) {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}