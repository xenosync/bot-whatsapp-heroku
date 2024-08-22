exports.run = {
usage: ['bank'],
hidden: ['atm'],
use: 'options',
category: 'rpg',
async: async (m, { func, mecha }) => {
let who = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
let user = global.db.users[m.sender];
let target = global.db.users[who];
if (m.args[0] && m.args[0].toLowerCase() === 'create') {
if (user.atm > 0) {
m.reply(`Kamu sudah membuat rekening.`)
} else if (user.money < 50000) {
m.reply(`Minimal memiliki 50.000 money untuk deposit.`)
} else {
user.money -= 50000
user.atm += 50000
m.reply(`Berhasil membuat rekening.`)
}
} else {
if (!target) return m.reply('User tidak ada didalam database.')
if (!target.register) return m.reply('Pengguna tersebut belum terverifikasi.')
if (user.level < target.level) return m.reply('Tidak dapat melihat karena level target lebih tinggi.')
let name = await mecha.getName(who)
let txt = `Aset *${name.replaceAll('\n', '')}*

*Bank :* ${target.atm}
*Money :* ${func.rupiah(target.money)}
*Gold :* ${target.gold}
*Diamond :* ${target.diamond}
*Emerald :* ${target.emerald}`
m.reply(txt)
}
},
register: true
}