let database = {};

const items = [
'balance', 'limit',
'money', 'potion', 'trash', 'wood',
'rock', 'string', 'petFood', 'emerald',
'diamond', 'gold', 'iron', 'common',
'uncommon', 'mythic', 'legendary', 'pet',
]

exports.run = {
usage: ['transfer'],
hidden: ['tf'],
use: '[type] [value] [@tag]',
category: 'rpg',
async: async (m, { func, mecha }) => {
if (database[m.sender]) return m.reply('Kamu sedang melakukan transfer!')
let user = global.db.users[m.sender]
const item = items.filter(v => v in user && typeof user[v] == 'number')
let example = `Use format ${m.cmd} [type] [value] [number]
Example : ${m.cmd} money 9999 @0

*Transferable Items*
${item.map(v => func.ucword(v)).join('\n')}
`.trim()
const type = (m.args[0] || '').toLowerCase()
if (!item.includes(type)) return m.reply(example)
const count = m.args[1] && m.args[1].length > 0 ? Math.min(9999999999999999, Math.max(parseInt(m.args[1]), 1)) : Math.min(1)
let who = m.args[2] ? (m.args[2].replace(/[^0-9]/g, '') + '@s.whatsapp.net') : m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : ''
if (!who) return m.reply('Tag salah satu, atau ketik nomornya!')
if (!(who in global.db.users)) return m.reply('Pengguna tidak ada didalam database.')
if (!global.db.users[who].register) return m.reply('Pengguna tersebut belum terverifikasi.')
if (user[type] * 1 < count) return m.reply(`*${type}${special(type)}* Anda lebih sedikit *${count - user[type]}*`)
let txt = `Are you sure you want to transfer *${count}* ${type}${special(type)} to @${(who || '').replace(/@s\.whatsapp\.net/g, '')}
Timeout *60* detik.`.trim()
mecha.reply(m.chat, txt + `\n\nketik *(Y/N)*`, m, { mentions: [who] })
database[m.sender] = {
sender: m.sender,
to: who,
key: m.key,
type: type,
count: count,
timeout: setTimeout(() => (m.reply('Timeout.'), delete database[m.sender]), 60 * 1000)
}
},
main: async (m, { func, mecha }) => {
if (m.isBot) return;
if (!(m.sender in database)) return;
if (!m.budy) return;
let { timeout, sender, key, to, type, count } = database[m.sender]
if (m.id === key.id) return
let user = global.db.users[sender]
let who = global.db.users[to]
if (func.somematch(['n', 'no'], m.budy.toLowerCase())) {
clearTimeout(timeout)
delete database[sender]
return m.reply('Transfer successfully cancelled.')
}
if (func.somematch(['y', 'yes'], m.budy.toLowerCase())) {
let user_type = user[type] * 1
let who_type = who[type] * 1
user[type] -= count * 1
who[type] += count * 1
if (user_type > user[type] * 1 && who_type < who[type] * 1) await mecha.reply(m.chat, `Succes transfer *${count}* ${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, m)
else {
user[type] = user_type
who[type] = who_type
m.reply(`Failed to transfer *${count}* ${type}${special(type)} to *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, { mentions: [to] })
}
clearTimeout(timeout)
delete database[sender]
}
},
register: true,
group: true
}

exports.database = database;

function special(type) {
let b = type.toLowerCase()
let special = (['common', 'uncommon', 'mythic', 'legendary', 'pet'].includes(b) ? ' Crate' : '')
return special
}

function isNumber(x) {
return typeof x === 'number' && !isNaN(x)
}