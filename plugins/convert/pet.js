exports.run = {
usage: ['pet'],
use: 'reply photo',
category: 'convert',
async: async (m, { func, mecha, quoted, packname, author }) => {
if (!/image\/(jpe?g|png)/.test(quoted.mime)) return m.reply(`Kirim/Reply foto dengan caption ${m.cmd}`)
m.reply(global.mess.wait)
let media = await mecha.downloadAndSaveMediaMessage(m)
let media_url = (await func.telegraPh(media)).url
let hasil = `https://api.popcat.xyz/pet?image=${media_url}`
mecha.sendStickerFromUrl(m.chat, hasil, m, {
packname: packname,
author: author,
expiration: m.expiration
})
},
limit: 5
}