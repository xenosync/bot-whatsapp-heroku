exports.run = {
usage: ['heal'],
use: 'count',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (user.health >= 100) return m.reply('Your ❤️health is full.')
const heal = 40 + (user.cat * 4)
let count = Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, (func.isNumber(m.args[0]) && parseInt(m.args[0]) || Math.round((100 - user.health) / heal)))) * 1
if (user.potion < count) return m.reply(`Potionmu tidak cukup, kamu hanya punya *${user.potion}* potion.\nKirim *${m.prefix}buy potion ${count - user.potion}* untuk membeli potion.`)
user.potion -= count * 1
user.health += heal * count
m.reply(`Successful use of *${count}* Potion.`)
},
register: true
}