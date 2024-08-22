let axios = require("axios");
let fetch = require("node-fetch");
let cheerio = require("cheerio");

async function wikipedia(query) {
try {
const link = await axios.get(`https://id.wikipedia.org/wiki/${query}`)
const $ = cheerio.load(link.data)
let judul = $('#firstHeading').text().trim()
let thumb = $('#mw-content-text').find('div.mw-parser-output > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > a > img').attr('src') || `//k.top4top.io/p_2121ug8or0.png`
let isi = []
$('#mw-content-text > div.mw-parser-output').each(function (a, b) {
let penjelasan = $(b).find('p').text().trim()
isi.push(penjelasan)
console.log(penjelasan)
})
for (let hasil of isi) {
let data = {
status: link.status,
result: {
judul: judul,
thumb: 'https:' + thumb,
isi: hasil.replace('.mw-parser-output .templatequote{overflow:hidden;margin:1em 0;padding:0 40px}.mw-parser-output .templatequote .templatequotecite{line-height:1.5em;text-align:left;padding-left:1.6em;margin-top:0}', '')
}
}
return data
}
} catch (err) {
let data = {
status: link.status,
msg: err
}
return data
}
}

exports.run = {
usage: ['wikipedia'],
hidden: ['wp'],
use: 'pencarian',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'kucing'))
mecha.sendReact(m.chat, '🕒', m.key)
await wikipedia(`${m.text}`).then(res => {
let txt = `乂  *WIKIPEDIA SEARCH*\n`
txt += `\n*Judul:* ${res.result.judul}`
txt += `\n*Penjelasan:*\n${res.result.isi.replace(/\[[(0-9)]\]/g, '')}`
mecha.sendMedia(m.chat, res.result.thumb, m, {
caption: txt, 
ephemeralExpiration: m.expiration
})
}).catch(() => m.reply('Tidak ditemukan.'))
},
limit: true
}