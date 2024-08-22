exports.run = {
usage: ['banknarik'],
use: 'jumlah',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (user.atm == 0) return m.reply(`Kamu belum memiliki ATM.\n\ngunakan perintah *${m.prefix}atm create* untuk memproses.`)
if (!m.text) return m.reply(`Input nominal penarikan atau ketik *${m.cmd} all* untuk menarik semua money kamu.`)
if (m.args[0] && somematch(['all', 'semua'], m.args[0].toLowerCase())) m.args[0] = user.atm - 50000;
let total = Math.floor(isNumber(m.args[0]) ? Math.min(Math.max(parseInt(m.args[0]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if ((user.atm - total) >= 50000) {
user.atm -= total
user.money += total
m.reply(`Sukses menarik sebesar ${total} money.`)
} else m.reply(`Rekening kamu tidak mencukupi untuk menarik ${total} money.`)
},
register: true
}

function isNumber(number) {
if (!number) return number
number = parseInt(number)
return typeof number == 'number' && !isNaN(number)
}

const somematch = (data, id) => {
let res = data.find((x) => x === id)
return res ? true : false;
}