exports.run = {
usage: ['sticker2'],
hidden: ['stiker2', 's2'],
use: 'reply image/video',
category: 'convert',
async: async (m, { func, mecha, quoted, packname, author }) => {
try {
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
let media = await quoted.download()
if (!media) return m.reply(global.mess.wrong)
return await mecha.sendStickerFromUrl(m.chat, media, m, {
packname: packname,
author: author,
avatar: m.text.includes('avatar'),
expiration: m.expiration
})
} else if (/video/.test(quoted.mime)) {
if (quoted.seconds > 9) return m.reply('Maximum video duration is 9 seconds.')
let media = await quoted.download()
if (!media) return m.reply(global.mess.wrong)
mecha.sendReact(m.chat, '🕒', m.key)
return await mecha.sendStickerFromUrl(m.chat, media, m, {
packname: packname,
author: author,
avatar: m.text.includes('avatar'),
expiration: m.expiration
})
} else if (/webp/.test(quoted.mime)) {
let media = await quoted.download()
if (!media) return m.reply(global.mess.wrong)
return await mecha.sendStickerFromUrl(m.chat, media, m, {
packname: packname,
author: author,
avatar: m.text.includes('avatar'),
expiration: m.expiration
})
} else m.reply(`Kirim atau reply gambar/video dengan caption ${m.cmd}`)
} catch {
return mecha.reply(m.chat, 'Maaf terjadi kesalahan.\n> silahkan ulangi perintah menggunakan foto baru.', m)
}
},
limit: true
}