const axios = require('axios');
const fetch = require('node-fetch');
const { format } = require('util');

exports.run = {
usage: ['get'],
use: 'url',
category: 'owner',
async: async (m, { func, mecha }) => {
if (m.quoted || m.text) {
let url = m.quoted ? m.quoted.text : m.text ? m.text : ''
if (!/^https?:\/\//.test(url)) return m.reply('Masukan link dengan awalan dengan http:// atau https://')
let _url = new URL(url)
let res = await fetch(_url.href)
if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
// delete res
throw `Content-Length: ${res.headers.get('content-length')}`
}
if (!/text|json/.test(res.headers.get('content-type'))) return mecha.sendMedia(m.chat, _url, m, { caption: url, fileName: 'file', ephemeralExpiration: m.expiration })
let txt = await res.buffer()
try {
txt = format(JSON.parse(txt + ''))
} catch (e) {
txt = txt + ''
} finally {
m.reply(txt.slice(0, 65536) + '')
}
} else m.reply('Masukkan url nya!')
/*try {
if (!m.text) return m.reply('Masukkan url nya!')
if (!func.regex.url(m.text)) return m.reply(mess.error.url)
const { data } = await axios.get(m.text);
if (typeof data === 'object') {
const parse = JSON.stringify(data, null, 2);
const utils = format(parse);
return m.reply(utils);
} else {
return m.reply(format(data));
}
} catch (error) {
return m.reply(func.jsonFormat(error));
}*/
},
owner: true
}