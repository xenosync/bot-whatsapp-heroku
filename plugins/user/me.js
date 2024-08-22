const fetch = require('node-fetch');

exports.run = {
usage: ['me'],
category: 'user',
async: async (m, { func, mecha, setting }) => {
if (typeof global.db.users[global.db.users[m.sender].pasangan.id] == 'undefined') global.db.users[m.sender].pasangan.id = ''
let { name, gender, age, limit, balance, premium, banned, jadibot, warning, register, date, pasangan, expired, level, exp, role } = global.db.users[m.sender]
let pacar = `Berpacaran dengan @${pasangan.id.split('@')[0]}`
let pacarnya = pasangan.id ? (global.db.users[pasangan.id].pasangan.id ? pacar : 'Sedang digantung @' + pasangan.id.split('@')[0]) : 'Jomblo'
let about = (await mecha.fetchStatus(m.sender).catch(_ => {}) || {}).status || ''
let listblock = await mecha.fetchBlocklist().catch((_) => []);
let caption = `乂  *U S E R - P R O F I L E*

◦ *Name* : ${name ? name : m.pushname}
◦ *Gender* : ${gender ? gender : '-'}
◦ *Age* : ${age ? age : '-'}
◦ *Limit* : ${premium ? 'Unlimited' : limit}
◦ *Balance* : ${func.formatNumber(balance)}
◦ *Level* : ${level}
◦ *Exp* : ${exp} / ${10 * Math.pow(level, 2) + 50 * level + 100}
◦ *Role* : ${role}
◦ *Status* : ${pacarnya}
◦ *About* : ${about ? about : '-'}

乂  *U S E R - S T A T U S*

◦ *Warning* : ${warning} / 3
◦ *Blocked* : ${listblock.includes(m.sender) ? 'Yes' : 'No'}
◦ *Banned* : ${banned ? 'Yes (' + (expired.banned == 'PERMANENT' ? 'PERMANENT' : func.timeReverse(expired.banned)) + ')' : 'No'}
◦ *Premium* : ${premium ? 'Yes (' + (expired.premium == 'PERMANENT' ? 'PERMANENT' : func.timeReverse(expired.premium)) + ')' : 'No'}
◦ *Jadibot* : ${jadibot ? 'Yes (' + (expired.jadibot == 'PERMANENT' ? 'PERMANENT' : func.timeReverse(expired.jadibot)) + ')' : 'No'}
◦ *Register* : ${register ? 'Yes (' + date + ')' : 'No'}`
await (setting.fakereply ? mecha.sendMessageModify(m.chat, caption, m, {
largeThumb: true, 
thumbnail: await (await fetch(await mecha.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/0d25a520bfa0909c74466.jpg'))).buffer(),
expiration: m.expiration
}) : m.reply(caption))
}
}