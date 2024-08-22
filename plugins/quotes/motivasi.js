const fetch = require('node-fetch');

exports.run = {
usage: ['motivasi'],
category: 'quotes',
async: async (m, { func, mecha }) => {
let result = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/motivasi.json').then(response => response.json())
let txt = result.random()
let button = [
['button', 'Next Motivasi', m.cmd]
]
mecha.sendButton(m.chat, '', txt, 'click button below to next motivation', button, m, {
userJid: m.sender,
expiration: m.expiration
})
},
limit: true
}