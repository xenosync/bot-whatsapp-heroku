const translate = require('translate-google-api');

exports.run = {
usage: ['translate'],
hidden: ['tr'],
use: 'kodebahasa text',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'id i love you'))
if (m.text && m.quoted && m.quoted.text) {
let lang = m.text.slice(0, 2)
try {
let data = m.quoted.text
if (data == '') return m.reply(`Input textnya atau reply pesan dengan caption ${m.prefix + m.command} *<kodebahasa>*`)
let result = await translate(`${data}`, {
to: lang
})
mecha.reply(m.chat, result[0], m)
} catch {
return m.reply('Language code not supported.')
}
} else if (m.text) {
let lang = m.text.slice(0, 2)
try {
let data = m.text.substring(2).trim()
if (data == '') return m.reply(`Input textnya atau reply pesan dengan caption ${m.prefix + m.command} *<kodebahasa>*`)
let result = await translate(`${data}`, {
to: lang
})
mecha.reply(m.chat, result[0], m)
} catch {
return m.reply('Language code not supported.')
}
}
},
limit: true,
restrict: true
}