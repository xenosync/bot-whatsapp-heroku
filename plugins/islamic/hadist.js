exports.run = {
usage: ['hadist'],
hidden: ['hadits', 'hadis'],
use: 'bukhari 1',
category: 'islamic',
async: async (m, { func, mecha, errorMessage }) => {
let list = ['abu-daud', 'ahmad', 'bukhari', 'darimi', 'tirmidzi', 'ibnu-majah', 'nasai', 'malik', 'muslim']
if (!m.args[0]) return m.reply(`Contoh: ${m.cmd} bukhari 1\n\n*Pilihan tersedia:*\nabu-daud (1 - 4590)\nahmad (1 - 26363)\nbukhari (1 - 7008)\ndarimi (1 - 3367)\ntirmidzi (1 - 3891)\nibnu-majah (1 - 4331)\nnasai (1 - 5662)\nmalik (1 - 1594)\nmuslim (1 - 5362)`)
if (!list.includes(m.args[0])) return m.reply('Pilihan tersedia :\nabu-daud (1 - 4590)\nahmad (1 - 26363)\nbukhari (1 - 7008)\ndarimi (1 - 3367)\ntirmidzi (1 - 3891)\nibnu-majah (1 - 4331)\nnasai (1 - 5662)\nmalik (1 - 1594)\nmuslim (1 - 5362)')
if (!m.args[1]) return m.reply(`Hadis yang ke berapa?\n\ncontoh:\n${m.cmd} muslim 1`)
if (isNaN(m.args[1])) return m.reply(`Nomor harus berupa angka!\n\ncontoh:\n${m.cmd} muslim 1`)
try {
let data = await func.fetchJson(`https://raw.githubusercontent.com/Jabalsurya2105/database/master/hadis/hadis%20${m.args[0]}.json`)
let number = Number(parseInt(m.args[1]))
if (number > data.hadits.length) return m.reply(`Hadist ini hanya sampai *${data.hadits.length}* ayat.`)
let result = data.hadits[number - 1]
if (result.arab == null || result.id == null) return m.reply(`Data hadist ${m.args[0]} nomor *${m.args[1]}* tidak ditemukan.`)
let txt = `${data.name} No. ${result.number}`
txt += `\n\n${result.arab}`
txt += `\n\n*Artinya:* ${result.id}`
mecha.sendMessage(m.chat, {text: txt}, {quoted: m, ephemeralExpiration: m.expiration}).then((q) => mecha.sendMessage(m.chat, {audio: {url: audio}, mimetype: 'audio/mpeg'}, {quoted: q, ephemeralExpiration: m.expiration}))
} catch (e) {
m.reply('Hadist tidak ditemukan.')
return errorMessage(e)
}
}
}