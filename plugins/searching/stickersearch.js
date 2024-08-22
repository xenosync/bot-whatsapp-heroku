const axios = require('axios');
const cheerio = require('cheerio');

function stickersearch(query){
return new Promise((resolve) => {
axios.get(`https://getstickerpack.com/stickers?query=${query}`).then(({ data }) => {
const $ = cheerio.load(data)
const link = [];
$('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
link.push($(b).attr('href'))
})
let rand = link[Math.floor(Math.random() * link.length)]
axios.get(rand).then(({ data }) => {
const $$ = cheerio.load(data)
const url = [];
$$('#stickerPack > div > div.row > div > img').each(function(a, b) {
url.push($$(b).attr('src').split('&d=')[0])
})
resolve({
creator: 'SuryaDev',
title: $$('#intro > div > div > h1').text(),
author: $$('#intro > div > div > h5 > a').text(),
author_link: $$('#intro > div > div > h5 > a').attr('href'),
sticker: url
})
})
})
})
}

exports.run = {
usage: ['stickersearch'],
hidden: ['stikersearch'],
use: 'text',
category: 'searching',
async: async (m, { func, mecha, packname, author }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Patrick'))
await stickersearch(m.text).then(async res => {
let txt = `Creator : ${res.creator}`
txt += `\nTitle : ${res.title}`
txt += `\nAuthor : ${res.author}`
txt += `\nAuthor Link : ${res.author_link}\n`
txt += `\n_mengirim ${res.sticker.length} sticker..._`
mecha.reply(m.chat, txt, m)
for (let url of res.sticker) {
await mecha.sendStickerFromUrl(m.chat, url, m, {
packname: packname, 
author: author, 
expiration: m.expiration
})
}
m.reply(global.mess.ok);
})
},
premium: true,
limit: true
}