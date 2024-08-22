exports.run = {
usage: ['setharga'],
hidden: ['setlimitprice'],
use: 'amount',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (!m.text) return m.reply(func.example(m.cmd, '1000'))
if (isNaN(m.args[0])) return m.reply('Amount harus berupa angka!')
let price = Number(parseInt(m.args[0]));
if (setting.limit.price == price) return m.reply('Limit price already this.')
setting.limit.price = price;
m.reply(`Limit price successfully set to *${price}*`)
},
owner: true
}