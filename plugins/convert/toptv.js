const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

exports.run = {
usage: ['toptv'],
use: 'reply video',
category: 'convert',
async: async (m, { func, mecha }) => {
if (!m.quoted) return m.reply('Reply video yang ingin di jadikan ptv.')
if (/video/.test(m.quoted.mime)) {
let ptv = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({ ptvMessage: m.quoted }), { userJid: m.chat, quoted: m, ephemeralExpiration: m.expiration })
mecha.relayMessage(m.chat, ptv.message, { messageId: ptv.key.id })
}
},
limit: true
}