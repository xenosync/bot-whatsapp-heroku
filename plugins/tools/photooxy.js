const axios = require('axios');
const FormData = require('form-data');
const { queryString } = require('object-query-string');

const photooxy = (url, text) => new Promise((resolve, reject) => {
axios({
method: 'GET',
url: url,
headers: {
'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
}
})
.then(({ data, headers }) => {
const token = /<input type="hidden" name="token" value="(.*?)" id="token">/.exec(data)[1]
const build_server = /<input type="hidden" name="build_server" value="(.*?)" id="build_server">/.exec(data)[1]
const build_server_id = /<input type="hidden" name="build_server_id" value="(.*?)" id="build_server_id">/.exec(data)[1]
const cookie = headers['set-cookie'][0]
const form = new FormData()
if (typeof text === 'string') text = [text]
for (let texts of text) form.append('text[]', texts)
form.append('sumbit', 'GO')
form.append('token', token)
form.append('build_server', build_server)
form.append('build_server_id', build_server_id)
axios({
method: 'POST',
url: url,
data: form,
headers: {
'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36',
'cookie': cookie,
...form.getHeaders()
}
})
.then(({ data }) => {
const form_value = /<div.*?id = "form_value".+>(.*?)<\/div>/.exec(data)[1]
axios({
method: 'GET',
url: 'https://photooxy.com/effect/create-image?' + queryString(JSON.parse(form_value)),
headers: {
'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36',
'cookie': cookie
}
})
.then(({ data }) => {
resolve(build_server + data.image)
})
.catch(reject)
})
.catch(reject)
})
.catch(reject)
})

exports.run = {
usage: ['shadow', 'write', 'romantic', 'burnpaper', 'smoke', 'narutobanner', 'lovetext', 'undergrass', 'doublelove', 'coffecup', 'underwaterocean', 'smokyneon', 'starstext', 'rainboweffect', 'balloontext', 'metalliceffect', 'embroiderytext', 'flamingtext', 'stonetext', 'writeart', 'summertext', 'wolfmetaltext', 'nature3dtext', 'rosestext', 'naturetypography', 'quotesunder', 'shinetext'],
use: 'text',
category: 'photooxy',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.prefix + m.command, 'surya'))
if (m.text.length > 30) return m.reply('Max 30 character!')
if (func.isEmoji(m.text)) return m.reply(`Jangan gunakan emoji.`)
mecha.sendReact(m.chat, '🕒', m.key)
let link
if (/stonetext/.test(m.command)) link = 'https://photooxy.com/online-3d-white-stone-text-effect-utility-411.html'
if (/writeart/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/write-art-quote-on-wood-heart-370.html'
if (/summertext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/3d-summer-text-effect-367.html'
if (/wolfmetaltext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/create-a-wolf-metal-text-effect-365.html'
if (/nature3dtext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/make-nature-3d-text-effects-364.html'
if (/rosestext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/yellow-roses-text-360.html'
if (/naturetypography/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/create-vector-nature-typography-355.html'
if (/quotesunder/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/quotes-under-fall-leaves-347.html'
if (/shinetext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/rainbow-shine-text-223.html'
if (/shadow/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html'
if (/write/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/write-text-on-the-cup-392.html'
if (/romantic/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/romantic-messages-for-your-loved-one-391.html'
if (/burnpaper/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/write-text-on-burn-paper-388.html'
if (/smoke/.test(m.command)) link = 'https://photooxy.com/other-design/create-an-easy-smoke-type-effect-390.html'
if (/narutobanner/.test(m.command)) link = 'https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html'
if (/lovetext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html'
if (/undergrass/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html'
if (/doublelove/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/love-text-effect-372.html'
if (/coffecup/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html'
if (/underwaterocean/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/creating-an-underwater-ocean-363.html'
if (/smokyneon/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/make-smoky-neon-glow-effect-343.html'
if (/starstext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html'
if (/rainboweffect/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/glow-rainbow-effect-generator-201.html'
if (/balloontext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/royal-look-text-balloon-effect-173.html'
if (/metalliceffect/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html'
if (/embroiderytext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/create-embroidery-text-online-191.html'
if (/flamingtext/.test(m.command)) link = 'https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html'
let hasil = await photooxy(link, m.text);
mecha.sendMessage(m.chat, {image: {url: hasil}, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
.catch((e) => m.reply(mess.error.api))
},
limit: true
}