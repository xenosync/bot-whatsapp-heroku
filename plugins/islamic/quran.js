exports.run = {
usage: ['quran'],
hidden: ['surah'],
use: 'nomor surah',
category: 'islamic',
async: async (m, { func, mecha }) => {
if (m.args && isNaN(m.args[0])) return m.reply(func.example(m.cmd, '17'))
if (Number(m.args[0]) > 114) return m.reply('Stress ??')
let data = await func.fetchJson(`https://raw.githubusercontent.com/Jabalsurya2105/database/master/surah/surah%20${m.args[0]}.json`)
let txt = `QS. ${data.name} : 1-${data.jumlah_ayat}\n`
txt += data.ayat.map((x, i) => `\n${x.arab}\n${i + 1}. ${x.latin}\n${x.id}`).join('\n')
mecha.sendMessage(m.chat, {text: txt}, {quoted: m, ephemeralExpiration: m.expiration})
}
}