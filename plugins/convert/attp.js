exports.run = {
usage: ['attp'],
use: 'text',
category: 'tools',
async: async (m, { func, mecha, packname, author }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'surya sayang wulan'))
mecha.sendReact(m.chat, '🕐', m.key)
let result = await func.fetchBuffer(`https://aemt.me/attp?text=${encodeURIComponent(m.text)}`)
await mecha.sendSticker(m.chat, result, m, {
packname: packname, 
author: author,
expiration: m.expiration
})
},
limit: true
}