const fetch = require('node-fetch');

exports.run = {
usage: ['ceklink'],
hidden: ['cekurl'],
use: 'input or reply url',
category: 'tools',
async: async (m, { func, mecha }) => {
let text;
if (m.args.length >= 1) {
text = m.args.slice(0).join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else return m.reply('Input or reply url.')
if (text && !func.isUrl(text)) return m.reply(global.mess.error.url);
let isLoginPage = await checkLoginPage(text);

let detect = isLoginPage 
? 'Website ini memiliki elemen login atau meta tag mencurigakan. Hati-hati jika anda ingin memasuki web tersebut....' 
: 'Website ini tidak terdeteksi memiliki elemen login atau meta tag mencurigakan.'

await mecha.reply(m.chat, detect, m, {
expiration: m.expiration
})
},
limit: true
}

/** 
By: @FuadXyro
*/

async function checkLoginPage(url) {
if (url.endsWith('.com')) {
return false
}

let response = await fetch(url)
let text = await response.text()
const loginElements = ['<form', 'input type="password"', 'input type="email"', 'input type="text"']
const suspiciousMeta = ['csrf-token', 'robots']

for (let element of loginElements) {
if (text.toLowerCase().includes(element)) {
return true
}
}

for (let meta of suspiciousMeta) {
let metaTag = new RegExp(`<meta[^>]*name="${meta}"[^>]*>`, 'i')
if (metaTag.test(text)) {
return true
}
}
return false
}