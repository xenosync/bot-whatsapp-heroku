exports.run = {
usage: ['setgroupname'],
hidden: ['setgrupname', 'setgcname'],
use: 'text',
category: 'group',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Test'))
await mecha.groupUpdateSubject(m.chat, m.text)
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
},
group: true,
admin: true,
botAdmin: true
}