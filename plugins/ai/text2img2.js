const fetch = require('node-fetch');

exports.run = {
usage: ['text2img2'],
hidden: ['txt2img2'],
use: 'text',
category: 'ai',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'a girls'))
mecha.sendReact(m.chat, '🕒', m.key)
let buffer = await textToImage(m.text)
mecha.sendMessage(m.chat, {
image: buffer, caption: 
global.mess.ok
}, {quoted: m, ephemeralExpiration: m.expiration})
},
premium: true
}

async function textToImage(data) {
const response = await fetch("https://api-inference.huggingface.co/models/Yntec/Ninja-Diffusers", {
headers: { Authorization: "Bearer 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" },
method: "POST",
body: JSON.stringify(data),
}
)
const result = await response.blob();
let arrayBuffer = await result.arrayBuffer();
const buffer = Buffer.from(arrayBuffer, 'base64')

return buffer
}