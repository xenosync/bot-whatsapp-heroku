let database = {};

exports.run = {
usage: ['changename'],
hidden: ['ubahnama'],
use: 'new name',
category: 'user',
async: async (m, { func, mecha }) => {
if (m.text) {
if (global.db.users[m.sender].name === m.text) return m.reply('Your name already this.')
let name = m.text
global.db.users[m.sender].name = name
mecha.reply(m.chat, `Name successfully changed to: ${name}`, m)
return !0
}
let sender = m.sender;
database[sender] = Date.now()
mecha.reply(m.chat, `Please type your new name...`, m)
return !0
},
main: async (m, { func, mecha }) => {
let sender = m.sender;
if (sender in database && (Date.now() - database[sender]) < 3600000) {
if (!m.budy) return mecha.sendMessage(m.chat, {text: 'Please type your new name...'}, {quoted: m, ephemeralExpiration: m.expiration})
if (m.budy.startsWith(m.prefix)) return m.reply(`Name cannot be prefixed with ${m.prefix}`)
if (global.db.users[sender].name === m.budy) return m.reply('Your name already this.')
let name = m.budy
global.db.users[sender].name = name
mecha.reply(m.chat, `Name successfully changed to: ${name}`, m)
delete database[sender]
}
},
limit: true
}