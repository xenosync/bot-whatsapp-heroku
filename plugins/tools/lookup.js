const fetch = require('node-fetch')

async function lookup(url) {
let anu
try {
anu = await fetch(`https://api.api-ninjas.com/v1/dnslookup?domain=${url}`, {
headers: { 'X-Api-Key': 'E4/gdcfciJHSQdy4+9+Ryw==JHciNFemGqOVIbyv' },
contentType: 'application/json'
}).then(v => v.text())
return JSON.stringify(JSON.parse(anu), null, 4)
} catch (e) {
console.log(e)
anu = await fetch(`https://api.hackertarget.com/dnslookup/?q=${url}`).then(v => v.text())
return anu
}
}

exports.run = {
usage: ['lookup'],
hidden: ['dns'],
use: 'domain',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(`Masukkan Domain/Sub Domain!\n\n*Contoh:* ${m.cmd} botcahx.live`)
if (!func.isUrl(m.text)) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
let anu = await lookup(m.text.replace(/^https?:\/\//, ''))
m.reply(`*Hasil Dns Lookup ${m.text} :*\n\n${anu}`)
},
limit: true
}