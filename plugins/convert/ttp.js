const cheerio = require('cheerio');
const request = require('request');

const ttp = async (text, color = 'FFFFFF') => {
return new Promise((resolve, reject) => {
const options = {
method: 'POST',
url: `https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect`,
headers: {
"Content-Type": "application/x-www-form-urlencoded",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
"Cookie": "_ga=GA1.2.1667267761.1655982457; _gid=GA1.2.77586860.1655982457; __gads=ID=c5a896288a559a38-224105aab0d30085:T=1655982456:RT=1655982456:S=ALNI_MbtHcmgQmVUZI-a2agP40JXqeRnyQ; __gpi=UID=000006149da5cba6:T=1655982456:RT=1655982456:S=ALNI_MY1RmQtva14GH-aAPr7-7vWpxWtmg; _gat_gtag_UA_6584688_1=1"
},
formData: {
'TextToRender': text,
'FontSize': '100',
'Margin': '30',
'LayoutStyle': '0',
'TextRotation': '0',
'TextColor': color,
'TextTransparency': '0',
'OutlineThickness': '3',
'OutlineColor': '000000',
'FontName': 'Lekton',
'ResultType': 'view'
}
};
request(options, async function(error, response, body) {
if (error) return resolve({status: false, message: error})
const $ = cheerio.load(body)
const result = 'https://www.picturetopeople.org' + $('#idResultFile').attr('value')
resolve({ status: true, author: "expar animej", result: result })
});
})
}

exports.run = {
usage: ['ttp'],
use: 'text | kode color hex',
category: 'tools',
async: async (m, { func, mecha, packname, author, errorMessage }) => {
if (!m.text) return m.reply(func.example(m.cmd, '#FF00FF surya sayang wulan'))
let color = m.args && m.args[0].toString().startsWith('#') ? m.args[0].toString().replace('#', '') : false
let text = color ? m.text.slice(m.args[0].length + 1, m.text.length) : m.text
mecha.sendReact(m.chat, '🕒', m.key)
await ttp(text, color ? color : 'FFFFFF').then(async (res) => {
if (!res.status) return m.reply(global.mess.error.api)
await mecha.sendSticker(m.chat, res.result, m, {
packname: packname, 
author: author,
expiration: m.expiration
})
}).catch((e) => {
m.reply(global.mess.error.api)
return errorMessage(e)
})
},
limit: true
}