function formatter(value) {
return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculatePPN(value) {
return value * 0.1;
}

exports.run = {
usage: ['ppn'],
use: 'nominal',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 1000))
if (m.text && isNaN(m.text)) return m.reply('Nominal harus berupa angka!')
let price = parseInt(m.text)
const formattedPrice = formatter(price);
const formattedPPN = formatter(calculatePPN(price));
let txt = `Harga : Rp. ${formattedPrice},-\n`
txt += `PPN : Rp. ${formattedPPN},-\n`
txt += `Total : Rp. ${formatter(parseInt(price + calculatePPN(price)))},-`
mecha.reply(m.chat, txt, m)
}
}