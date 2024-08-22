const axios = require('axios');
const cheerio = require('cheerio');

async function nomorhoki(nomor) {
try {
const response = await axios.post('https://www.primbon.com/no_hoki_bagua_shuzi.php', new URLSearchParams({
nomer: nomor,
submit: 'Submit!'
}));

const fetchText = cheerio.load(response.data)('#body').text().trim();
let result;

if (fetchText.includes('No. HP :')) {
result = {
status: true,
creator: 'SuryaDev',
nomor_hp: fetchText.split('No. HP : ')[1].split('\n')[0],
angka_bagua_shuzi: fetchText.split('Angka Bagua Shuzi : ')[1].split('\n')[0],
energi_positif: {
kekayaan: fetchText.split('Kekayaan = ')[1].split('\n')[0],
kesehatan: fetchText.split('Kesehatan = ')[1].split('\n')[0],
cinta: fetchText.split('Cinta/Relasi = ')[1].split('\n')[0],
kestabilan: fetchText.split('Kestabilan = ')[1].split('\n')[0],
persentase: fetchText.split('Kestabilan = ')[1].split('% = ')[1].split('ENERGI NEGATIF')[0]
},
energi_negatif: {
perselisihan: fetchText.split('Perselisihan = ')[1].split('\n')[0],
kehilangan: fetchText.split('Kehilangan = ')[1].split('\n')[0],
malapetaka: fetchText.split('Malapetaka = ')[1].split('\n')[0],
kehancuran: fetchText.split('Kehancuran = ')[1].split('\n')[0],
persentase: fetchText.split('Kehancuran = ')[1].split('% = ')[1].split("\n")[0]
},
notes: fetchText.split('* ')[1].split('Masukan Nomor HP Anda')[0]
};
} else {
result = { 
status: false, 
creator: 'SuryaDev',
msg: `Nomor "${nomor}" tidak valid` 
};
}

return result;
} catch (error) {
throw error;
}
}

exports.run = {
usage: ['nomorhoki'],
hidden: ['nohoki'],
use: 'phone number',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, '089xxxxx'))
if (isNaN(m.text)) return m.reply('Nomor telepon harus berupa angka!')
mecha.sendReact(m.chat, '🕒', m.key)
await nomorhoki(m.text).then(res => {
if (!res.status) return m.reply(res.msg)
let txt = '乂  *N O M O R - H O K I*\n\n'
txt += `Nomor Hp : ${res.nomor_hp}\n`
txt += `Angka Bagua Shuzi : ${res.angka_bagua_shuzi}\n\n`
txt += '*ENERGI POSITIF*\n'
for (let key in res.energi_positif) txt += `${func.ucword(key)} : ${res.energi_positif[key]}\n`
txt += '\n*ENERGI NEGATIF*\n'
for (let key in res.energi_negatif) txt += `${func.ucword(key)} : ${res.energi_negatif[key]}\n`
txt += `\nNotes :\n> ${res.notes}`
mecha.reply(m.chat, txt, m)
}).catch((e) => m.reply(String(e)))
},
limit: true
}