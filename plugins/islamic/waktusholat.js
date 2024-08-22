let axios = require('axios')
let cheerio = require('cheerio')
let moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

function _axios(host) {
return new Promise(async (resolve, reject) => {
axios.get(host).then(({ data }) => {
resolve(data)
})
})
}

function sholatAll(kota) {
return new Promise(async (resolve, reject) => {
let html = await _axios('https://m.dream.co.id/jadwal-salat/' + kota.replace(/\s/g, '-').toLowerCase())
$ = cheerio.load(html)
let data = []
$('table[class="table-index-jadwal"] > tbody > tr').each(function (i, e) {
data.push({
tanggal: $(e).find('td[data-title="Tanggal"]').text(),
subuh: $(e).find('td[data-title="Subuh"]').text(),
duha: $(e).find('td[data-title="Duha"]').text(),
zuhur: $(e).find('td[data-title="Zuhur"]').text(),
ashar: $(e).find('td[data-title="Asar"]').text(),
magrib: $(e).find('td[data-title="Magrib"]').text(),
isya: $(e).find('td[data-title="Isya"]').text()
})
});
resolve({ creator: 'SuryaDev', status: true, data: data })
})
}

exports.run = {
usage: ['waktusholat'],
hidden: ['jadwalsholat'],
use: 'kota',
category: 'islamic',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'jepara'))
const jadwalsholat= (kota) => {
return new Promise(async (resolve, reject) => {
let sholat = await sholatAll(kota)
if (!sholat.status) return resolve({ creator: 'SuryaDev', status: false })
let now = moment(new Date * 1).format('DD-MM-yy')
let data = sholat.data.find(v => v.tanggal == now)
if (typeof data == 'undefined') return resolve({ creator: 'SuryaDev', status: false })
resolve({ creator: 'SuryaDev', status: true, data: data })
})
}
let result = await jadwalsholat(m.text)
if (!result.status) return m.reply('Maaf terjadi kesalahan.')
delete result.status;
delete result.creator;
let txt = '乂  *J A D W A L - S H O L A T*\n\n'
for (let key in result.data) txt += `◦  ${func.ucword(key)} : ${result.data[key]}\n`
mecha.reply(m.chat, txt, m);
}
}