exports.run = {
usage: ['deljadibot'],
hidden: ['delbot'],
use: 'mention or reply',
category: 'owner',
async: async (m, { func, mecha, froms }) => {
if (m.quoted || m.text) {
if (!froms) return m.reply('Invalid number.')
let users = global.db.users[froms]
if (typeof users == 'undefined') return m.reply('User data not found.')
if (!users.jadibot) return m.reply('Not a jadibot account.')
users.jadibot = false
users.expired.jadibot = 0
m.reply(`@${froms.replace(/@.+/, '')}'s jadibot status has been successfully deleted.`)
} else m.reply('Mention or Reply chat target.')
},
owner: true
}