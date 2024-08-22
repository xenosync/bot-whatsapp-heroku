exports.run = {
usage: ['unblockcmd'],
hidden: ['unblokcmd'],
use: 'command',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'menu'))
if (!setting.blockcmd.includes(m.text)) return m.reply(`*'${m.text}' not in database.*`)
setting.blockcmd.splice(setting.blockcmd.indexOf(m.text), 1)
m.reply(`*'${m.text}' has been removed.*`)
},
owner: true
}