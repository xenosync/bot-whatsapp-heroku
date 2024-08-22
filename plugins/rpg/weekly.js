const rewards = {
exp: 35000,
money: 27000,
potion: 7,
wood: 4,
rock: 4,
string: 3,
iron: 3,
sand: 5,
bibitmangga: 150,
bibitapel: 150,
bibitpisang: 150,
bibitjeruk: 150,
bibitanggur: 150,
}

const cooldown = 604800000

exports.run = {
usage: ['weekly'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (new Date - user.lastweekly < cooldown) return m.reply(`You have already claimed this weekly claim!, wait for *${((user.lastweekly + cooldown) - new Date()).toTimeString()}*`)
let txt = ''
for (let reward of Object.keys(rewards)) {
if (!(reward in user)) continue
user[reward] += rewards[reward]
txt += `*+${rewards[reward]}* ${reward}\n`
}
m.reply(txt.trim())
user.lastweekly = new Date * 1
},
register: true
}