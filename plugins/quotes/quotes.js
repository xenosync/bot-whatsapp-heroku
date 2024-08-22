const fetch = require('node-fetch');

exports.run = {
usage: ['quotes'],
hidden: ['quote'],
category: 'quotes',
async: async (m, { func, mecha }) => {
let quotes = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/quotes.json').then(response => response.json())
let result = quotes.random()
let txt = `_${result.quotes}_\n`
txt += `\n_${result.author}_`
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