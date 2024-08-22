let database = {};

exports.run = {
usage: ['judi'],
hidden: ['bet'],
use: 'jumlah',
category: 'rpg',
async: async (m, { func, mecha }) => {
if (m.sender in database) return m.reply('Kamu masih melakukan judi, tunggu sampai selesai.')
try {
let user = global.db.users[m.sender]
let count = (m.args[0] && isNumber(parseInt(m.args[0])) ? Math.max(parseInt(m.args[0]), 1) : /all/i.test(m.args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
if (user.money < 100000) return m.reply(`Dasar gak modal, minimal judi bawa 100000 Money`)
if (user.money < count) return m.reply(`Lu gak punya Money segitu!`)
if (!(m.sender in database)) {
database[m.sender] = {
sender: m.sender,
count,
timeout: setTimeout(() => (m.reply('Waktu habis.'), delete database[m.sender]), 60000)
}
let txt = 'Apakah anda yakin ingin melakukan judi?\nKetik *(Y/N)* (60s Timeout)'
return mecha.reply(m.chat, txt, m)
}
} catch (e) {
console.error(e)
if (m.sender in database) {
let { timeout } = database[m.sender]
clearTimeout(timeout)
delete database[m.sender]
m.reply('Rejected')
}
}
},
main: async (m, { func, mecha }) => {
if (!(m.sender in database)) return
if (m.isBot) return
let { timeout, count } = database[m.sender]
let user = global.db.users[m.sender]
let moneyDulu = user.money * 1
let txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.body ? m.body : '').toLowerCase()
try {
if (/^y(es|a)?$/i.test(txt)) {
let Bot = (Math.ceil(Math.random() * 91)) * 1
let Kamu = (Math.floor(Math.random() * 71)) * 1
let status = 'Kalah'
if (Bot < Kamu) {
user.money += count * 1
status = 'Menang'
} else if (Bot > Kamu) {
user.money -= count * 1
} else {
status = 'Seri'
user.money += (Math.floor(count / 1.5)) * 1
}
let caption = `
Bot roll: *${Bot}*
Kamu roll: *${Kamu}*

Kamu *${status}*, kamu ${status == 'Menang' ? 'Mendapatkan *+' + (count * 2) + '*' : status == 'Kalah' ? 'Kehilangan *-' + (count * 1) + '*' : 'Mendapatkan *+' + Math.floor(count / 1.5) + '*'} 💵Money
`.trim()
mecha.reply(m.chat, caption, m)
clearTimeout(timeout)
delete database[m.sender]
return !0
} else if (/^no?$/i.test(txt)) {
clearTimeout(timeout)
delete database[m.sender]
m.reply('Rejected')
return !0
}

} catch (e) {
clearTimeout(timeout)
delete database[m.sender]
if (moneyDulu > (user.money * 1)) user.money = moneyDulu * 1
m.reply('Error saat melakukan judi (Rejected)')
return !0
} finally {
clearTimeout(timeout)
delete database[m.sender]
return !0
}
},
group: true,
register: true,
limit: true
}

/**
 * Detect if thats isNumber
 * @param {Number} x 
 * @returns Boolean
 */
function isNumber(x = 0) {
x = parseInt(x)
return !isNaN(x) && typeof x == 'number'
}