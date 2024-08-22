const axios = require('axios');
const cheerio = require('cheerio');

const cariresep = async (query) => {
return new Promise(async (resolve, reject) => {
axios.get('https://resepkoki.id/?s=' + query)
.then(({ data }) => {
const $ = cheerio.load(data)
const link = [];
const judul = [];
const upload_date = [];
const format = [];
const thumb = [];
$('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a, b) {
link.push($(b).attr('href'))
})
$('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c, d) {
jud = $(d).text();
judul.push(jud)
})
for (let i = 0; i < link.length; i++) {
format.push({
judul: judul[i],
link: link[i]
})
}
const result = {
creator: 'Surya',
data: format
}
resolve(result)
})
.catch(reject)
})
}

exports.run = {
usage: ['cariresep'],
use: 'text',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'seblak'))
m.reply(global.mess.wait)
await cariresep(m.text).then(res => {
let txt = '乂  *C A R I - R E S E P*'
for (let i of res.data) {
txt += `\n\n◦  Judul : ${i.judul}`
txt += `\n◦  Link : ${i.link}`
}
mecha.reply(m.chat, txt, m)
})
},
limit: true
}