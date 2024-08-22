const moment = require('moment-timezone');

exports.run = {
usage: ['inspect'],
use: 'link group',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://chat.whatsapp.com/codeInvite'))
if (!m.text.includes('chat.whatsapp.com')) return m.reply('Link Invalid.')
let linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
let [_, code] = m.text.match(linkRegex) || {}
try {
let res = await mecha.groupQueryInvite(code)
if (!res) return m.reply(func.jsonFormat(res))
let txt = `乂  *GROUP LINK INSPECTOR*\n`
txt += `\n◦  *ID :* ${res.id}`
txt += `\n◦  *Subject :* ${res.subject}`
if (res.subjectOwner) txt += `\n◦  *Subject Update By :* @${res.subjectOwner.split('@')[0]}`
txt += `\n◦  *Subject Update At :* ${moment(res.subjectTime * 1000).tz('Asia/Jakarta').format('DD-MM-YYYY, HH:MM:SS')}`
txt += `\n◦  *Creator :* ${res.owner ? '@' + res.owner.split('@')[0] : res.id.match('-') ? '@' + res.id.split('-')[0] : 'Not Known'}`
txt += `\n◦  *Create At :* ${moment(res.creation * 1000).tz('Asia/Jakarta').format('DD-MM-YYYY, HH:MM:SS')}`
txt += `\n◦  *Members Length :* ${res.size}`
txt += `\n◦  *Desc Update By :* ${res.descOwner ? '@' + res.descOwner.split('@')[0] : ''}`
txt += `\n◦  *Desc Update At :* ${moment(res.descTime * 1000).tz('Asia/Jakarta').format('DD-MM-YYYY, HH:MM:SS')}`
txt += `\n◦  *Desc ID :* ${res.descId}`
txt += `\n◦  *Description :*\n${res.desc ? res.desc : 'No Description'}`
txt += `\n◦  *Teman yang diketahui bergabung :*\n`
txt += res.participants ? res.participants.map((user, i) => `${++i}. @${user.jid.split('@')[0]}`).join('\n') : 'Not Found'
mecha.reply(m.chat, txt.trim(), m)
} catch (e) {
m.reply('Bot sudah di kick, tidak dapat inspect grup tersebut.')
}
},
premium: true,
limit: true
}