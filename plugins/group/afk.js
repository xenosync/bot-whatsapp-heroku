exports.run = {
usage: ['afk'],
category: 'group',
async: async (m, { func, mecha, users }) => {
users.afk = + new Date;
users.alasan = m.text ? m.text : '';
users.afkObj = {
key: m.key,
message: m.message
}
return mecha.reply(m.chat, `${m.pushname} sedang AFK${m.text ? '\nAlasan: ' + m.text : ''}`, m, {expiration: m.expiration})
},
group: true
}