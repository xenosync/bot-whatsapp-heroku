exports.run = {
usage: ['setwatermark'],
hidden: ['setwm'],
use: 'packname | author',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Sticker by|ẉ.ceo/Surya\n\n+week untuk hari\n+date untuk tanggal\n+time untuk waktu'))
let [packname, ...author] = m.text.split('|')
author = (author || []).join('|')
setting.packname = packname || ''
setting.author = author || ''
m.reply(`Sticker Watermark successfully set.`)
},
owner: true
}