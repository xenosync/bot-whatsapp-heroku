exports.run = {
usage: ['tiktokhd'],
hidden: ['tthd'],
use: 'link tiktok',
category: 'downloader',
async: async (m, { func, mecha, isPrem }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSF4cWcA2/'))
if (!m.args[0].includes('tiktok.com')) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await func.tiktok(m.args[0]).then(res => {
if (res.status != 200) return m.reply(mess.error.api)
let txt = '乂  *TIKTOK - DOWNLOADER*\n'
txt += `\n◦  *Title* : ${res.result.caption}`
txt += `\n◦  *Quality* : HD`
mecha.sendMessage(m.chat, {video: {url: res.result.hd}, caption: txt}, {quoted: m, ephemeralExpiration: m.expiration})
}).catch((err) => m.reply('Maaf terjadi kesalahan.'))
},
premium: true,
limit: 5
}