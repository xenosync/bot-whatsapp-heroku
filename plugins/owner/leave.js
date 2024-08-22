exports.run = {
usage: ['leave'],
use: 'id grup',
category: 'owner',
async: async (m, { func, mecha }) => {
let id = m.args[0] && m.args[0].endsWith('@g.us') ? m.args[0] : m.chat.endsWith('@g.us') ? m.chat : '';
if (!id) return m.reply('Input id grup dengan benar!')
mecha.reply(m.chat, 'SIAP TUAN 🫡', m)
.then(() => mecha.groupLeave(id))
},
owner: true
}