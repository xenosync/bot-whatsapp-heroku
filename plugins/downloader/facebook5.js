exports.run = {
usage: ['facebook5'],
hidden: ['fbdl5', 'fb5'],
use: 'link facebook',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(`Masukkan URL!\n\nContoh: *${m.cmd} https://www.facebook.com/watch/?v=1393572814172251*`)
if (!m.args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return m.reply(global.mess.error.url)
if (m.args[0].includes('https://l.facebook.com/l.php?u=')) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
try {
const result = await func.fetchJson('https://suryadev.vercel.app/api/snapsave?url=' + m.args[0])
if (!result.status) return m.reply(result.msg)
const video = Array.isArray(result.data) ? result.data[0] : false
if (!video) return m.reply('Maaf terjadi kesalahan.')
mecha.sendMessage(m.chat, {
document: {
url: video.url
},
caption: video.resolution,
mimetype: 'video/mp4',
fileName: Date.now() + '.mp4'
}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (error) {
return mecha.reply(m.chat, String(error), m, {
expiration: m.expiration
})
}
},
premium: false,
limit: 3
}