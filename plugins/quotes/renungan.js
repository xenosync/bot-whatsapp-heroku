const fetch = require('node-fetch');

exports.run = {
usage: ['renungan'],
category: 'quotes',
async: async (m, { func, mecha }) => {
let renungan = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/renungan.json').then(response => response.json())
let result = renungan.random()
await mecha.sendMessage(m.chat, {
image: {
url: result
}, caption: 'Nih Renungan nya..', 
mimetype: 'image/jpeg'
}, {quoted: m, ephemeralExpiration: m.expiration})
},
limit: true
}