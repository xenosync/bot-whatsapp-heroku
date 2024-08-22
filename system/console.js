/*
* Nama Pengembang: Jabal Surya
* Kontak Whatsapp: wa.me/62895415497664
* Kontak Telegram: t.me/surya_skylark
* Akun Instagram: surya_skylark05
* Catatan: tolong laporkan kepada saya jika anda menemukan ada yang menjual script ini tanpa seizin saya.
*/

const { green, greenBright, cyanBright, redBright } = require('chalk');
const fs = require('fs');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id');
const func = require('./functions.js');

module.exports = async (mecha, m, setting, msg) => {
let who = m.fromMe ? 'Bot' : m.pushname || 'No Name'
let time = m.messageTimestamp
if (!m.budy) return;
if (!setting.online) await mecha.sendPresenceUpdate('unavailable', m.chat)
if (setting.online) {
await mecha.sendPresenceUpdate('available', m.chat)
await mecha.readMessages([m.key])
}
if (m.isGc) {
try {
let subject = m.groupName;
var groupName = cyanBright.bold(subject);
if (global.db.groups[m.chat].name !== subject) global.db.groups[m.chat].name = subject;
} catch {
var groupName = redBright.bold('Timed Out')
}
if (m.isPrefix) return console.log('\n' + greenBright.bold('[ CMD ]'), moment(time * 1000).format('DD/MM/YY HH:mm:ss'), green.bold('from'), func.color('[' + m.sender.split('@')[0] + '] ', 'orange') + cyanBright.bold(who), green.bold('in'), func.color('[' + m.chat + '] ', 'orange') + groupName, `\n${m.budy}`)
if (msg) console.log('\n' + greenBright.bold('[ MSG ]'), moment(time * 1000).format('DD/MM/YY HH:mm:ss'), green.bold('from'), func.color('[' + m.sender.split('@')[0] + '] ', 'orange') + cyanBright.bold(who), green.bold('in'), func.color('[' + m.chat + '] ', 'orange') + groupName, `\n${m.budy}`)
} else {
if (m.isPrefix) return console.log('\n' + greenBright.bold('[ CMD ]'), moment(time * 1000).format('DD/MM/YY HH:mm:ss'), green.bold('from'), func.color('[' + m.sender.split('@')[0] + '] ', 'orange') + cyanBright.bold(who), green.bold('in'), func.color('[' + m.chat + ']', 'orange'), `\n${m.budy}`)
if (msg) console.log('\n' + greenBright.bold('[ MSG ]'), moment(time * 1000).format('DD/MM/YY HH:mm:ss'), green.bold('from'), '[' + m.sender.split('@')[0] + '] ' + cyanBright.bold(who), green.bold('in'), func.color('[' + m.chat + ']', 'orange'), `\n${m.budy}`)
}
}

func.reloadFile(__filename)