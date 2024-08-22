exports.run = {
usage: ['setbio'],
use: 'text',
category: 'owner',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Cukup donasi'))
await mecha.updateProfileStatus(m.text)
m.reply(`Bio bot successfully changed to : ${m.text}`)
},
owner: true
}