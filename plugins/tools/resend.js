exports.run = {
usage: ['resend'],
use: 'reply media + text',
category: 'tools',
async: async (m, { func, mecha, quoted }) => {
if (!m.quoted) return m.reply('Reply image/video with caption.')
if (/video|image/i.test(quoted.mime)) {
let media = await m.quoted.download()
let caption = m.text ? m.text : ''
mecha.sendMedia(m.chat, media, null, { caption: caption, expiration: m.expiration })
} else m.reply(`Reply image/video dengan caption ${m.cmd}`)
},
limit: true
}