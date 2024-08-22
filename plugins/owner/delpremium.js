exports.run = {
usage: ['delpremium'],
hidden: ['delprem'],
use: 'mention or reply',
category: 'owner',
async: async (m, { func, mecha, froms, setting }) => {
if (m.quoted || m.text) {
if (!froms) return m.reply('Invalid number.')
let users = global.db.users[froms]
if (typeof users == 'undefined') return m.reply('User data not found.')
if (!users.premium) return m.reply('Not a premium account.')
users.premium = false;
users.limit = setting.limit.free;
users.expired.premium = 0;
m.reply(`@${froms.replace(/@.+/, '')}'s premium status has been successfully deleted.`)
} else m.reply('Mention or Reply chat target.')
},
devs: true
}