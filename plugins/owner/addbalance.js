exports.run = {
usage: ['addbalance'],
use: 'mention or reply',
category: 'owner',
async: async (m, { func, mecha, froms, setting }) => {
const [text1, text2] = m.text.split('|');
if (m.quoted) {
if (!m.text) return m.reply('Input nominalnya.')
let nominal = m.text.replace(/[^0-9]/g, '')
if (isNaN(nominal)) return m.reply('Nominal harus berupa angka.')
if (Number(nominal) >= 9999999999999999) return m.reply('Kebanyakan!')
let count = nominal.length > 0 ? Math.min(9999999999999999, Math.max(parseInt(nominal), 1)) : Math.min(1)
if (count < 1000) return m.reply('Minimal 1000 balance.')
let user = global.db.users[m.quoted.sender]
if (typeof user == 'undefined') return m.reply('User data not found.')
user.balance += count;
m.reply(`Successfully added ${count.rupiah()} balance to @${m.quoted.sender.replace(/@.+/, '')}`)
} else if (m.text) {
if (!text1) return m.reply(`Contoh : ${m.cmd} 62895415497664|1.000.000`)
let number = isNaN(text1) ? (text1.startsWith('+') ? text1.replace(/[()+\s-]/g, '') : (text1).split('@')[1]) : text1
if (isNaN(number)) return m.reply('Invalid number.')
if (number.length > 15) return m.reply('Invalid format.')
let usernya = text1.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
let user = global.db.users[usernya]
let nominal = text2.replace(/[^0-9]/g, '')
if (typeof user == 'undefined') return m.reply('User data not found.')
if (isNaN(nominal)) return m.reply('Nominal harus berupa angka.')
if (Number(nominal) >= 9999999999999999) return m.reply('Kebanyakan!')
let count = nominal.length > 0 ? Math.min(9999999999999999, Math.max(parseInt(nominal), 1)) : Math.min(1)
if (count < 1000) return m.reply('Minimal 1000 balance.')
user.balance += count;
m.reply(`Successfully added ${count.rupiah()} balance to @${usernya.replace(/@.+/, '')}`)
} else m.reply('Mention or Reply chat target.')
},
owner: true
}