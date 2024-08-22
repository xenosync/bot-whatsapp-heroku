exports.run = {
usage: ['stable-diffusion'],
hidden: ['diffusion', 'std'],
use: 'a cat',
category: 'ai',
async: async (m, { func, mecha }) => {
const AI = require('stable-diffusion-cjs')
if (!m.text) return m.reply(func.example(m.cmd, 'masterpiece, best quality, 1girl, solo, long hair, skirt, outdoors, cloud, black hair, blue eyes, shirt, long sleeves, shoes, sky, tree, black skirt, full body, blue sky, bangs, blush, blue shirt, sneakers, standing, grass, white footwear, cloudy sky, day, print shirt, looking at viewer, walking, from side, <lora:add_detail:1>'))
mecha.sendReact(m.chat, '🕒', m.key)
AI.generate(m.text, async (result) => {
if (result.error) return m.reply(global.mess.error.api)
for (let i = 0; i < result.results.length; i++) {
let data = result.results[i].split(',')[1]
let buffer = Buffer.from(data, 'base64')
let filename = `_image ${i + 1}_`
mecha.sendMessage(m.chat, {image: buffer, caption: filename}, {quoted: m, ephemeralExpiration: m.expiration})
}
})
},
premium: true,
limit: 5
}