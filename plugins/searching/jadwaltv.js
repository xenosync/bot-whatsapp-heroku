let available = ['sctv', 'rcti', 'antv', 'gtv', 'indosiar', 'inewstv', 'kompastv', 'metrotv', 'mnctv', 'nettv', 'rtv', 'trans7', 'transtv', 'tvone', 'jaktv', 'daaitv', 'beritasatu', 'tvri']

exports.run = {
usage: ['jadwaltv'],
hidden: ['jtv'],
use: 'channel tv',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'gtv'))
mecha.sendReact(m.chat, '🕒', m.key)
let data = await func.fetchJson('https://aemt.me/jadwaltv?tv=' + m.args[0])
if (typeof data.result == 'undefined') return m.reply('TV tidak ditemukan!')
if (!available.includes(m.args[0])) return m.reply(`${data.tv_available}`)
let txt = `乂  *JADWAL TV ${data.result.channel.toUpperCase()}*\n\n${data.tv_available}\n\n`
txt += data.result.result.filter(x => x.event && x.date).map((v, i) => `${i + 1}. ${v.date}\n- ${v.event}`).join('\n\n')
await m.reply(txt)
},
limit: true
}