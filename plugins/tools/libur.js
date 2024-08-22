const axios = require('axios');
const cheerio = require('cheerio');

const libur = async (tahun) => {
const data = await axios.get("https://tanggalan.com/" + tahun);
const $ = cheerio.load(data.data);
const result = {};
result["tahun"] = tahun;
result["data"] = [];
num = 1;
$("#main > article > ul").each(function(a, b) {
let tbulan = $(b).find("li:nth-child(1) > a").attr("href").split("-")[0];
let bulan = tbulan == "januari" ? "January" : 
tbulan == "februari" ? "February" : 
tbulan == "maret" ? "March" : 
tbulan == "april" ? "April" : 
tbulan == "mei" ? "May" : 
tbulan == "juni" ? "June" : 
tbulan == "juli" ? "July" : 
tbulan == "agustus" ? "August" : 
tbulan == "september" ? "September" : 
tbulan == "oktober" ? "October" : 
tbulan == "november" ? "November" : 
tbulan == "desember" ? "December" : "";
$(`#main > article > ul:nth-child(${num}) > li:nth-child(4) > table > tbody > tr`).each(function() {
result.data.push({
tanggal: $(this).find("td:nth-child(1)").text(),
bulan: bulan,
event: $(this).find("td:nth-child(2)").text(),
});
});
num += 1;
});
return result;
};

exports.run = {
usage: ['libur'],
use: 'tahun',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, '2023'))
if (isNaN(m.text)) return m.reply('Tahun harus berupa angka')
await libur(m.text).then(res => {
let txt = `乂  *HARI LIBUR ${res.tahun}*`
for (let i of res.data) {
txt += `\n\nTanggal: ${i.tanggal} ${i.bulan} ${res.tahun}\nEvent: ${i.event}`
}
mecha.reply(m.chat, txt.trim(), m)
})
},
limit: true
}