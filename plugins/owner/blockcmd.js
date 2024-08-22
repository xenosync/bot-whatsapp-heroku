exports.run = {
usage: ['blockcmd'],
hidden: ['blokcmd'],
use: 'command',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'menu'))
if (setting.blockcmd.includes(m.text)) return m.reply(`*'${m.text}' already in the database.*`)
setting.blockcmd.push(m.text.toLowerCase())
m.reply(`*'${m.text}' added successfully!*`)
},
owner: true
}