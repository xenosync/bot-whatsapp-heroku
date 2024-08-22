let database = {};
let BASE_URL = "https://tinyurl.com/api-create.php"

exports.run = {
usage: ['shorturl'],
hidden: ['shortlink'],
use: 'url',
category: 'convert',
async: async (m, { func, mecha }) => {
if (m.text) {
if (!m.text) return m.reply('Masukan URL yang ingin di perpendek.')
if (!/^https?:\/\//.test(m.text)) return m.reply(global.mess.error.url);
mecha.sendReact(m.chat, '🕒', m.key)
await func.fetchText(BASE_URL + '?url=' + m.text)
.then(res => m.reply(`URL Short: ${res}\nURL awal: ${m.text}`))
.catch(err => m.reply('Sorry Failed to shorting url because this server has not could'));
return !0
}
let jid = m.sender
database[jid] = Date.now()
m.reply('Kirim URL yang ingin di perpendek...')
return !0
},
main: async (m, { func, mecha }) => {
let jid = m.sender
if (jid in database && (Date.now() - database[jid]) < 3600000) {
if (!/^https?:\/\//.test(m.budy)) return m.reply(global.mess.error.url);
mecha.sendReact(m.chat, '🕒', m.key)
await func.fetchText(BASE_URL + '?url=' + m.budy).then(res => {
m.reply(`URL Short: ${res}\nURL awal: ${m.budy}`)
delete database[jid];
}).catch(err => {
m.reply('Sorry Failed to shorting url because this server has not could')
delete database[jid];
});
}
},
limit: true
}