exports.run = {
usage: ['facebook4'],
hidden: ['fbdl4'],
use: 'link facebook',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(`Masukkan URL!\n\nContoh: *${m.cmd} https://www.facebook.com/watch/?v=1393572814172251*`)
if (!m.args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(global.mess.error.url)
if (m.args[0].includes('https://l.facebook.com/l.php?u=')) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await func.fetchJson(`https://aemt.me/download/fbdl?url=${m.args[0]}`).then(res => {
if (!res.status) return m.reply(global.mess.error.api)
mecha.sendMedia(m.chat, res.result.HD, m, { caption: global.mess.ok, expiration: m.expiration });
})
},
premium: true,
limit: true
}