const fetch = require('node-fetch');

exports.run = {
usage: ['ceknik'],
use: 'nik',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply('Input nik yang ingin kamu cek!')
if (isNaN(m.args[0])) return m.reply(func.example(m.cmd, '332004xxxxxxxxxx'))
if (m.args[0].toString().length !== 16) return m.reply('NIK harus 16 digit!')
let data = await fetch(`https://suryadev.vercel.app/api/ceknik?nik=${m.args[0]}`).then(response => response.json())
if (!data.status) return m.reply(data.message)
delete data.status;
delete data.creator;
delete data.message;
let txt = '乂  *C E K - N I K*\n\n'
for (let key in data.data) txt += `◦  ${func.ucword(key)} : ${data.data[key]}\n`
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
});
},
premium: true,
limit: 5
}