exports.run = {
usage: ['alert', 'unforgivable', 'oogway', 'sadcat', 'biden', 'pikachu'],
use: 'text',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'surya skylark'))
if (m.text.length > 50) return m.reply('Teksnya terlalu panjang!')
mecha.sendReact(m.chat, '🕒', m.key)
await mecha.sendMedia(m.chat, `https://api.popcat.xyz/${m.command}?text=${m.text}`, m, {
caption: global.mess.ok, 
expiration: m.expiration
})
},
limit: true
}