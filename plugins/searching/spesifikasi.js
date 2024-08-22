let axios = require('axios'),
cheerio = require('cheerio'),
database = [];

exports.run = {
usage: ['spesifikasi'],
hidden: ['spek'],
use: 'text',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Poco x3 pro'))
mecha.sendReact(m.chat, '🕒', m.key)
database = [];
let data = await spek(m.text)
if (data.length == 0) return m.reply('Data empty.')
let txt = `*S P E S I F I K A S I*\n\nResult From : ${m.text}\n_Balas pesan ini dengan *nomor spesifikasi* untuk melihat spesifikasi._`
for (let [index, i] of data.entries()) {
database.push({
index: index + 1,
harga: i.harga,
link: i.link
})
txt += `\n\n*${index + 1}.* ${i.title}`
txt += `\n- Harga: ${i.harga ? i.harga : '-'}`
}
let { key } = await mecha.reply(m.chat, txt, m);
mecha.spesifikasi[m.chat] = {
data: database, 
key: key, 
timeout: setTimeout(() => {
mecha.sendMessage(m.chat, { delete: key }); 
delete mecha.spesifikasi[m.chat];
database = [];
}, 60 * 1000)
};
},
main: async (m, { func, mecha }) => {
mecha.spesifikasi = mecha.spesifikasi ? mecha.spesifikasi : {};
if (m.isBot || !(m.chat in mecha.spesifikasi)) return;
if (typeof mecha.spesifikasi[m.chat] == 'undefined') return;
const { data, key } = mecha.spesifikasi[m.chat];
if (!m.quoted || m.quoted.id !== key.id || !m.budy) return;
const index = parseInt(m.budy.trim());
if (isNaN(index) || index < 1 || index > data.length) {
await mecha.reply(m.chat, 'Masukkan nomor spesifikasi yang valid.', m);
} else {
mecha.sendReact(m.chat, '🕒', m.key)
let res = data[index - 1];
if (!/https:\/\/carisinyal.com/i.test(res.link)) return
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit);
let result = await speklengkap(res.link)
let fitur = result.fitur.map(v => v.desc).join('\n\n')
let spek = result.spek.map(v => `${v.name} :\n${v.fitur}`.trim()).join('\n\n')
let txt = '*S P E S I F I K A S I*'
txt += `\n\n_*Fitur Unggulan:*_ \n\n${fitur}`
txt += `\n\n_*Spesifikasi Lengkap:*_\n\n${spek}`
mecha.sendMessage(m.chat, {
image: {
url: result.img
}, 
caption: txt
}, {quoted: m, ephemeralExpiration: m.expiration})
}
},
limit: true
}

async function spek(query) {
return new Promise((resolve, reject) => {
let result = axios.get('https://carisinyal.com/hp/?_sf_s=' + query).then(v => {
let $ = cheerio.load(v.data)
let list = $("div.oxy-posts > div.oxy-post")
let index = []
list.each((v, i) => {
let title = $(i).find("a.oxy-post-title").text()
let harga = $(i).find("div.harga").text()
let link = $(i).find("a.oxy-post-image").attr('href')
let res = {
title: title,
harga: harga,
link: link
}
index.push(res)
})
return index
})
resolve(result)
})
}

async function speklengkap(link) {
return new Promise((resolve, reject) => {
let result = axios.get(link).then(v => {
let $ = cheerio.load(v.data)
let fitur = []
let spesifikasi = []
let list = $("div#_dynamic_list-777-114924 > div.ct-div-block")
list.each((v, i) => {
let fitur_unggulan = $(i).find("span.ct-span").text()
fitur.push({
desc: fitur_unggulan
})
})
let spek = $("div.ct-code-block > div > table.box-info")
spek.each((v, i) => {
let name = $(i).find("tr.box-baris > td.kolom-satu").text().trim()
let fitur = $(i).find("tr.box-baris > td.kolom-dua").text().trim()
spesifikasi.push({
name: name,
fitur: fitur
})
})
let img = $("meta[name='twitter:image']").attr('content')
return {
fitur: fitur,
spek: spesifikasi,
img: img
}
})
resolve(result)
})
}