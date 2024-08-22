const toMs = require('ms');

exports.run = {
usage: ['banned'],
hidden: ['ban'],
use: 'mention or reply',
category: 'owner',
async: async (m, { func, mecha, froms, setting }) => {
const [text1, text2] = m.text.split('|');
if (m.quoted) {
let user = global.db.users[m.quoted.sender]
let expire = m.text ? Date.now() + toMs(m.text) : 'PERMANENT'
if (typeof user == 'undefined') return m.reply('User data not found.')
if (user.banned) return m.reply('Target already banned.')
user.banned = true;
user.expired.banned = expire;
m.reply(`Successfully added @${m.quoted.sender.replace(/@.+/, '')} to banned user`)
} else if (m.text) {
if (!text1) return m.reply(`Contoh : ${comand} 62895415497664|30d`)
let number = isNaN(text1) ? (text1.startsWith('+') ? text1.replace(/[()+\s-]/g, '') : (text1).split('@')[1]) : text1
if (isNaN(number)) return m.reply('Invalid number.')
if (number.length > 15) return m.reply('Invalid format.')
let ban = text1.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
let user = global.db.users[ban]
let expire = text2 ? Date.now() + toMs(text2) : 'PERMANENT'
if (typeof user == 'undefined') return m.reply('User data not found.')
if (user.banned) return m.reply('Target already banned.')
user.banned = true;
user.expired.banned = expire;
m.reply(`Successfully added *${user.name}* into banned list.`)
} else m.reply('Mention or Reply chat target.')
},
devs: true
}