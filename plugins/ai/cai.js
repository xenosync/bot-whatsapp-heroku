const fetch = require('node-fetch')

exports.run = {
usage: ['cai'],
use: 'text',
category: 'ai',
async: async (m, { func, mecha, errorMessage }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Hai'))
mecha.sendReact(m.chat, '🕒', m.key)
try {
let messageId = 'BAE5' + func.makeid(9).toUpperCase() + 'CAI'
let response = await chatWithCAI(m.budy)
mecha.sendMessage(m.chat, {text: `${response}`}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
} catch (error) {
mecha.sendReact(m.chat, '❌', m.key)
return errorMessage(error)
}
},
main: async (m, { func, mecha, errorMessage }) => {
if (m.budy && m.quoted && m.quoted.fromMe && m.quoted.id.endsWith('CAI') && !m.isPrefix) {
mecha.sendReact(m.chat, '🕒', m.key)
try {
let messageId = 'BAE5' + func.makeid(9).toUpperCase() + 'CAI'
let response = await chatWithCAI(m.budy)
mecha.sendMessage(m.chat, {text: `${response}`}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
global.db.users[m.sender].limit -= 1
} catch (error) {
mecha.sendReact(m.chat, '❌', m.key)
return errorMessage(error)
}
}
},
limit: true
}

async function chatWithCAI(your_qus) {
let response  = await fetch("https://api.apigratis.site/cai/send_message", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
//external_id: "FHacc-xYyDE3fOygZwnrFGTpAMvzuf3dIXZ-DCUxOpA",
external_id: "5GtHMVlZ-45C8dwvxmJ6MIzHxe4vWsoajm5KV7MP0IU",
message: your_qus
})
})
let data = await response.json()
return data.result.replies[0].text;
}