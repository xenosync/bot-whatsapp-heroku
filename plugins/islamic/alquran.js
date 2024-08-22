exports.run = {
usage: ['alquran'],
hidden: ['aq'],
use: 'surah ayat',
category: 'islamic',
async: async (m, { func, mecha, errorMessage }) => {
if (m.args && isNaN(m.args[0])) return m.reply(`Contoh penggunaan:\n${m.cmd} 17 32\n\nmaka hasilnya adalah surah Al-Isra ayat 32 beserta audionya`)
if (m.args && isNaN(m.args[1])) return m.reply(`Contoh penggunaan:\n${m.cmd} 17 32\n\nmaka hasilnya adalah surah Al-Isra ayat 32 beserta audionya`)
if (Number(m.args[0]) > 114) return m.reply('Stress ??')
try {
let data = await func.fetchJson(`https://raw.githubusercontent.com/Jabalsurya2105/database/master/surah/surah%20${m.args[0]}.json`)
let number = Number(parseInt(m.args[1]))
if (number > data.ayat.length) return m.reply(`Surah ini hanya sampai *${data.ayat.length}* ayat.`)
let { no, arab, latin, id, en, audio, tafsir }  = data.ayat[number - 1]
let txt = `${arab}`
txt += `\n${en}`
txt += `\n\nArtinya: ${id}`
txt += `\n\n(Q.S ${data.name} : ${no})`
mecha.sendMessage(m.chat, {text: txt}, {quoted: m, ephemeralExpiration: m.expiration})
.then((q) => mecha.sendMessage(m.chat, {audio: {url: audio}, mimetype: 'audio/mpeg'}, {quoted: q, ephemeralExpiration: m.expiration}))
} catch (e) {
m.reply('Surah tidak ditemukan.')
return errorMessage(e)
}
}
}