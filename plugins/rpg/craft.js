exports.run = {
usage: ['craft'],
hidden: ['crafting'],
use: 'options',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let txt = `乂  *C R A F T I NG - L I S T*

◦ %steel%
◦ %kargo%
◦ %kapal%
◦ %armor%
◦ %sword%
◦ %pickaxe%
◦ %fishingrod%
◦ %bow%

Format: *${m.cmd} [item] [jumlah]*
Contoh: *${m.cmd} armor 2*`

const item = (m.args[0] || '').toLowerCase()
const total = Math.floor(isNumber(m.args[1]) ? Math.min(Math.max(parseInt(m.args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if (item == 'bow' || item == 'panah') {
if (user.bow == 0) {
if (user.wood < 29 || user.string < 3 || user.iron < 1) return m.reply(`Diperlukan 29 wood, 3 string, 1 iron.\n\nAnda memiliki :\n- ${user.wood} wood\n- ${user.string} string\n- ${user.iron} iron`)
user.wood -= 29
user.string -= 3
user.iron -= 1
user.bow += 1
user.bowdurability += 250
user.craftcount += 1
m.reply(`Craft *1 🏹 Bow* Berhasil.\n\nDurability : ${user.bowdurability}`)
} else {
m.reply(`Anda sudah memiliki 🏹 Bow\n\nDurability : ${user.bowdurability}`)
}
} else if (item == 'pancing' || item == 'fishingrod') {
if (user.fishingrod == 0) {
if (user.iron < 10 || user.string < 4) return m.reply(`Diperlukan 10 iron, 4 string.\n\nAnda memiliki :\n- ${user.iron} iron\n- ${user.string} string`)
user.iron -= 10
user.string -= 4
user.fishingrod += 1
user.fishingroddurability += 250
user.craftcount += 1
m.reply(`Craft *1 🎣 Fishingrod* Berhasil.\n\nDurability : ${user.fishingroddurability}`)
} else {
m.reply(`Anda sudah memiliki 🎣 Fishingrod\n\nDurability : ${user.fishingroddurability}`)
}
} else if (item == 'kapak' || item == 'pickaxe') {
if (user.pickaxe == 0) {
if (user.iron < 12 || user.wood < 12) return m.reply(`Diperlukan 12 iron, 12 wood.\n\nAnda memiliki :\n- ${user.iron} iron\n- ${user.wood} wood`)
user.iron -= 12
user.wood -= 12
user.pickaxe += 1
user.pickaxedurability += 250
user.craftcount += 1
m.reply(`Craft *1 ⛏️ pickaxe* Berhasil.\n\nDurability : ${user.pickaxedurability}`)
} else {
m.reply(`Anda sudah memiliki ⛏️ pickaxe\n\nDurability : ${user.pickaxedurability}`)
}
} else if (item == 'pedang' || item == 'sword') {
if (user.sword == 0) {
if (user.iron < 11 || user.steel < 4) return m.reply(`Diperlukan 11 iron, 4 steel.\n\nAnda memiliki :\n- ${user.iron} iron\n- ${user.steel} steel`)
user.iron -= 11
user.steel -= 4
user.sword += 1
user.sworddurability += 250
user.craftcount += 1
m.reply(`Craft *1 ⚔️ sword* Berhasil.\n\nDurability : ${user.sworddurability}`)
} else {
m.reply(`Anda sudah memiliki ⚔️ sword\n\nDurability : ${user.sworddurability}`)
}
} else if (item == 'armor') {
if (user.armor == 0) {
if (user.steel < 2 || user.string < 4 || user.iron < 6) return m.reply(`Diperlukan 2 steel, 4 string, 6 iron.\n\nAnda memiliki :\n- ${user.steel} steel\n- ${user.string} string\n- ${user.iron} iron`)
user.steel -= 2
user.string -= 4
user.iron -= 6
user.armor += 1
user.armordurability += 250
user.craftcount += 1
m.reply(`Craft *1 🥼 armor* Berhasil.\n\nDurability : ${user.armordurability}`)
} else {
m.reply(`Anda sudah memiliki 🥼 armor\n\nDurability : ${user.armordurability}`)
}
} else if (item == 'baja' || item == 'steel') {
if (user.iron < 2 * total || user.money < 4000 * total) return m.reply(`Diperlukan ${2 * total} iron, ${4000 * total} money.\n\nAnda memiliki :\n- ${user.iron} iron\n- ${user.money} money`)
user.iron -= 2 * total
user.money -= 4000 * total
user.steel += total
user.craftcount += 1
m.reply(`Craft *${total} steel* Berhasil.\n\nTotal steel : ${user.steel}`)
} else if (item == 'kapal' || item == 'ship') {
if (user.steel < 6 * total || user.iron < 13 * total || user.wood < 13 * total) return m.reply(`Diperlukan ${6 * total} steel, ${13 * total} iron, ${13 * total} wood.\n\nAnda memiliki :\n- ${user.steel} steel\n- ${user.iron} iron\n- ${user.wood} wood`)
user.steel -= 6 * total
user.iron -= 13 * total
user.wood -= 13 * total
user.kapal += total
user.craftcount += 1
m.reply(`Craft *${total} kapal* Berhasil.\n\nTotal kapal : ${user.kapal}`)
} else if (item == 'kargo' || item == 'cargo') {
if (user.iron < 30 * total || user.steel < 3 * total) return m.reply(`Diperlukan ${30 * total} iron, ${3 * total} steel.\n\nAnda memiliki :\n- ${user.iron} iron\n- ${user.steel} steel`)
user.iron -= 30 * total
user.steel -= 3 * total
user.kargo += total
user.craftcount += 1
m.reply(`Craft *${total} kargo* Berhasil.\n\nTotal kargo : ${user.kargo}`)
} else {
mecha.reply(m.chat, txt.replaceAll('%', '```'), m)
}
},
register: true,
limit: true
}

function isNumber(number) {
if (!number) return number
number = parseInt(number)
return typeof number == 'number' && !isNaN(number)
}