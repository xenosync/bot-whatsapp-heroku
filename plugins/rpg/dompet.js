exports.run = {
usage: ['dompet'],
category: 'rpg',
async: async (m, { func, mecha, setting, fkon }) => {
let who = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
if (typeof global.db.users[who] == 'undefined') return m.reply('User tidak ada didalam database.')
if (!global.db.users[who].register) return m.reply('Pengguna tersebut belum terverifikasi.')
let user = global.db.users[who]
let txt = `Dompet @${who.split('@')[0]}

Name: ${user.name.replaceAll('\n', '')}
Balance: $${func.rupiah(user.balance)}
Limit: ${user.limit}/${user.premium ? 1000 : setting.limit}
Money: ${func.rupiah(user.money)}
Exp: ${user.exp}`
mecha.reply(m.chat, txt, fkon)  
},
register: true
}