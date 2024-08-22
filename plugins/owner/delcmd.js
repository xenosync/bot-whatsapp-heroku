exports.run = {
usage: ['delcmd'],
use: 'reply sticker',
category: 'owner',
async: async (m, { func, mecha, quoted }) => {
if (!/webp/.test(quoted.mime)) return m.reply('Reply stikernya!')
let hash = m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString('base64')
if (!global.db.stickercmd[hash]) return m.reply(`Stiker tersebut tidak ada cmd!`)
delete global.db.stickercmd[hash]
mecha.sendReact(m.chat, '✅', m.key)
},
error: false,
owner: true
}