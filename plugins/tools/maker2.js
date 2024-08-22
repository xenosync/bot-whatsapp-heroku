exports.run = {
usage: ['pooh', 'drake'],
use: 'text1 | text2',
category: 'tools',
async: async (m, { func, mecha }) => {
const [text1, text2] = m.text && m.text.split('|');
if (!(text1 && text2)) return m.reply(func.example(m.cmd, 'surya | skylark'))
mecha.sendReact(m.chat, '🕒', m.key)
await mecha.sendMedia(m.chat, `https://api.popcat.xyz/${m.command}?text1=${text1}&text2=${text2}`, m, {
caption: global.mess.ok, 
expiration: m.expiration
})
},
limit: true
}