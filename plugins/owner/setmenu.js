exports.run = {
usage: ['setmenu'],
use: '(option)',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
try {
if (!m.args || !m.args[0]) return m.reply(func.example(m.cmd, '2'))
if (!['1', '2', '3'].includes(m.args[0])) return m.reply('Style not available.')
mecha.reply(m.chat, `Bot menu successfully set using style *${m.args[0]}*.`, m, {
expiration: m.expiration
}).then(() => setting.style = parseInt(m.args[0]))
} catch (e) {
mecha.reply(m.chat, func.jsonFormat(e), m)
}
},
owner: true
}