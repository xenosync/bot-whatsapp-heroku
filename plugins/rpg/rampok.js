const cooldown = 900000

exports.run = {
usage: ['rampok'],
hidden: ['merampok'],
use: 'mention or reply',
category: 'rpg',
async: async (m, { func, mecha, froms, setting }) => {
let user = global.db.users[m.sender];
let dapat = (Math.floor(Math.random() * 10000));
if (!froms) return m.reply('Tag salah satu yang kamu ingin rampok.')
if (typeof global.db.users[froms] == 'undefined') return m.reply('Pengguna tidak ada didalam database.')
if (!global.db.users[froms].register) return m.reply('Pengguna tersebut belum terverifikasi.')
if (froms === m.sender) return m.reply('Tidak bisa merampok diri sendiri!')
if (froms === m.bot) return m.reply(`Tidak bisa merampok bot!`)
let timers = (cooldown - (new Date - user.lastrampok))
if (new Date - user.lastrampok <= cooldown) return m.reply(`Kamu sudah merampok, mohon tunggu *${func.clockString(timers)}*`)
if (dapat > global.db.users[froms].money) return m.reply('Target gaada money bodoh, miskin dia')
global.db.users[froms].money -= dapat
user.money += dapat
user.lastrampok = new Date * 1
m.reply(`Berhasil merampok @${froms.split('@')[0]} sebesar *${dapat}* Money.`)
},
group: true,
register: true,
limit: true
}