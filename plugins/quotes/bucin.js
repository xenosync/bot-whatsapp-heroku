const fetch = require('node-fetch');

exports.run = {
usage: ['bucin'],
category: 'quotes',
async: async (m, { func, mecha }) => {
let bucin = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/bucin.json').then(response => response.json())
let result = bucin.random()
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