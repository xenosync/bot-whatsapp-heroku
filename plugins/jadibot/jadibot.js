const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const moment = require('moment-timezone');
const chalk = require('chalk');
const { Jadibot, StopJadibot } = new (require('../../system/jadibot.js'));

exports.run = {
usage: ['jadibot', 'stopbot'],
category: 'jadibot',
async: async (m, { func, mecha, plugins, users }) => {
switch (m.command) {
case 'jadibot':
if (!users.jadibot) return m.reply(global.mess.jadibot)
let [value, notify] = m.args;
let settings = global.db.jadibot.find(v => v.number === m.sender)
if (!settings) global.db.jadibot.push({
number: m.sender,
name: m.pushname,
date: moment.tz('Asia/Jakarta').format('DD MMMM YYYY'),
session: '',
notify: true,
status: false
})
if (m.text && func.somematch(['on', 'off'], (value || '').toLowerCase()) && settings) {
let option = (value || '').toLowerCase();
let statuses = option === 'on' ? true : false;
if (settings.status == statuses) return m.reply(`Jadibot has been ${option == 'on' ? 'activated' : 'inactivated'} previously.`)
settings.status = statuses;
return m.reply(`Jadibot has been ${option == 'on' ? 'activated' : 'inactivated'} successfully.`)
}
if (m.text && (value || '') === 'notify' && func.somematch(['on', 'off'], (notify || '').toLowerCase()) && settings) {
let option = (notify || '').toLowerCase();
let statuses = option === 'on' ? true : false;
if (settings.notify == statuses) return m.reply(`Jadibot notify has been ${option == 'on' ? 'activated' : 'inactivated'} previously.`)
settings.notify = statuses;
return m.reply(`Jadibot notify has been ${option == 'on' ? 'activated' : 'inactivated'} successfully.`)
}
const bot = (global.pairing.number || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net'
if (m.user.jadibot) return m.reply(`Tidak dapat menggunakan jadibot disini!\n\nklik wa.me/${bot.split('@')[0]}?text=` + global.db.setting[bot].prefix + 'jadibot')
if (typeof global.jadibot[m.sender] != 'undefined') return m.reply(`Kamu sudah menjadi bot sebelumnya!\nIngin menghapus sesi? ketik *${m.prefix}delsesibot*`)
if (Object.keys(global.jadibot).length !== 0){
const array = Object.values(global.jadibot).filter(x => x.user)
if (array.length != 0){
const userbot = array.map(v => jidNormalizedUser(v.user.id))
const find = userbot.find(x => x.includes(m.sender))
if (find) return mecha.reply(m.chat, `Kamu sudah menjadi bot sebelumnya!\nIngin menghapus sesi? ketik *${m.prefix}delsesibot*`, m)
}
}
if (Object.keys(global.jadibot).length >= 5) return m.reply('User jadibot sudah mencapai maksimal 2')
mecha.sendReact(m.chat, '🕒', m.key)
await Jadibot({
mecha: mecha,
number: m.sender,
state: global.pairing && global.pairing.status
})
break
case 'stopbot':
if (!users.jadibot) return m.reply(global.mess.jadibot)
if (Object.keys(global.jadibot).length == 0) return m.reply('Tidak ada bot sementara yang aktif saat ini')
await StopJadibot({
mecha: mecha,
number: m.sender
})
break
}
},
private: true
}