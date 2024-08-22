const { areJidsSameUser } = require('@whiskeysockets/baileys');

const leaderboards = [
'level',
'exp',
'limit',
'money',
'iron',
'gold',
'diamond',
'emerald',
'trash',
'potion',
'petFood',
'wood',
'rock',
'string',
'common',
'uncommon',
'mythic',
'legendary',
'pet'
]

exports.run = {
usage: ['leaderboard'],
hidden: ['lb'],
use: '[type] [page]',
category: 'rpg',
async: async (m, { func, mecha }) => {
let users = Object.entries(global.db.users).map(([key, value]) => {
return { ...value, jid: key }
})
let leaderboard = leaderboards.filter(v => v && !v.includes('@g.us') && users.filter(user => user && user[v]).length)
let type = (m.args[0] || '').toLowerCase()
const getPage = (item) => Math.ceil((users.filter(user => user && user[item]).length) / 25)
let wrong = `Use format *${m.cmd} [type] [page]*
Example: *${m.cmd} money 1*

Type list :
${leaderboard.map(v => '- ' + v).join('\n')}`.trim()
if (!leaderboard.includes(type)) return m.reply(wrong)
let prems = Object.values(global.db.users).filter((x) => x.premium).map(v => v.jid)
let page = isNumber(m.args[1]) ? Math.min(Math.max(parseInt(m.args[1]), 0), getPage(type)) : 0
let sortedItem = users.map(toNumber(type)).sort(sort(type))
let userItem = sortedItem.map(enumGetKey)
let text = `*${func.toFirstCase(type)} Leaderboard page ${page} of ${getPage(type)}*
You: *${userItem.indexOf(m.sender) + 1}* of *${userItem.length}*

${await sortedItem.slice(page * 25, page * 25 + 25).filter(x => x.register).map((user, i) => `*${i + 1}.* ${(m.isGc ? m.members.some(v => areJidsSameUser(user.jid, v.id)) : Object.values(global.db.users).filter(x => x.register).some(v => areJidsSameUser(user.jid, v.jid))) ? `${global.db.users[user.jid].name.replaceAll('\n', ' ')}` : '@' + user.jid.split('@')[0]} => *${user[type]} ${type}*`).join`\n`}
`.trim()
await mecha.reply(m.chat, text, m);
},
register: true
}

function sort(property, ascending = true) {
if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function isNumber(number) {
if (!number) return number
number = parseInt(number)
return typeof number == 'number' && !isNaN(number)
}

function toNumber(property, _default = 0) {
if (property) return (a, i, b) => {
return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
}
else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
return a.jid
}