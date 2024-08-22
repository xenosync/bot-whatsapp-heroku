exports.run = {
usage: ['lirik'],
use: 'judul lagu',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'melukis senja'))
mecha.sendReact(m.chat, '🕒', m.key)
let data = await func.fetchJson(`https://aemt.me/lirik?text=${encodeURIComponent(m.text)}`)
if (!data.status) return m.reply('Lirik tidak ditemukan!')
let result = data.result;
let txt = `- Title: ${result.title}
- Full Title: ${result.fullTitle}
- Featured Title: ${result.featuredTitle}
- Released At: ${result.releasedAt}
- Artist: ${result.artist}
- Artist Url: ${result.artistUrl}
- Artist Image: ${result.artistImage}
- Artist Thumbnail: ${result.artistThumbnail}
- URL: ${result.url}
- Lyrics:\n\n${result.lyrics}`
mecha.sendMessage(m.chat, {
image: {
url: result.thumbnail
},
caption: txt
}, {quoted: m, ephemeralExpiration: m.expiration})
},
restrict: true,
limit: true
}