const fetch = require('node-fetch');

exports.run = {
usage: ['gombalan'],
hidden: ['gombal'],
category: 'quotes',
async: async (m, { func, mecha }) => {
let gombalan = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/gombalan.json').then(response => response.json())
let result = gombalan.random()
let button = [
['button', 'Next Quotes', m.cmd]
]
mecha.sendButton(m.chat, '', result, 'click button below to next quotes', button, m, {
userJid: m.sender,
expiration: m.expiration
})
},
limit: true
}