exports.run = {
usage: ['cekme', 'apakah', 'bisakah', 'kapankah', 'bagaimanakah', 'rate', 'gantengcek', 'cantikcek', 'sangecek', 'gaycek', 'lesbicek'],
category: 'user',
async: async (m, { func, mecha, setting }) => {
switch (m.command) {
case 'cekme':
let cakep = ['Cakep ✅','Jelek Anjrit ❌']
let sifat = ['Pembohong','Galak','Suka Bantu Orang','Baik','Jahat:(','Bobrok','Suka BadMood','Setia','Tulus','Beriman','Penyayang Binatang','Baperan']
let suka = ['Makan','Tidur','Main Game','Sesama Jenis','Binatang',`Seseorang Yang ${m.pushname} Sukai`,'Belajar','Ibadah','Diri Sendiri']
let nomernyah = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','31','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','82','84','84','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
let ganz = cakep[Math.floor(Math.random() * cakep.length)]
let sipat = sifat[Math.floor(Math.random() * sifat.length)]
let gai = suka[Math.floor(Math.random() * suka.length)]
let numb = nomernyah[Math.floor(Math.random() * nomernyah.length)]
let berani = nomernyah[Math.floor(Math.random() * nomernyah.length)]
let pinter = nomernyah[Math.floor(Math.random() * nomernyah.length)]
//let profile = await mecha.getpp(m.sender)
let txt = `乂  *CEK PRIBADI KAMU*

Nama : ${m.pushname}
Sifat : ${m.sender == global.owner ? 'Setia' : sipat}
Keberanian : ${berani}%
Ketakutan : ${numb}%
Cakep : ${m.sender == global.owner ? 'Cakep ✅' : ganz}
Cek Pintar : ${pinter}%
Menyukai : ${gai}`
mecha.sendMessage(m.chat, {text: txt}, {quoted: m, ephemeralExpiration: m.expiration});
/*mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: profile, 
largeThumb: true
})*/
break
case 'apakah':
if (!m.text) return m.reply(`Gunakan dengan cara ${m.cmd} text\n\nContoh : ${m.prefix + m.command} kamu lonteh`)
let apakah = ['Iya', 'Tidak', 'Bisa Jadi', 'Betul','Bisa Jadi Tidak']
m.reply(`Pertanyaan : apakah ${m.text}\nJawaban : ${apakah.random()}`)
break
case 'bisakah':
if (!m.text) return m.reply(`Gunakan dengan cara ${m.prefix + m.command} text\n\nContoh : ${m.prefix + m.command} saya punya cewe`)
let bisakah = ['Bisa','Gak Bisa','Gak Bisa Ajg Awokwokak','TENTU PASTI KAMU BISA!!!!','TENTU, PASTI KAMU *TIDAK* BISA!!']
m.reply(`Pertanyaan : bisakah ${m.text}\nJawaban : ${bisakah.random()}`)
break
case 'kapankah':
if (!m.text) return m.reply(`Gunakan dengan cara ${m.prefix + m.command} Pertanyaan\n\nContoh : ${m.prefix + m.command} saya punya cewe`)
let kapankah = ['5 Hari Lagi', '10 Hari Lagi', '15 Hari Lagi', '20 Hari Lagi', '25 Hari Lagi', '30 Hari Lagi', '35 Hari Lagi', '40 Hari Lagi', '45 Hari Lagi', '50 Hari Lagi', '55 Hari Lagi', '60 Hari Lagi', '65 Hari Lagi', '70 Hari Lagi', '75 Hari Lagi', '80 Hari Lagi', '85 Hari Lagi', '90 Hari Lagi', '100 Hari Lagi', '5 Bulan Lagi', '10 Bulan Lagi', '15 Bulan Lagi', '20 Bulan Lagi', '25 Bulan Lagi', '30 Bulan Lagi', '35 Bulan Lagi', '40 Bulan Lagi', '45 Bulan Lagi', '50 Bulan Lagi', '55 Bulan Lagi', '60 Bulan Lagi', '65 Bulan Lagi', '70 Bulan Lagi', '75 Bulan Lagi', '80 Bulan Lagi', '85 Bulan Lagi', '90 Bulan Lagi', '100 Bulan Lagi', '1 Tahun Lagi', '2 Tahun Lagi', '3 Tahun Lagi', '4 Tahun Lagi', '5 Tahun Lagi', 'Besok', 'Lusa', `Abis Ini Juga Lu ${m.text}`]
m.reply(`Pertanyaan : kapankah ${m.text}\nJawaban : *${kapankah.random()}*`)
break
case 'bagaimanakah':
if (!m.text) return m.reply(`Gunakan dengan cara ${m.prefix + m.command} text\n\nContoh : ${m.prefix + m.command} cara punya cewe`)
let gimana = [
'Ga Gimana2', 
'Sulit Itu Bro', 
'Maaf Bot Tidak Bisa Menjawab', 
'Coba Deh Cari Di Gugel', 
'Astaghfirallah Beneran???', 
'Pusing ah', 
'Ooh Gitu', 
'Yang Sabar Ya Bos', 
'Gimana yeee'
]
m.reply(`Pertanyaan : bagaimanakah ${m.text}\nJawaban : ${gimana.random()}`)
break
case 'rate':
if (!m.text) return m.reply(`Gunakan dengan cara ${m.prefix + m.command} text\n\nContoh : ${m.prefix + m.command} kebesaran tytydku`)
let rate = (Math.floor(Math.random() * 100))
m.reply(`Rate : ${m.text}\nJawaban : *${rate * 1}%*`)
break
case 'gantengcek':
case 'cantikcek':
case 'sangecek':
case 'gaycek':
case 'lesbicek':
if (!m.text) return m.reply(`Gunakan dengan cara ${m.prefix + m.command} @tag\n\nContoh : ${m.prefix + m.command} @0`)
let sange = (Math.floor(Math.random() * 100))
m.reply(`Nama : ${m.text}\nJawaban : *${sange * 1}%*`)
break
}
},
limit: true
}