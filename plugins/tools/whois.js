const fetch = require('node-fetch')

exports.run = {
usage: ['whois'],
use: 'domain',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(`Masukkan Domain/Sub Domain!\n\n*Contoh:* ${m.cmd} botcahx.live`)
if (!func.isUrl(m.text)) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
try {
let options = {
method: 'GET',
headers: {
'Authorization': `Token=${['6c7bd1ce704d92c90e2f78d42641a9ee0cbcef198a6ad62a3dd06deb22af6fd3','e60df1f533023bffc332178b8831d62760300d5e612893e3b4fae0a4d7176101'].random()}`
}
}
let response = await fetch(`https://whoisjson.com/api/v1/whois?domain=${m.text.replace(/^https?:\/\//, '')}`, options)
let data = await response.json()
m.reply(JSON.stringify(data, null, 2))
} catch (e) {
console.log(e)
}
},
premium: true,
limit: true
}