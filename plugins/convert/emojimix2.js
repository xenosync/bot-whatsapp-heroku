const fs = require('fs')

exports.run = {
usage: ['emojimix2'],
use: 'emoji',
category: 'convert',
async: async (m, { func, mecha, packname, author }) => {
if (!m.text) return m.reply(func.example(m.cmd, '😅'))
if (!func.isEmoji(m.args[0])) return m.reply(`Itu bukan emoji!\n*Contoh:* ${m.cmd} 😚`)
try {
let anu = await func.fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(m.args[0])}`)
if (anu.results.length == 0) return m.reply('Emoji tidak ditemukan!')
await mecha.reply(m.chat, func.texted('monospace', `Mengirim ${anu.results.length} sticker...`), m)
for (let res of anu.results) {
await mecha.sendStickerFromUrl(m.chat, res.url, null, {
packname: packname,
author: author,
categories: res.tags,
expiration: m.expiration
});
}
mecha.reply(m.chat, global.mess.ok, m)
} catch (e) {
return m.reply(`Mohon gunakan 1 emoji\n*Contoh:* ${m.cmd} 😚`)
}
},
premium: true,
limit: true
}