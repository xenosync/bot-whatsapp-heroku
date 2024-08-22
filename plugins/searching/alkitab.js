const fetch = require('node-fetch'),
axios = require('axios'),
cheerio = require('cheerio');
 
exports.run = {
usage: ['alkitab'],
use: 'text',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'kejadian'))
mecha.sendReact(m.chat, '🕒', m.key)
let res = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(m.text)}`, {
headers: {
"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
}
})
let $ = cheerio.load(res.data) 
let result = [];
$('div.vw').each(function (a, b) { 
let teks = $(b).find('p').text().trim();
let link = $(b).find('a').attr('href');
let title = $(b).find('a').text().trim();
result.push({ teks, link, title })
}) 
let foto = 'https://telegra.ph/file/a333442553b1bc336cc55.jpg'
let txt = '*A L - K I T A B*'
for (let [index, v] of result.entries()) {
if (v.teks) txt += `\n\n${v.title}\n> ${v.teks}`
}
mecha.sendMedia(m.chat, foto, m, {caption: txt, expiration: m.expiration})
},
limit: true
}