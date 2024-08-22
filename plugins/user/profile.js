const fetch = require('node-fetch');

exports.run = {
usage: ['profile'],
hidden: ['profil'],
use: 'mention or reply',
category: 'user',
async: async (m, { func, mecha, froms, setting }) => {
let number = isNaN(m.text) ? (m.text.startsWith('+') ? m.text.replace(/[()+\s-]/g, '') : m.text.split('@')[1]) : m.text
if (!m.text && !m.quoted) return m.reply('Mention or Reply chat target.')
if (isNaN(number)) return m.reply('Invalid number.')
if (number.length > 15) return m.reply('Invalid format.')
if (global.db.users[froms] == undefined) return m.reply('User data not found.')
if (global.db.users[global.db.users[froms].pasangan.id] == undefined) global.db.users[froms].pasangan.id = ''
let { name, gender, age, limit, balance, premium, banned, jadibot, warning, register, date, pasangan, expired, level, exp, role } = global.db.users[froms]
let pacar = `Berpacaran dengan @${pasangan.id.split('@')[0]}`
let pacarnya = pasangan.id ? (global.db.users[pasangan.id].pasangan.id ? pacar : 'Sedang digantung @' + pasangan.id.split('@')[0]) : 'Jomblo'
let about = (await mecha.fetchStatus(froms).catch(_ => {}) || {}).status || ''
let listblock = await mecha.fetchBlocklist().catch((_) => []);
let caption = `乂  *U S E R - P R O F I L E*

◦ *Name* : ${name ? name : '-'}
◦ *Gender* : ${gender ? gender : '-'}
◦ *Age* : ${age ? age : '-'}
◦ *Limit* : ${limit}
◦ *Balance* : ${func.formatNumber(balance)}
◦ *Level* : ${level}
◦ *Exp* : ${exp} / ${10 * Math.pow(level, 2) + 50 * level + 100}
◦ *Role* : ${role}
◦ *Status* : ${pacarnya}
◦ *About* : ${about ? about : '-'}

乂  *U S E R - S T A T U S*

◦ *Warning* : ${warning} / 3
◦ *Blocked* : ${listblock.includes(froms) ? 'Yes' : 'No'}
◦ *Banned* : ${banned ? 'Yes (' + (expired.banned == 'PERMANENT' ? 'PERMANENT' : func.timeReverse(expired.banned)) + ')' : 'No'}
◦ *Premium* : ${premium ? 'Yes (' + (expired.premium == 'PERMANENT' ? 'PERMANENT' : func.timeReverse(expired.premium)) + ')' : 'No'}
◦ *Jadibot* : ${jadibot ? 'Yes (' + (expired.jadibot == 'PERMANENT' ? 'PERMANENT' : func.timeReverse(expired.jadibot)) + ')' : 'No'}
◦ *Register* : ${register ? 'Yes (' + date + ')': 'No'}`
await (setting.fakereply ? mecha.sendMessageModify(m.chat, caption, m, {
largeThumb: true, 
thumbnail: await (await fetch(await mecha.profilePictureUrl(froms, 'image').catch(_ => 'https://telegra.ph/file/0d25a520bfa0909c74466.jpg'))).buffer(),
expiration: m.expiration
}) : m.reply(caption))
},
group: true
}