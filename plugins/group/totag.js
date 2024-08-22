exports.run = {
usage: ['totag'],
use: 'reply chat',
category: 'admin tools',
async: async (m, { func, mecha }) => {
if (!m.quoted) return m.reply(`Reply pesan dengan caption ${m.cmd}`)
mecha.sendMessage(m.chat, {
forward: m.quoted.fakeObj, 
mentions: m.members.map(v => v.id)
}, {ephemeralExpiration: m.expiration})
},
group: true,
admin: true
}