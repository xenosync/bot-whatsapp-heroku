const fetch = require('node-fetch');

exports.run = {
usage: ['quotesanime'],
hidden: ['qanime', 'katanime'],
category: 'quotes',
async: async (m, { mecha }) => {
let res = await (await fetch('https://katanime.vercel.app/api/getrandom?limit=1'))
if (!res.ok) return await m.reply(res.text())
let json = await res.json()
if (!json.result[0]) return m.reply(func.jsonFormat(json))
let { id, english, indo, character, anime } = json.result[0]
let txt = `_${indo}_\n`
txt += `\n_${character}_`
txt += `\n_${anime}_`
let button = [
['button', 'Next Quotes', m.cmd]
]
mecha.sendButton(m.chat, '', txt, 'click button below to next quotes', button, m, {
userJid: m.sender,
expiration: m.expiration
})
},
limit: true
}