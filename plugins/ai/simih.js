const fetch = require('node-fetch'),
axios = require('axios');

exports.run = {
usage: ['simi'],
hidden: ['simih'],
use: 'question',
category: 'ai',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'halo'))
await mecha.sendReact(m.chat, '🕒', m.key)
let messageId = 'BAE5' + func.makeid(8).toUpperCase() + 'SIMI'
let data = await chatWithSimi(m.text);
if (data.status != 200) return mecha.sendReact(m.chat, '❌', m.key)
mecha.sendMessage(m.chat, {text: `${data.message}`}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
await mecha.sendReact(m.chat, '✅', m.key)
},
main: async (m, { func, mecha }) => {
if (m.budy && m.quoted && m.quoted.fromMe && m.quoted.id.endsWith('SIMI') && !m.isPrefix) {
await mecha.sendReact(m.chat, '🕒', m.key)
let messageId = 'BAE5' + func.makeid(8).toUpperCase() + 'SIMI'
let data = await chatWithSimi(m.budy);
if (data.status != 200) return mecha.sendReact(m.chat, '❌', m.key)
mecha.sendMessage(m.chat, {text: `${data.message}`}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
global.db.users[m.sender].limit -= 1
await mecha.sendReact(m.chat, '✅', m.key)
}
},
limit: true
}

async function chatWithSimi(question) {
let response = await fetch('https://api.simsimi.vn/v1/simtalk', {
method: 'POST',
headers: {
'Content-Type': 'application/x-www-form-urlencoded'
},
body: new URLSearchParams({
text: question,
lc: 'id', 
key: ''
})
})
let result = await response.json();
return result;
}

async function chatWithSimiV2(question) {
try {
const response = await axios.get('https://simsimi.fun/api/v2/', {
params: {
mode: 'talk',
lang: 'id',
message: m.text,
filter: false
}
});
if (!response.data.success) return { status: 400, creator: 'SuryaDev', message: 'Sorry, I could not understand that.' }
return {
status: 200,
creator: 'SuryaDev',
message: response.data.success
}
} catch (error) {
console.error("Error fetching data:", error);
return {
status: 400,
creator: 'SuryaDev',
message: String(error)
}
}
}