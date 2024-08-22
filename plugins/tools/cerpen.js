//Cerpen Fax
const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')

async function cerpen (category) {
return new Promise((resolve, reject) => {
let title = category.toLowerCase().replace(/[()*]/g, "")
let judul = title.replace(/\s/g, "-")
let page = Math.floor(Math.random() * 5)
axios.get('http://cerpenmu.com/category/cerpen-'+judul+'/page/'+page)
.then((get) => {
let $ = cheerio.load(get.data)
let link = []
$('article.post').each(function (a, b) {
link.push($(b).find('a').attr('href'))
})
let random = link[Math.floor(Math.random() * link.length)]
axios.get(random)
.then((res) => {
let $$ = cheerio.load(res.data)
let hasil = {
title: $$('#content > article > h1').text(),
author: $$('#content > article').text().split('Cerpen Karangan: ')[1].split('Kategori: ')[0],
kategori: $$('#content > article').text().split('Kategori: ')[1].split('\n')[0],
lolos: $$('#content > article').text().split('Lolos moderasi pada: ')[1].split('\n')[0],
cerita: $$('#content > article > p').text()
}
resolve(hasil)
})
})
})
}

const category = ['anak', 'jawa', 'sunda', 'budaya', 'cinta', 'galau', 'gokil', 'inspiratif', 'jepang', 'kehidupan', 'keluarga', 'korea', 'kristen', 'liburan', 'lingkungan', 'malaysia', 'mengharukan', 'misteri', 'motivasi', 'nasihat', 'nasionalisme', 'olahraga', 'penantian', 'pendidikan', 'pengorbanan', 'penyesalan', 'perjuangan', 'perpisahan', 'persahabatan', 'petualangan', 'ramadhan', 'remaja', 'renungan', 'rindu', 'rohani', 'romantis', 'sastra', 'sedih', 'sejarah', 'terjemahan']

exports.run = {
usage: category.map(v => 'cerpen-' + v),
category: 'cerpen',
async: async (m, { func, mecha }) => {
let wait = await mecha.sendMessage(m.chat, {text: global.mess.wait}, {quoted: m, ephemeralExpiration: m.expiration})
let res = await cerpen(m.command.split('-')[1].trim())
let txt = `◦  *Title* : ${res.title}\n`
txt += `◦  *Author* : ${res.author}\n`
txt += `◦  *Category* : ${res.kategori}\n`
txt += `◦  *Pass Moderation* : ${res.lolos}\n`
txt += `◦  *Story* :\n`
txt += res.cerita
await mecha.sendMessage(m.chat, {text: txt, edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
},
limit: true
}