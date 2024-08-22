const gtts = require('node-gtts');
const { tmpdir } = require('os');
const fs = require('fs');
const path = require('path');

exports.run = {
usage: ['tts'],
use: 'kodebahasa text',
category: 'convert',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'id i love you'))
if (m.text && m.quoted && m.quoted.text) {
let lang = m.text.slice(0, 2) || 'id'
try {
let data = m.quoted.text
let tts = gtts(lang)
let filePath = path.join(tmpdir(), func.filename('mp3'))
tts.save(filePath, data, async () => {
mecha.sendMedia(m.chat, await func.fetchBuffer(filePath), m, { expiration: m.expiration })
.then(() => fs.unlinkSync(filePath))
})
} catch (e) {
console.log(e)
return m.reply('Language code not supported.')
}
} else if (m.text) {
let lang = m.text.slice(0, 2)
try {
let data = m.text.substring(2).trim()
let tts = gtts(lang)
let filePath = path.join(tmpdir(), func.filename('mp3'))
tts.save(filePath, data, async () => {
mecha.sendMedia(m.chat, await func.fetchBuffer(filePath), m, { expiration: m.expiration })
.then(() => fs.unlinkSync(filePath))
})
} catch (e) {
console.log(e)
return m.reply('Language code not supported.')
}
}
},
limit: 3,
restrict: true
}