const { areJidsSameUser } = require('@whiskeysockets/baileys');

exports.run = {
usage: ['topbalance'],
category: 'games',
async: async (m, { func, mecha }) => {
let ubalance = Object.entries(global.db.users).map(([key, value]) => {return {...value, jid: key}})
let sortedbalance = ubalance.map(func.toNumber('balance')).sort(func.sort('balance'))
let usersbalance = sortedbalance.map(func.enumGetKey)
let txt = `Kamu Top *${usersbalance.indexOf(m.sender) + 1}* Balance dari *${usersbalance.length}* Users\n`
txt += sortedbalance.slice(0, 10).map(({ jid, balance }, i) => `${i + 1}. ${m.isGc && m.members.some(x => areJidsSameUser(jid, x.id)) ? (global.db.users[jid]?.name || mecha.getName(jid)).replaceAll('\n', '\t') : '@' + jid.split('@')[0]} => $${func.rupiah(balance)}`).join('\n')
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
}
}