exports.run = {
usage: ['tovoicenote'],
hidden: ['tovn'],
use: 'reply audio',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (!m.quoted) return m.reply('Reply audionya!')
if (/audio/.test(quoted.mime)) {
mecha.sendReact(m.chat, '🕒', m.key)
let media = await m.quoted.download()
mecha.sendMessage(m.chat, {audio: media, mimetype: 'audio/ogg; codecs=opus', ptt: true}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply(`Reply audio dengan caption ${m.cmd}`)
},
limit: true
}