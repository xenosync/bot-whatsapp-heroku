const axios = require('axios');
const cheerio = require('cheerio');

function artinama(query) {
return new Promise((resolve, reject) => {
query = query.replace(/ /g, '+')
axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query + '&proses=+Submit%21+').then(({data}) => {
let $ = cheerio.load(data)
let result = $('#body').text();
let a = result.split('\n      \n        \n        \n')[0]
let b = a.split('ARTI NAMA')[1]
let c = b.split('.\n\n')
let d = c[0] + '\n\n' + c[1]
let e = d.replace('\n\n\n\n\n     (adsbygoogle = window.adsbygoogle || []).push({});\n\n\n', '')
resolve(e)
}).catch(reject)
})
}

exports.run = {
usage: ['artinama'],
use: 'nama',
category: 'searching',
async: async (m, { func, mecha, }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'surya'))
mecha.sendReact(m.chat, '🕒', m.key)
let result = await artinama(m.text)
m.reply(result.trim().toString())
},
limit: true
}