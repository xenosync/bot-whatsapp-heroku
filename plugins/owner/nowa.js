const moment = require('moment-timezone')

exports.run = {
usage: ['nowa'],
use: 'number wa',
category: 'owner',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, '6285700408187x'))
if (!m.text.includes('x')) return m.reply(`Masukkan tanda x di belakang nomor.\nContoh: ${m.prefix + m.command} 6285700408187x`)
m.reply(global.mess.wait)
function countInstances(string, word) {
return string.split(word).length - 1;
}
var nomer0 = m.text.split('x')[0]
var nomer1 = m.text.split('x')[countInstances(m.text, 'x')] ? m.text.split('x')[countInstances(m.text, 'x')] : ''
var random_length = countInstances(m.text, 'x')
var random;
if (random_length == 1) {
random = 10
} else if (random_length == 2) {
random = 100
} else if (random_length == 3) {
random = 1000
}
var nomerny = 'LIST NOMOR WHATSAPP\n\nPunya Bio/status/info'
var no_bio = '\n\nTanpa Bio/status/info'
var no_watsap = '\n\nTidak Terdaftar'
for (let i = 0; i < random; i++) {
var nu = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
var dom1 = nu[Math.floor(Math.random() * nu.length)]
var dom2 = nu[Math.floor(Math.random() * nu.length)]
var dom3 = nu[Math.floor(Math.random() * nu.length)]
var dom4 = nu[Math.floor(Math.random() * nu.length)]
var rndm;
if (random_length == 1) {
rndm = `${dom1}`
} else if (random_length == 2) {
rndm = `${dom1}${dom2}`
} else if (random_length == 3) {
rndm = `${dom1}${dom2}${dom3}`
} else if (random_length == 4) {
rndm = `${dom1}${dom2}${dom3}${dom4}`
}
var xanu = await mecha.onWhatsApp(`${nomer0}${i}${nomer1}@s.whatsapp.net`);
var xanuu = xanu.length !== 0 ? xanu : false
try {
try {
var xanu1 = await mecha.fetchStatus(xanu[0].jid)
} catch {
var xanu1 = '401'
}
if (xanu1 == '401' || xanu1.status.length == 0) {
no_bio += `\nwa.me/${xanu[0].jid.split('@')[0]}`
} else {
nomerny += `\nwa.me/${xanu[0].jid.split('@')[0]}\nBiography : ${xanu1.status}\nDate : ${moment(xanu1.setAt).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}`
}
} catch {
no_watsap += `\n${nomer0}${i}${nomer1}`
}
}
m.reply(`${nomerny}${no_bio}${no_watsap}`)
},
owner: true
}