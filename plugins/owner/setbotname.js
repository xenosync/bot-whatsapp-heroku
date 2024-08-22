exports.run = {
usage: ['setbotname'],
use: 'text',
category: 'owner',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'mecha 1'))
await mecha.updateProfileName(m.text)
m.reply(`Bot name successfully changed to : ${m.text}`)
},
owner: true
}