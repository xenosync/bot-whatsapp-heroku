exports.run = {
usage: ['waifu', 'megumin', 'shinobu', 'awoo', 'neko', 'bully', 'cuddle', 'hug', 'cry', 'kiss', 'lick', 'pat', 'bonk', 'yeet', 'trap'],
category: 'anime',
async: async (m, { func, mecha }) => {
let wibu
if (/waifu/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/waifu'
if (/neko/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/neko'
if (/awoo/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/awoo'
if (/megumin/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/megumin'
if (/shinobu/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/shinobu'
if (/bully/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/bully'
if (/cuddle/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/cuddle'
if (/hug/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/hug'
if (/cry/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/cry'
if (/kiss/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/kiss'
if (/lick/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/lick'
if (/pat/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/pat'
if (/bonk/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/bonk'
if (/yeet/.test(m.command)) wibu = 'https://waifu.pics/api/sfw/yeet'
if (/trap/.test(m.command)) wibu = 'https://api.waifu.pics/nsfw/trap'
let result = await func.fetchJson(wibu) 
mecha.sendMessage(m.chat, {image: {url: result.url}, caption: 'Dasar Wibu!!'}, {quoted: m, ephemeralExpiration: m.expiration})
},
premium: true,
limit: 5
}