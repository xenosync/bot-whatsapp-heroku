exports.run = {
usage: ['getnewsletter'],
hidden: ['getidch'],
use: 'reply undangan admin channel',
category: 'owner',
async: async (m, { func, mecha }) => {
if (!m.quoted) return m.reply('Reply undangan admin channel.')
const newsletterJid = m?.quoted?.newsletterJid;
if (!newsletterJid) return m.reply('Reply undangan untuk admin channel untuk mendapatkan id channel.')
mecha.reply(m.chat, newsletterJid, m, {
expiration: m.expiration
})
},
owner: true
}