exports.run = {
usage: ['tiktokmp3'],
hidden: ['ttmp3'],
use: 'link tiktok',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSLsa9np7/'))
if (!m.args[0].includes('tiktok.com')) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await func.tiktok(m.args[0]).then(res => {
if (res.status != 200) return m.reply(mess.error.api)
if (res.result.audio == undefined) return m.reply('itu tiktokslide tolol.')
let ptt = /vn/i.test(m.args[1]) ? true : false;
mecha.sendMessage(m.chat, {audio: {url: res.result.audio}, mimetype: 'audio/mpeg', ptt: ptt}, {quoted: m, ephemeralExpiration: m.expiration})
}).catch((e) => m.reply(global.mess.error.api))
},
limit: 3
}