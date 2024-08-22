const rewards = {
exp: 75000,
money: 100000,
potion: 12,
wood: 12,
rock: 12,
string: 9,
iron: 9,
sand: 15,
}

const cooldown = 2592000000

exports.run = {
usage: ['monthly'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (new Date - user.lastmonthly < cooldown) return m.reply(`You have already claimed this monthly claim, wait for *${((user.lastmonthly + cooldown) - new Date()).toTimeString()}*`)
let txt = ''
for (let reward of Object.keys(rewards)) if (reward in user) {
user[reward] += rewards[reward]
txt += `*+${rewards[reward]}* ${reward}\n`
}
mecha.reply(m.chat, txt, m)
user.lastmonthly = new Date * 1
},
register: true
}