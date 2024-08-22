const axios = require('axios');
const cheerio = require('cheerio');

const resepmasakan = async (query) => {
const sresep = await axios.get("https://resepkoki.id/?s=" + query);
const $$ = cheerio.load(sresep.data);
const lresep = $$("body").find("div.masonry-grid > div:nth-child(1) > article > div > div.archive-item-media > a").attr("href");
if (lresep == undefined)
return {
status: false,
message: "Resep tidak ditemukan!",
};
const { data } = await axios.get(lresep);
const $ = cheerio.load(data);
const abahan = [];
const atakaran = [];
const atahap = [];
$("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name"
).each(function(a, b) {
bh = $(b).text();
abahan.push(bh);
});
$("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount").each(function(c, d) {
uk = $(d).text();
atakaran.push(uk);
});
$("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p").each(function(e, f) {
th = $(f).text();
atahap.push(th);
});
const judul = $("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1").text();
const waktu = $("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span").text();
const hasil = $("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span").text().split(": ")[1];
const level = $("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span").text().split(": ")[1];
const thumb = $("body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img").attr("src");
tbahan = "bahan\n";
for (let i = 0; i < abahan.length; i++) {
tbahan += abahan[i] + " " + atakaran[i] + "\n";
}
ttahap = "tahap\n";
for (let i = 0; i < atahap.length; i++) {
ttahap += atahap[i] + "\n\n";
}
const tahap = ttahap;
const bahan = tbahan;
const result = {
creator: "Fajar Ihsana",
data: {
judul: judul,
waktu_masak: waktu,
hasil: hasil,
tingkat_kesulitan: level,
thumb: thumb,
bahan: bahan.split("bahan\n")[1],
langkah_langkah: tahap.split("tahap\n")[1],
},
};
return judul ? {
status: true,
...result,
} : {
status: false,
message: "Resep tidak ditemukan!",
}
}

exports.run = {
usage: ['resepmasakan'],
hidden: ['resep'],
use: 'resep',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'soto ayam'))
m.reply(global.mess.wait)
await resepmasakan(m.text).then(async res => {
if (!res.status) return m.reply(res.message)
let txt = `乂  *RESEP ${m.text.toUpperCase()}*\n`
txt += `\n◦  Judul: ${res.data.judul}`
txt += `\n◦  Waktu masak: ${res.data.waktu_masak}`
txt += `\n◦  hasil: ${res.data.hasil}`
txt += `\n◦  Tingkat kesulitan: ${res.data.tingkat_kesulitan}`
txt += `\n◦  Bahan:\n${res.data.bahan}`
mecha.sendMessageModify(m.chat, txt, m, {
title: `RESEP ${m.text.toUpperCase()}`,
body: global.header,
thumbnail: await mecha.resize(res.data.thumb, 300, 175),
largeThumb: true, 
expiration: m.expiration
})
})
},
premium: true,
limit: true
}