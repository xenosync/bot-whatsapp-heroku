const rewards = {
limit: 10,
balance: 10000,
exp: 12000,
money: 10000,
potion: 5,
}
const cooldown = 86400000

exports.run = {
usage: ['daily'],
hidden: ['claim'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (new Date - user.lastclaim < cooldown) return m.reply(`You have already claimed this daily claim!, wait for *${func.clockString((user.lastclaim + cooldown) - new Date())}*`)
let text = ''
for (let reward of Object.keys(rewards)) {
if (!(reward in user)) continue
user[reward] += rewards[reward]
text += `*+${rewards[reward]}* ${reward}\n`
}
m.reply(text.trim())
user.lastclaim = new Date * 1
},
register: true
}