const toMs = require('ms');

exports.run = {
usage: ['unbanned'],
hidden: ['unban'],
use: 'mention or reply',
category: 'owner',
async: async (m, { func, mecha, froms }) => {
if (m.quoted || m.text) {
if (!froms) return m.reply('Invalid number.')
let user = global.db.users[froms]
if (typeof user == 'undefined') return mecha.reply(m.chat, func.texted('bold', 'User data not found.'), m)
if (!user.banned) return m.reply('Target not banned.')
user.banned = false
user.expired.banned = 0
m.reply(`Succesfully removing *${user.name}* from banned list.`)
} else m.reply('Mention or Reply chat target.')
},
devs: true
}