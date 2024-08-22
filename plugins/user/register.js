const phoneNumber = require('awesome-phonenumber');
const fs = require('fs');
const fetch = require('node-fetch');

exports.run = {
usage: ['register'],
hidden: ['daftar'],
category: 'user',
async: async (m, { func, mecha, users }) => {
if (users.register) return m.reply('Nomor kamu sudah terverifikasi.')
if (typeof global.db.register[m.sender] !== 'undefined') return m.reply('Selesaikan register mu yang sebelumnya!')
let captcha = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/captcha.json').then(response => response.json())
let result = captcha.random();
let confirm = 'Reply pesan ini dengan mengetik kode OTP yang ada pada gambar!';
let { key } = await mecha.sendMessage(m.chat, {image: {url: result.image}, caption: confirm}, {quoted: func.fstatus('REGISTER USER (1/4)'), ephemeralExpiration: m.expiration})
global.db.register[m.sender] = {
id: m.sender, 
key: key,
sesi: 'captcha', 
otp: result.value,
name: 'not known', 
age: 'not known', 
gender: 'not known',
timeout: setTimeout(() => {
mecha.sendMessage(m.chat, { delete: key });
delete global.db.register[m.sender];
}, 60 * 1000)
}
},
main: async (m, { func, mecha, users, calender, setting }) => {
/* Function User Register By SuryaDev */
if (m.isPc && users && !users.register && typeof global.db.register[m.sender] !== 'undefined' && !m.fromMe) {
let data = Object.values(global.db.register).find(v => v.id.includes(m.sender))
if (data.sesi === 'captcha') {
if (!m.budy) return m.reply('Mohon masukkan kode OTP yang benar.')
if (m.isPrefix) return m.reply('Mohon masukkan kode OTP yang benar.')
if (m.budy == data.otp) {
await mecha.reply(m.chat, `Silahkan ketik nama kamu\nContoh: SuryaDev`, func.fstatus('REGISTER USER (2/4)'), {expiration: m.expiration})
data.sesi = 'name'
} else {
mecha.reply(m.chat, `❌ OTP Salah!\n@${m.sender.split('@')[0]} tidak di verifikasi!`, m, {expiration: m.expiration})
clearTimeout(data.timeout);
mecha.sendMessage(m.chat, { delete: data.key });
delete global.db.register[data.id];
}
} else if (data.sesi === 'name') {
if (!m.budy) return m.reply('Mohon masukkan keyword yang benar.')
if (m.isPrefix) return m.reply(`Nama tidak boleh menggunakan awalan ( ${m.prefix} )`)
data.name = func.toFirstCase(m.budy)
data.sesi = 'age'
await mecha.reply(m.chat, `Silahkan ketik umur kamu\nContoh: 19`, func.fstatus('REGISTER USER (3/4)'), {expiration: m.expiration})
} else if (data.sesi === 'age') {
if (!m.budy) return m.reply('Mohon masukkan keyword yang benar.')
if (m.isPrefix) return m.reply('Mohon masukkan keyword yang benar.')
if (isNaN(m.budy)) return m.reply(`Umur harus berupa angka!\nContoh: 19`)
if (Number(m.budy) > 60) {
global.db.users[data.id].banned = true;
global.db.users[data.id].expired.banned = 'PERMANENT';
delete global.db.register[data.id];
return m.reply('Maaf umur Anda terlalu tua untuk bisa menggunakan bot ini.\nSystem bot kami telah memblokir akun anda dengan alasan *old age.*\n\nJika ingin membuka banned akan dikenakan biaya sebesar Rp. 5.000.')
}
if (Number(m.budy) < 6) return m.reply('Bayi bisa ngetik sesuai format bjir ._.')
if (Number(m.budy) < 12) {
global.db.users[data.id].banned = true;
global.db.users[data.id].expired.banned = 'PERMANENT';
delete global.db.register[data.id];
return m.reply('Anda belum cukup umur untuk bisa menggunakan bot ini.\nSystem bot kami telah memblokir akun anda dengan alasan *child age.*\n\nJika ingin membuka banned akan dikenakan biaya sebesar Rp. 5.000.');
}
data.age = Number(parseInt(m.budy))
data.sesi = 'gender'
await mecha.reply(m.chat, `Silahkan ketik jenis kelamin kamu\nContoh: male\n\n_ketik *male* untuk Laki-laki_\n_ketik *female* untuk Perempuan_`, func.fstatus('REGISTER USER (3/4)'), {
expiration: m.expiration
})
} else if (data.sesi === 'gender') {
if (!m.budy) return m.reply('Mohon masukkan keyword yang benar.')
if (m.isPrefix) return m.reply('Mohon masukkan keyword yang benar.')
//if (func.somematch(['male', 'female'], m.budy)) return m.reply('Mohon gunakan huruf kapital.')
if (m.budy.toLowerCase() === 'male') {
data.gender = 'Laki-laki'
} else if (m.budy.toLowerCase() === 'female') {
data.gender = 'Perempuan'
} else {
return m.reply(`Mohon masukkan keyword yang benar!\nketik *male* untuk Laki-laki\nketik *female* untuk Perempuan`)
}
users.name = data.name;
users.age = data.age;
users.gender = data.gender;
users.register = true;
let name = data.name, age = data.age, gender = data.gender, number = phoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international');
let pictures = await (await fetch(setting.cover)).buffer();
let verified = `*✅ VERIFICATION SUCCESSFULLY*

» Name : ${name}
» Age : ${age}
» Gender : ${gender}
» Number : ${number}
» Date : ${calender}

> kirim *${m.prefix}unreg* jika data yang anda masukkan salah.`
let caption = `Users Registered\n\nName : ${name}\nAge : ${age}\nGender : ${gender}\nNumber : ${number}`
await mecha.sendMessageModify(m.chat, verified, null, {
title: global.header,
body: global.footer,
thumbnail: pictures,
largeThumb: true,
expiration: m.expiration
}).then(_ => delete global.db.register[m.sender]);
if (m.sender == global.owner) return
await mecha.sendMessage(global.owner, {document: fs.readFileSync('./database/database.json'), caption: caption, mimetype: 'application/json', fileName: 'database.json' })
}
}
},
private: true
}