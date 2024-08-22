exports.run = {
usage: ['emojimix'],
use: 'emoji + emoji',
category: 'convert',
async: async (m, { func, mecha, packname, author }) => {
let [emoji1, emoji2] = m.text.split('+')
if (!emoji1 || !emoji2) return m.reply(func.example(m.cmd, '😇+😭'))
if (!func.isEmoji(emoji1)) return m.reply(`Gunakan emoji!\nContoh: ${m.cmd} 😇+😭`)
if (!func.isEmoji(emoji2)) return m.reply(`Gunakan emoji!\nContoh: ${m.cmd} 😇+😭`)
let anu = await func.fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
if (anu.results.length === 0) return m.reply('Emojimix not found.')
for (let res of anu.results) {
mecha.sendStickerFromUrl(m.chat, res.url, m, {
packname: packname,
author: author,
categories: res.tags,
expiration: m.expiration
})
}
},
limit: true
}