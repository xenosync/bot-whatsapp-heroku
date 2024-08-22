const { areJidsSameUser } = require('@whiskeysockets/baileys');

exports.run = {
usage: ['toplevel'],
category: 'games',
async: async (m, { func, mecha }) => {
let ulevel = Object.entries(global.db.users).map(([key, value]) => {return {...value, jid: key}})
let sortedlevel = ulevel.map(func.toNumber('level')).sort(func.sort('level'))
let userslevel = sortedlevel.map(func.enumGetKey)
let txt = `Kamu Top *${userslevel.indexOf(m.sender) + 1}* Level dari *${userslevel.length}* Users\n`
txt += sortedlevel.slice(0, 10).map(({ jid, level, role }, i) => `${i + 1}. ${m.isGc && m.members.some(x => areJidsSameUser(jid, x.id)) ? (global.db.users[jid]?.name || mecha.getName(jid)).replaceAll('\n', '\t') : '@' + jid?.split('@')[0]} => ${level} (${role})`).join('\n')
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
}
}