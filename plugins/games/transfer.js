exports.run = {
usage: ['transfer'],
hidden: ['tf'],
use: 'nominal + reply chat',
category: 'games',
async: async (m, { func, mecha }) => {
if (m.quoted && m.quoted.sender) {
let nominal = m.text.replace(/[^0-9]/g, '')
let target = m.quoted.sender;
if (!target) return m.reply(`Gunakan dengan cara ${m.cmd} *nominal @tag*\n> contoh: ${m.cmd} 1000 @0`)
if (typeof global.db.users[target] == 'undefined') return m.reply('User data not found.')
if (target == m.sender) return m.reply('Tidak bisa transfer ke diri sendiri!')
if (!nominal) return m.reply(`Masukkan nominal nya!`)
if (isNaN(nominal)) return m.reply(`Nominal harus berupa angka!`)
if (Number(nominal) >= 9999999999999999) return m.reply('Kebanyakan!')
let count = nominal.length > 0 ? Math.min(9999999999999999, Math.max(parseInt(nominal), 1)) : Math.min(1)
if (count < 1000) return m.reply('Minimal 1000 untuk bisa transfer!')
if (global.db.users[m.sender].balance >= count) {
global.db.users[m.sender].balance -= count
global.db.users[target].balance += count
m.reply(`Sukses transfer balance sebesar *$${func.rupiah(count)}* kepada @${target.split('@')[0]}`)
} else m.reply(`Balance kamu tidak mencukupi untuk mentransfer balance sebesar ${count}`)
} else if (m.text) {
let nominal = m.args[0].toString().replace(/[^0-9]/g, '')
let target = m.text.slice(m.args[0].length + 1, m.text.length).replace(/[^0-9]/g, '')
if (!target) return m.reply(`Gunakan dengan cara ${m.cmd} *nominal @tag*\n> contoh: ${m.cmd} 1000 @0`)
if (!nominal) return m.reply(`Gunakan dengan cara ${m.cmd} *nominal @tag*\n> contoh: ${m.cmd} 1000 @0`)
target = target + '@s.whatsapp.net';
if (!(target in global.db.users)) return m.reply('User data not found.')
if (target == m.sender) return m.reply('Tidak bisa transfer ke diri sendiri!')
if (!nominal) return m.reply(`Masukkan nominal nya!`)
if (isNaN(nominal)) return m.reply(`Nominal harus berupa angka!`)
if (Number(nominal) >= 9999999999999999) return m.reply('Kebanyakan!')
let count = nominal.length > 0 ? Math.min(9999999999999999, Math.max(parseInt(nominal), 1)) : Math.min(1)
if (count < 1000) return m.reply('Minimal 1000 untuk bisa transfer!')
if (global.db.users[m.sender].balance >= count) {
global.db.users[m.sender].balance -= count
global.db.users[target].balance += count
m.reply(`Sukses transfer balance sebesar *$${func.rupiah(count)}* kepada @${target.split('@')[0]}`)
} else m.reply(`Balance kamu tidak mencukupi untuk mentransfer balance sebesar ${count}`)
} else m.reply(`Gunakan dengan cara ${m.cmd} *nominal @tag*\n> contoh: ${m.cmd} 1000 @0`)
},
group: true
}