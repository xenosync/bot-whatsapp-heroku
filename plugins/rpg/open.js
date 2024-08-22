exports.run = {
usage: ['open'],
hidden: ['buka'],
use: '[crate] [count]',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let type = (m.args[0] || '').toLowerCase()
let total = Math.floor(func.isNumber(m.args[1]) ? Math.min(Math.max(parseInt(m.args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if (user[type] < total) return m.reply(`Kamu tidak memiliki *${type} crate*.`)
if (user[type] < total) return m.reply(`Kamu hanya memiliki ${user[type]} ${type} crate* untuk dibuka.`)
if (total > 100) total = 100
if (func.somematch(['common', 'uncommon', 'mythic', 'legendary','petbox'], type)) {
if (type == 'common') {
let common = 0
let uncommon = 0
const money= func.randomNomor(2000, 5000)
const exp  = func.randomNomor(175, 225)
const trash= func.randomNomor(10, 30)
const potion   = func.randomNomor(1, 3)

user.money += money * total
user.exp += exp * total
user.trash += trash * total
user.potion += potion * total
for (let x = 1; x <= total; x++) {
user.commoncount += 1
if (user.commoncount % 10 == 0) {
user.common += 1
common += 1
}
if (user.commoncount % 20 == 0) {
user.uncommon += 1
uncommon += 1
}
}
user.common -= total

let txt = `Kamu membuka *${total} ${type} crate* dan mendapatkan :\n`
txt += `${money * total} money\n`
txt += `${exp * total} exp\n`
txt += `${trash * total} trash\n`
txt += `${potion * total} potion`
if (common != 0) txt += `\nBonus : common')} *${common} common*`
if (uncommon != 0) txt += `\nBonus : uncommon')} *${uncommon} uncommon*`
m.reply(txt)
} else if (type == 'uncommon') {
let uncommon = 0
let mythic = 0
const money= func.randomNomor(2000, 5000)
const exp  = func.randomNomor(275, 325)
const trash= func.randomNomor(10, 30)
const potion   = func.randomNomor(1, 3)
const wood = func.randomNomor(1, 3)
const rock = func.randomNomor(1, 3)
const string   = func.randomNomor(1, 3)

user.money  += money * total
user.exp+= exp * total
user.trash  += trash * total
user.potion += potion * total
user.wood   += wood * total
user.rock   += rock * total
user.string += string * total
for (let x = 1; x <= total; x++) {
user.uncommoncount += 1
if (user.uncommoncount % 10 == 0) {
user.uncommon += 1
uncommon += 1
}
if (user.uncommoncount % 20 == 0) {
user.mythic += 1
mythic += 1
}
}
user.uncommon -= total

let txt = `Kamu membuka *${total} ${type} crate* dan mendapatkan :\n`
txt += `${money * total} money\n`
txt += `${exp * total} exp\n`
txt += `${trash * total} trash\n`
txt += `${potion * total} potion\n`
txt += `${wood * total} wood\n`
txt += `${rock * total} rock\n`
txt += `${string * total} string`
if (uncommon != 0) txt += `\nBonus : uncommon')} *${uncommon} uncommon*`
if (mythic != 0) txt += `\nBonus : mythic')} *${mythic} mythic*`
m.reply(txt)
} else if (type == 'mythic') {
let mythic = 0
let legendary = 0
const money= func.randomNomor(2000, 5000)
const exp  = func.randomNomor(300, 400)
const trash= func.randomNomor(10, 30)
const potion   = func.randomNomor(1, 3)
const wood = func.randomNomor(1, 3)
const rock = func.randomNomor(1, 3)
const string   = func.randomNomor(1, 3)
const steel= func.randomNomor(1, 3)

user.money  += money * total
user.exp+= exp * total
user.trash  += trash * total
user.potion += potion * total
user.wood   += wood * total
user.rock   += rock * total
user.string += string * total
user.steel += steel * total
for (let x = 1; x <= total; x++) {
user.mythiccount += 1
if (user.mythiccount % 10 == 0) {
user.mythic += 1
mythic += 1
}
if (user.mythiccount % 20 == 0) {
user.legendary += 1
legendary += 1
}
}
user.mythic -= total

let txt = `Kamu membuka *${total} ${type} crate* dan mendapatkan :\n`
txt += `${money * total} money\n`
txt += `${exp * total} exp\n`
txt += `${trash * total} trash\n`
txt += `${potion * total} potion\n`
txt += `${wood * total} wood\n`
txt += `${rock * total} rock\n`
txt += `${string * total} string\n`
txt += `${steel * total} steel`
if (mythic != 0) txt += `\nBonus : mythic')} *${mythic} mythic*`
if (legendary != 0) txt += `\nBonus : legendary')} *${legendary} legendary*`
m.reply(txt)
} else if (type == 'legendary') {
let legendary = 0
let pet = 0
const money= func.randomNomor(15000, 20000)
const exp  = func.randomNomor(375, 475)
const trash= func.randomNomor(10, 30)
const potion   = func.randomNomor(1, 3)
const wood = func.randomNomor(1, 3)
const rock = func.randomNomor(1, 3)
const string   = func.randomNomor(1, 3)
const steel= func.randomNomor(1, 3)

user.money  += money * total
user.exp+= exp * total
user.trash  += trash * total
user.potion += potion * total
user.wood   += wood * total
user.rock   += rock * total
user.string += string * total
user.steel += steel * total
for (let x = 1; x <= total; x++) {
user.legendarycount += 1
if (user.legendarycount % 10 == 0) {
user.legendary += 1
legendary += 1
}
if (user.legendarycount % 20 == 0) {
user.pet += 1
pet += 1
}
}
user.legendary -= total

let txt = `Kamu membuka *${total} ${type} crate* dan mendapatkan :\n`
txt += `${money * total} money\n`
txt += `${exp * total} exp\n`
txt += `${trash * total} trash\n`
txt += `${potion * total} potion\n`
txt += `${wood * total} wood\n`
txt += `${rock * total} rock\n`
txt += `${string * total} string\n`
txt += `${steel * total} rock`
if (legendary != 0) txt += `\nBonus : legendary')} *${legendary} legendary*`
if (pet != 0) txt += `\nBonus : pet')} *${pet} petbox*`
m.reply(txt)
} else {
m.reply(`Comming soon :\n*${m.prefix}pet*\n*${m.prefix}petbattle*`)
}
} else {
let nice = `common\n`
nice += `uncommon\n`
nice += `mythic\n`
nice += `legendary\n`
nice += `petbox`
m.reply(`Use Format *${m.cmd} [crate] [count]*\nUsage example: *${m.cmd} common 10*\n\nCRATE LIST :\n${nice}`)
}
},
register: true
}