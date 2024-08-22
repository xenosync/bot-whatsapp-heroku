exports.run = {
usage: ['tagall'],
use: 'text',
category: 'group',
async: async (m, { func, mecha }) => {
let txt = `乂  *T A G - A L L*\n${m.text ? '\nPesan: ' + m.text + '\n' : ''}`
for (let mem of m.members) txt += `\n◦  @${mem.id.split('@')[0]}`
mecha.sendMessage(m.chat, {
text: txt, 
mentions: m.members.map(v => v.id)
}, {quoted: m, ephemeralExpiration: m.expiration})
},
group: true,
admin: true
}