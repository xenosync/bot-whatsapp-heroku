const { areJidsSameUser } = require('@whiskeysockets/baileys');

exports.run = {
usage: ['toptoxic'],
category: 'group',
async: async (m, { mecha, setting, groups }) => {
const data = groups.member;
if (data.length == 0) return m.reply('Empty data.')
let toptoxic = data.sort((a, b) => b.toxic - a.toxic)
let userstoxic = toptoxic.map(v => v.jid)
let txt = `Kamu Top *${userstoxic.indexOf(m.sender) + 1}* Toxic dari *${data.length}* Users\n\n`
txt += toptoxic.slice(0, 30).map((v, i) => `${i + 1}. ${m.members.some(x => areJidsSameUser(v.jid, x.id)) ? (global.db.users[v.jid]?.name == undefined ? 'No name' : global.db.users[v.jid]?.name).replaceAll('\n', '\t') : '@' + (v.jid || v.id).split('@')[0]} => (${v.toxic}/${setting.ctoxic})`).join('\n')
m.reply(txt)
},
group: true,
admin: true
}