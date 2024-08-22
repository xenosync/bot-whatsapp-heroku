const axios = require('axios');
const cheerio = require('cheerio');

const gempa = async () => {
return new Promise(async (resolve, reject) => {
axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg')
.then(({
data
}) => {
const $ = cheerio.load(data)
const drasa = [];
$('table > tbody > tr:nth-child(1) > td:nth-child(6) > span').get().map((rest) => {
dir = $(rest).text();
drasa.push(dir.replace('\t', ' '))
})
teks = ''
for (let i = 0; i < drasa.length; i++) {
teks += drasa[i] + '\n'
}
const rasa = teks
const format = {
imagemap: $('div.modal-body > div > div:nth-child(1) > img').attr('src'),
magnitude: $('table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
kedalaman: $('table > tbody > tr:nth-child(1) > td:nth-child(5)').text(),
wilayah: $('table > tbody > tr:nth-child(1) > td:nth-child(6) > a').text(),
waktu: $('table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
lintang_bujur: $('table > tbody > tr:nth-child(1) > td:nth-child(3)').text(),
dirasakan: rasa
}
const result = {
creator: 'Surya',
data: format
}
resolve(result)
})
.catch(reject)
})
}

exports.run = {
usage: ['gempa'],
category: 'searching',
async: async (m, { mecha }) => {
await gempa().then(res => {
let txt = '乂  *I N F O - G E M P A*\n'
txt += `\n◦  Magnitude : ${res.data.magnitude}`
txt += `\n◦  Kedalaman : ${res.data.kedalaman}`
txt += `\n◦  Wilayah : ${res.data.wilayah}`
txt += `\n◦  Waktu : ${res.data.waktu}`
txt += `\n◦  Lintang Bujur : ${res.data.lintang_bujur}`
txt += `\n◦  Dirasakan : ${res.data.dirasakan}`
mecha.sendMedia(m.chat, res.data.imagemap, m, {
caption: txt, 
expiration: m.expiration
})
})
},
limit: true
}