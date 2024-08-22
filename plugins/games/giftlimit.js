exports.run = {
usage: ['giftlimit'],
hidden: ['gift'],
use: 'count + reply chat target',
category: 'games',
async: async (m, { func, mecha }) => {
if (m.quoted) {
if (typeof global.db.users[m.quoted.sender] == 'undefined') return m.reply('User data not found.')
if (m.quoted.sender == m.sender) return m.reply('Tidak bisa gift ke diri sendiri!')
if (!m.text) return m.reply(`Masukkan jumlah nya!`)
if (isNaN(m.text)) return m.reply(`Jumlah harus berupa angka!`)
if (Number(m.text) > 1000) return m.reply('Maksimal 100 untuk gift limit!')
if (Number(m.text) < 1) return m.reply('Minimal 1 untuk bisa gift limit!')
let count = parseInt(m.text.replace(/[^0-9]/g, ''))
if (global.db.users[m.sender].limit < count && !m.isOwner) return m.reply('Limit lo gak cukup dek.')
global.db.users[m.sender].limit -= count
global.db.users[m.quoted.sender].limit += count
m.reply(`Sukses gift limit sebanyak *${count}* kepada @${m.quoted.sender.split('@')[0]}`)
} else m.reply(`Gunakan dengan cara ${m.prefix + m.command} jumlah dan reply pesan target`)
},
group: true
}