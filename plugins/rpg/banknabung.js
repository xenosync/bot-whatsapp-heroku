exports.run = {
usage: ['nabung'],
hidden: ['nabungall'],
use: 'jumlah',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (user.atm == 0) return m.reply(`Kamu belum memiliki ATM.\n\ngunakan perintah *${m.prefix}atm create* untuk memproses.`)
let count = Math.floor(isNumber(m.args[0]) ? Math.min(Math.max(parseInt(m.args[0]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if (user.money == 0) return m.reply('Kamu tidak memiliki uang.')
if (m.command.includes('all')) count = user.money
if (user.money >= count) {
user.money -= count
user.atm += count
m.reply(`Sukses menabung sebesar ${count} money.`)
} else m.reply(`Uang kamu tidak mencukupi untuk menabung ${count} money.`)
},
register: true
}

function isNumber(number) {
if (!number) return number
number = parseInt(number)
return typeof number == 'number' && !isNaN(number)
}