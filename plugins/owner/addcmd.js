exports.run = {
usage: ['addcmd'],
hidden: ['setcmd'],
use: 'reply sticker',
category: 'owner',
async: async (m, { func, mecha, quoted }) => {
if (!/webp/.test(quoted.mime)) return m.reply('Reply stikernya!')
if (!m.text) return m.reply(`Untuk command apa?`)
let hash = m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString('base64')
global.db.stickercmd[hash] = {
text: m.text, 
creator: m.sender
}
mecha.sendReact(m.chat, '✅', m.key)
},
owner: true
}