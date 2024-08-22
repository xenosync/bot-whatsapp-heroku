const { areJidsSameUser } = require('@whiskeysockets/baileys');

exports.run = {
usage: ['topwin'],
category: 'games',
async: async (m, { func, mecha }) => {
let topwin = {};
Object.entries(global.db.users).map(([jid, v]) => {
let user = global.db.users[jid].game;
let totalwin = 0;
for (let x in user) totalwin += user[x];
topwin[jid] = { jid: jid, win: totalwin }
})
let uwin = Object.entries(topwin).map(([key, value]) => {return {...value, jid: key}})
let sortedwin = uwin.map(func.toNumber('win')).sort(func.sort('win'))
let userswin = sortedwin.map(func.enumGetKey)
let txt = `Kamu Top *${userswin.indexOf(m.sender) + 1}* Win dari *${userswin.length}* Users\n`
txt += sortedwin.slice(0, 10).map(({ jid, win }, i) => `${i + 1}. ${m.isGc && m.members.some(x => areJidsSameUser(jid, x.id)) ? (global.db.users[jid]?.name || mecha.getName(jid)).replaceAll('\n', '\t') : '@' + jid?.split('@')[0]} => ${func.formatNumber(win)} x`).join('\n')
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
}
}