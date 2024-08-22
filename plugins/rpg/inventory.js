const daily = 86400000;
const weekly = 604800000;
const monthly = 2592000000;
const adventure = 900000;

const inventory = {
others: {
health: true,
money: true,
exp: true,
},
items: {
potion: true,
aqua: true,
petfood: true,
wood: true,
rock: true,
string: true,
iron: true,
trash: true,
botol: true,
kaleng: true,
kardus: true,
emerald: true,
diamond: true,
gold: true,
},
builds: {
rumahsakit: true,
restoran: true,
pabrik: true,
tambang: true,
pelabuhan: true,
},
crates: {
common: true,
uncommon: true,
mythic: true,
legendary: true,
},
pets: {
horse: true,
cat: true,
fox: true,
dog: true,
wolf: true,
centaur: true,
phoenix: true,
dragon: true,
},
cooks: {
steak: true,
sate: true,
rendang: true,
kornet: true,
nugget: true,
bluefin: true,
seafood: true,
sushi: true,
moluska: true,
squidprawm: true,
},
fruits: {
mangga: true,
apel: true,
pisang: true,
jeruk: true,
},
cooldowns: {
lastclaim: {
name: 'claim',
time: daily.cooldown
},
lastweekly: {
name: 'weekly',
time: weekly.cooldown
},
lastmonthly: {
name: 'monthly',
time: monthly.cooldown
},
lastadventure: {
name: 'adventure',
time: adventure.cooldown
}
}
}

exports.run = {
usage: ['inventory'],
hidden: ['inv'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
const others = Object.keys(inventory.others).map(v => user[v] && `${func.ucword(v)} : ${user[v]}`).filter(v => v).join('\n').trim()
const items = Object.keys(inventory.items).map(v => user[v] && `${func.ucword(v)} : ${user[v]}`).filter(v => v).join('\n').trim()
const builds = Object.keys(inventory.builds).map(v => user[v] && `${func.ucword(v)} : ${user[v]} ( level ${user[v + 'lvl']} )`).filter(v => v).join('\n').trim()
const crates = Object.keys(inventory.crates).map(v => user[v] && `${func.ucword(v)} : ${user[v]}`).filter(v => v).join('\n').trim()
const pets = Object.keys(inventory.pets).map(v => user[v] && `${func.ucword(v)} : ${user[v]} ( level ${user[v + 'lvl']} )`).filter(v => v).join('\n').trim()
const cooks = Object.keys(inventory.cooks).map(v => user[v] && `${func.ucword(v)} : ${user[v]}`).filter(v => v).join('\n').trim()
const fruits = Object.keys(inventory.fruits).map(v => user[v] && `${func.ucword(v)} : ${user[v]}`).filter(v => v).join('\n').trim()
const cooldowns = Object.entries(inventory.cooldowns).map(([cd, { name, time }]) => cd in user && (func.ucword(name) + ' : ' + (new Date() - user[cd] >= time ? '✅' : '❌'))).filter(v => v).join('\n').trim()
const caption = `Inventory *${mecha.getName(m.sender)}*

${Object.keys(inventory.others).map(v => user[v] && `${func.ucword(v)} : ${user[v]}`).filter(v => v).join('\n')}${items ? `

*I T E M S*
${items}
*Total Items :* ${Object.keys(inventory.items).map(v => user[v]).reduce((a, b) => a + b, 0)} Items${func.readmore}` : ''}${builds ? `

*B U I L D I N G*
${builds}
*Total Buldings :* ${Object.keys(inventory.builds).map(v => user[v]).reduce((a, b) => a + b, 0)} Buildings` : ''}${crates ? `

*C R A T E S*
${crates}
*Total Crates :* ${Object.keys(inventory.crates).map(v => user[v]).reduce((a, b) => a + b, 0)} Boxs` : ''}${pets ? `

*P E T S*
${pets}
*Total Pets :* ${Object.keys(inventory.pets).map(v => user[v]).reduce((a, b) => a + b, 0)} Pets` : ''}${cooks ? `

*F O O D S*
${cooks}
*Total Foods :* ${Object.keys(inventory.cooks).map(v => user[v]).reduce((a, b) => a + b, 0)} Dish` : ''}${fruits ? `

*F R U I T S*
${fruits}
*Total Fruits :* ${Object.keys(inventory.fruits).map(v => user[v]).reduce((a, b) => a + b, 0)} Fruits` : ''}${cooldowns ? `

*C O O L D O W N S*
${cooldowns}` : ''}
`.trim()
mecha.reply(m.chat, caption, m)
},
register: true
}