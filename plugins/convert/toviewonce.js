exports.run = {
usage: ['toviewonce'],
hidden: ['tovo'],
use: 'reply image/video',
category: 'convert',
async: async (m, { func, mecha }) => {
if (!m.quoted) return m.reply(`Reply gambar/video/audio yang ingin di jadikan viewonce!`)
if (/image/.test(m.quoted.mtype)) {
let media = await m.quoted.download()
mecha.sendMessage(m.chat, {image: media, viewOnce: true, caption: m.quoted.caption || '' }, {quoted: m, ephemeralExpiration: m.expiration})
} else if (/video/.test(m.quoted.mtype)) {
let media = await m.quoted.download()
mecha.sendMessage(m.chat, {video: media, viewOnce: true, caption: m.quoted.caption || '' }, {quoted: m, ephemeralExpiration: m.expiration})
} else if (/audio/.test(m.quoted.mtype)) {
let media = await m.quoted.download()
mecha.sendMessage(m.chat, {audio: media, mimetype: 'audio/ogg; codecs=opus', ptt: true, viewOnce: true}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply(`Reply gambar/video/audio yang ingin di jadikan viewonce!`)
},
limit: true
}