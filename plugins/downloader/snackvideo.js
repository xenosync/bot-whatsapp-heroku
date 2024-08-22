const axios = require('axios')
const cheerio = require('cheerio')

async function snackdl(url) {
if (!/snackvideo/.test(url)) throw "Invalid Snack Video URL!";
return new Promise(async (resolve, reject) => {
await axios.post('https://api.teknogram.id/v1/snackvideo', {
url: url
})
.then(({ data }) => {
let result = {
status: true,
url: data.url
}
resolve(result)
})
.catch((e) => {
let result = {
status: false,
msg: "Can't download videos"
}
reject(result)
})
})
}

exports.run = {
usage: ['snackvideo'],
hidden: ['snackdl'],
use: 'url snack video',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://s.snackvideo.com/p/d1j3rYee'))
if (!m.args[0].includes('snackvideo.com')) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await snackdl(m.args[0]).then(async res => {
if (!res.status) return m.reply(global.mess.error.api)
await mecha.sendMessage(m.chat, {video: {url: res.url}, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
})
},
premium: true,
limit: true
}