exports.run = {
usage: ['stickerwm'],
hidden: ['swm'],
use: 'reply sticker',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Created by | SuryaDev.'))
let [packname, author] = m.text.split('|')
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
let media = await quoted.download()
if (!media) return m.reply(global.mess.wrong)
return await mecha.sendSticker(m.chat, media, m, {
packname: packname || '',
author: author || '',
expiration: m.expiration
})
} else if (/video/.test(quoted.mime)) {
if (quoted.seconds > 9) return m.reply(func.texted('bold', `Maximum video duration is 9 seconds.`))
let media = await quoted.download()
if (!media) return m.reply(global.mess.wrong)
return await mecha.sendSticker(m.chat, media, m, {
packname: packname || '',
author: author || '',
expiration: m.expiration
})
} else if (/webp/.test(quoted.mime)) {
let media = await quoted.download()
if (!media) return m.reply(global.mess.wrong)
return await mecha.sendSticker(m.chat, media, m, {
packname: packname || '',
author: author || '',
expiration: m.expiration
})
} else mecha.reply(m.chat, `To create a watermark on sticker reply media photo or video and use this format *${m.cmd} packname | author*`, m)
},
premium: true,
limit: true
}