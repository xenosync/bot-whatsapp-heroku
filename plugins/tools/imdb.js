const fetch = require('node-fetch')

exports.run = {
usage: ['imdb'],
hidden: ['film'],
use: 'title',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(`Example : ${m.cmd} Avengers`)
mecha.sendReact(m.chat, '🕒', m.key)
try {
let res = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(m.text)}`)
let anu = await res.json()
let txt = `*${anu.title.length > 20 ? anu.title : anu.title.toUpperCase().split('').map(v => v).join(' ')}*\n`
txt += `\n_"${anu.plot}"_`
txt += `\n_${anu.imdburl}_`
txt += `\n\n*Rating :*`
for (let x of anu.ratings) {
txt += `\n- ${x.source} (${x.value})`
}
txt += `\n\nReleased : ${anu.released}`
txt += `\nRated : *${anu.rated}*`
txt += `\nGenres : ${anu.genres}`
txt += `\nLanguages : ${anu.languages}`
txt += `\nReleased : ${anu.released}`
txt += `\nDirector : ${anu.director}`
txt += `\nWriter : ${anu.writer}`
txt += `\nActor : ${anu.actors}`
await mecha.sendMessage(m.chat, {image: {url: anu.poster}, caption: txt}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (e) {
console.log(e)
m.reply(`Result not found.`)
}
},
premium: true,
limit: true
}