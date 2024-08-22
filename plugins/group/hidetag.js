exports.run = {
usage: ['hidetag'],
hidden: ['h'],
use: 'text',
category: 'group',
async: async (m, { func, mecha }) => {
mecha.sendMessage(m.chat, {
text : `${m.text ? m.text : ''}`,
mentions: m.members.map(x => x.id)
}, {quoted: null, ephemeralExpiration: m.expiration})
},
group: true,
admin: true
}