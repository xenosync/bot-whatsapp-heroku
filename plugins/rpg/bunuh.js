const cooldown = 900000

exports.run = {
usage: ['bunuh'],
hidden: ['membunuh'],
use: 'mention or reply',
category: 'rpg',
async: async (m, { func, mecha, froms, setting }) => {
if (!froms) return m.reply('Tag salah satu yang kamu ingin rampok.')
if (typeof global.db.users[froms] == 'undefined') return m.reply('Pengguna tidak ada didalam database.')
let user = global.db.users[m.sender];
let target = global.db.users[froms];
if (!target.register) return m.reply('Pengguna tersebut belum terverifikasi.')
if (froms === m.sender) return m.reply('Tidak bisa merampok diri sendiri!')
if (froms === m.bot) return m.reply(`Tidak bisa merampok bot!`)
let dapat = (Math.floor(Math.random() * 10000));
let health = (Math.floor(Math.random() * 100));
let timers = (cooldown - (new Date - user.lastbunuh))
if (new Date - user.lastbunuh <= cooldown) return m.reply(`Kamu sudah membunuh, mohon tunggu *${func.clockString(timers)}*`)
if (health > target.health) return m.reply('Target sudah tidak memiliki health')
if (dapat > target.money) return m.reply('Target tidak memiliki apapun :(')
target.health -= health
target.money -= dapat
user.money += dapat
user.lastbunuh = new Date * 1
m.reply(`@${froms.split('@')[0]} berhasil di bunuh dan kamu mengambil money target sebesar *${dapat}*\nDarah target berkurang *-${health}* Healt`)
},
group: true,
register: true,
limit: true
}