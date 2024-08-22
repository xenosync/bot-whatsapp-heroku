const axios = require('axios'), 
fetch = require('node-fetch');

exports.run = {
usage: ['cekkodam'],
hidden: ['cekkhodam'],
use: 'name',
category: 'user',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'suryadev'))
if (m.text.match('@')) return m.reply('Nama harus berupa huruf alfabet.')
if (typeof m.text == 'number') return m.reply('Nama harus berupa huruf alfabet.')
if (m.text.length > 20) return m.reply('Max 20 character.')
const khodams = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/cekkhodam.json').then(response => response.json())
const khodam = khodams[Math.floor(Math.random() * khodams.length)];
let wait = await mecha.sendMessage(m.chat, {text: func.texted('monospace', 'Checking Khodam...')}, {quoted: m, ephemeralExpiration: m.expiration})
let result = await tiktokTts(`Khodam ${m.text} adalah ${khodam.name} yang memiliki arti ${khodam.meaning}`)
if (result.status) return await mecha.sendMessage(m.chat, {audio: result.base64, mimetype: 'audio/mp4', ptt: true}, {quoted: m, ephemeralExpiration: m.expiration})
setTimeout(function () {
let txt = `C E K - K H O D A M

Name: ${m.text}
Khodam: ${khodam.name}
Meaning: ${khodam.meaning}`
mecha.sendMessage(m.chat, {
text: txt,
edit: wait.key,
mentions: mecha.ments(txt)
}, {quoted: m, ephemeralExpiration: m.expiration})
}, 1000); // Delay untuk simulasi loading
},
limit: true
}

async function tiktokTts(text) {
try {
const { status, data } = await axios('https://tiktok-tts.weilnet.workers.dev/api/generation', {
method: 'POST',
data: {
text: text,
voice: 'id_001'
},
headers: {
"content-type": "application/json",
},
}
);
return {
status: true,
creator: 'SuryaDev',
base64: Buffer.from(data.data, 'base64')
}
} catch (err) {
console.log(err.response.data);
return err.response.data;
}
}