const axios = require('axios');
const cheerio = require('cheerio');

exports.run = {
usage: ['jarak'],
use: 'kota - kota',
category: 'tools',
async: async (m, { func, mecha }) => {
const [from, to] = m.text.split('-')
if (!(from && to)) return m.reply(func.example(m.cmd, 'jakarta - bandung'))
let data = await jarak(from, to)
if (data.img) return mecha.sendMessage(m.chat, {image: data.img, caption: data.desc}, {quoted: m, ephemeralExpiration: m.expiration})
else m.reply(data.desc)
},
limit: 5
}

async function jarak(dari, ke) {
let html = (await axios(`https://www.google.com/search?q=${encodeURIComponent('jarak ' + dari + ' ke ' + ke)}&hl=id`)).data
let $ = cheerio.load(html), result = {};
let img = html.split("var s=\'")?.[1]?.split("\'")?.[0]
result.img = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split(',')[1], 'base64') : ''
result.desc = $('div.BNeawe.deIvCb.AP7Wnd').text()?.trim()
return result
}