exports.run = {
usage: ['buylimit'],
use: 'jumlah',
category: 'games',
async: async (m, { func, mecha, setting, users }) => {
if (!m.text) return m.reply(`Masukkan jumlahnya!\nContoh: ${m.cmd} 1`)
let amount = (m.args[0] || '').replace(/[^0-9]/g, '')
if (isNaN(amount)) return m.reply(`Jumlah harus berupa angka!\nContoh: ${m.cmd} 1`)
let harga = users.premium ? 500 : ((users.balance >= 1000000) ? 1500 : setting.limit.price)
let total = Number(parseInt(amount) * harga) 
if (users.balance < total) return m.reply(`Balance kamu tidak mencukupi untuk pembelian ini!`)
users.limit += parseInt(amount);
users.balance -= total;
m.reply(`Membeli *${amount} limit* seharga *${func.rupiah(total)} balance*\n> sisa balance: ${func.rupiah(users.balance)}\n> sisa limit: ${users.limit}`)
}
}