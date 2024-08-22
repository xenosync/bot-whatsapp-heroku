exports.run = {
usage: ['build'],
hidden: ['building'],
use: '[item] [count]',
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let txt = `乂  *B U I L D I N G - L I S T*

%🏥 rumahsakit%
%🏭 restoran%
%🏯 pabrik%
%⚒️ tambang%
%🛳️ pelabuhan%

Format: *${m.cmd} [item] [jumlah]*
Contoh: *${m.cmd} restoran 2*`

const item = (m.args[0] || '').toLowerCase()
const total = Math.floor(isNumber(m.args[1]) ? Math.min(Math.max(parseInt(m.args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if (item == 'rumahsakit') {
if (user.rumahsakit == 0) {
if (total > 1) return m.reply(`Kamu belum memiliki *🏥 Rumah Sakit*, hanya dapat build 1 bangunan`)
if (user.money < 900000 * total || user.sand < 600 * total) return m.reply(`Diperlukan ${900000 * total} money, ${600 * total} sand.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.sand} sand`)
user.money -= 900000 * total
user.sand -= 600 * total
user.rumahsakit += total
user.rumahsakitlvl += 1
m.reply(`Berhasil membangun *${total} 🏥 Rumah Sakit* level ${user.rumahsakitlvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
} else {
if (user.rumahsakit + total > 2 * user.rumahsakitlvl) return m.reply(`Perlu upgrade 🏥 rumahsakit ke level ${2 * user.rumahsakitlvl} terlebih dahulu.`)
if (user.money < 900000 * total * user.rumahsakitlvl || user.sand < 600 * total * user.rumahsakitlvl) return m.reply(`Diperlukan ${900000 * total * user.rumahsakitlvl} money, ${600 * total * user.rumahsakitlvl} sand.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.sand} sand`)
user.money -= 900000 * total * user.rumahsakitlvl
user.sand -= 600 * total * user.rumahsakitlvl
user.rumahsakit += total
m.reply(`Berhasil membangun *${total} 🏥 Rumah Sakit* level ${user.rumahsakitlvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
}
} else if (item == 'restoran') {
if (user.restoran == 0) {
if (total > 1) return m.reply(`Kamu belum memiliki *🏭 Restoran*, hanya dapat build 1 bangunan`)
if (user.money < 1000000 * total || user.sand < 333 * total || user.steel < 50 * total || user.masakcount < 50 * total) return m.reply(`Diperlukan ${1000000 * total} money, ${333 * total} sand, ${50 * total} steel, dan pengalaman masak ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.sand} sand\n- ${user.steel} steel\n- pengalaman masak : ${user.masakcount} kali`)
user.money -= 1000000 * total
user.sand -= 333 * total
user.steel -= 50 * total
user.restoran += 1 * total
user.restoranlvl += 1
m.reply(`Berhasil membangun *${total} 🏭 Restoran* level ${user.restoranlvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
} else {
if (user.restoran + total > 2 * user.restoranlvl) return m.reply(`Perlu upgrade 🏭 restoran ke level ${2 * user.restoranlvl} terlebih dahulu.`)
if (user.money < 1250000 * total || user.sand < 333 * total || user.steel < 50 * total || user.masakcount < 50 * total) return m.reply(`Diperlukan ${1250000 * total} money, ${333 * total} sand, ${50 * total} steel, dan pengalaman masak ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.sand} sand\n- ${user.steel} steel\n- pengalaman masak : ${user.masakcount} kali`)
user.money -= 1250000 * total
user.sand -= 333 * total
user.steel -= 50 * total
user.restoran += 1 * total
m.reply(`Berhasil membangun *${total} 🏭 Restoran* level ${user.restoranlvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
}
} else if (item == 'pabrik') {
if (user.pabrik == 0) {
if (total > 1) return m.reply(`Kamu belum memiliki *🏯 Pabrik*, hanya dapat build 1 bangunan`)
if (user.money < 500000 * total || user.sand < 166 * total || user.steel < 25 * total || user.craftcount < 50 * total) return m.reply(`Diperlukan ${500000 * total} money, ${166 * total} sand, ${25 * total} steel, dan pengalaman crafting ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.sand} sand\n- ${user.steel} steel\n- pengalaman crafting : ${user.craftcount} kali`)
user.money -= 500000 * total
user.sand -= 166 * total
user.steel -= 25 * total
user.pabrik += 1 * total
user.pabriklvl += 1
m.reply(`Berhasil membangun *${total} 🏯 Pabrik* level ${user.pabriklvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
} else {
if (user.pabrik + total > 2 * user.pabriklvl) return m.reply(`Perlu upgrade 🏯 pabrik ke level ${2 * user.pabriklvl} terlebih dahulu.`)
if (user.money < 500000 * total || user.sand < 166 * total || user.steel < 25 * total || user.craftcount < 50 * total) return m.reply(`Diperlukan ${500000 * total} money, ${166 * total} sand, ${25 * total} steel, dan pengalaman crafting ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.sand} sand\n- ${user.steel} steel\n- pengalaman crafting : ${user.craftcount} kali`)
user.money -= 500000 * total
user.sand -= 166 * total
user.steel -= 25 * total
user.pabrik += 1 * total
m.reply(`Berhasil membangun *${total} 🏯 Pabrik* level ${user.pabriklvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
}
} else if (item == 'tambang') {
if (user.tambang == 0) {
if (total > 1) return m.reply(`Kamu belum memiliki *⚒️ Tambang*, hanya dapat build 1 bangunan`)
if (user.money < 1000000 * total || user.iron < 166 * total || user.steel < 30 * total || user.adventurecount < 50 * total) return m.reply(`Diperlukan ${1000000 * total} money, ${166 * total} iron, ${30 * total} steel, dan pengalaman adventure ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.iron} iron\n- ${user.steel} steel\n- pengalaman adventure : ${user.adventurecount} kali`)
user.money -= 1000000 * total
user.iron -= 166 * total
user.steel -= 30 * total
user.tambang += 1 * total
user.tambanglvl += 1
m.reply(`Berhasil membangun *${total} ⚒️ tambang* level ${user.tambanglvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
} else {
if (user.tambang + total > 2 * user.tambanglvl) return m.reply(`Perlu upgrade ⚒️ tambang ke level ${2 * user.tambanglvl} terlebih dahulu.`)
if (user.money < 1000000 * total || user.iron < 166 * total || user.steel < 30 * total || user.adventurecount < 50 * total) return m.reply(`Diperlukan ${1000000 * total} money, ${166 * total} iron, ${30 * total} steel, dan pengalaman adventure ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.iron} iron\n- ${user.steel} steel\n- pengalaman adventure : ${user.adventurecount} kali`)
user.money -= 1000000 * total
user.iron -= 166 * total
user.steel -= 30 * total
user.tambang += 1 * total
m.reply(`Berhasil membangun *${total} ⚒️ Tambang* level ${user.tambanglvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
}
} else if (item == 'pelabuhan') {
if (user.pelabuhan == 0) {
if (total > 1) return m.reply(`Kamu belum memiliki *🛳️ Pelabuhan*, hanya dapat build 1 bangunan`)
if (user.money < 500000 * total || user.kargo < 6 * total || user.kapal < 6 * total || user.mancingcount < 50 * total) return m.reply(`Diperlukan ${500000 * total} money, ${6 * total} kargo, ${6 * total} kapal, dan pengalaman mancing ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.kargo} kargo\n- ${user.kapal} kapal\n- pengalaman mancing : ${user.mancingcount} kali`)
user.money -= 500000 * total
user.kargo -= 6 * total
user.kapal -= 6 * total
user.pelabuhan += 1 * total
user.pelabuhanlvl += 1
m.reply(`Berhasil membangun *${total} 🛳️ Pelabuhan* level ${user.pelabuhanlvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
} else {
if (user.pelabuhan + total > 2 * user.pelabuhanlvl) return m.reply(`Perlu upgrade 🛳️ pelabuhan ke level ${2 * user.pelabuhanlvl} terlebih dahulu.`)
if (user.money < 500000 * total || user.kargo < 6 * total || user.kapal < 6 * total || user.mancingcount < 50 * total) return m.reply(`Diperlukan ${500000 * total} money, ${6 * total} kargo, ${6 * total} kapal, dan pengalaman mancing ${50 * total} kali.\n\nAnda memiliki :\n- ${user.money} money\n- ${user.kargo} kargo\n- ${user.kapal} kapal\n- pengalaman mancing : ${user.mancingcount} kali`)
user.money -= 500000 * total
user.kargo -= 6 * total
user.kapal -= 6 * total
user.pelabuhan += 1 * total
m.reply(`Berhasil membangun *${total} 🛳️ pelabuhan* level ${user.pelabuhanlvl}.\n\ncommand *${m.prefix}stat* untuk mengecek bonus stat pet / building`)
}
}
else {
m.reply(txt.replaceAll('%', '```'))
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