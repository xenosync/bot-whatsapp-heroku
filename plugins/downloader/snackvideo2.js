const axios = require('axios');
const cheerio = require('cheerio');

function snackvideov2(url) {
if (!/snackvideo/.test(url)) throw "Invalid Snack Video URL!";
return new Promise(async (resolve, reject) => {
axios("https://getsnackvideo.com/results", {
headers: {
cookie: "__cflb=0H28vSdpXGSFQWocc2rgcVyk2PGS8YGd7X1EvX4Kv5s"
},
"data":{
"ic-request": true,
"id": url,
"locale": "en",
"ic-element-id": "main_page_form",
"ic-id": 1,
"ic-target-id": "active_container",
"ic-trigger-id": "main_page_form",
"ic-current-url": "/",
"ic-select-from-response": "#id1",
"_method": "POST"
},
"method": "POST"
}).then(res => {
let $ = cheerio.load(res.data)
let result = {
status: true,
thumb: $(".img_thumb img").attr("src"),
result: $('a.download_link.without_watermark').attr('href')
}
resolve(result)
}).catch((e) => {
reject({ status: false, msg: e })
})
})
}

exports.run = {
usage: ['snackvideo2'],
hidden: ['snackdl2'],
use: 'url snack video',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://s.snackvideo.com/p/d1j3rYee'))
if (!m.args[0].includes('snackvideo.com')) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await snackvideov2(m.args[0]).then(async res => {
if (!res.status) return m.reply(global.mess.error.api)
await mecha.sendMessage(m.chat, {video: {url: res.result}, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
})
},
premium: true,
limit: true
}