const axios = require('axios');

const ktpMaker = async (nik, name, ttl, jk, jl, rtrw, lurah, camat, prov, kabu, agama, nikah, kerja, warga, until, img) => {
let url = `https://api.lolhuman.xyz/api/ktpmaker?apikey=Gatadios&nik=${nik}&prov=${prov}&kabu=${kabu}&name=${name}&ttl=${ttl}&jk=${jk}&jl=${jl}&rtrw=${rtrw}&lurah=${lurah}&camat=${camat}&agama=${agama}&nikah=${nikah}&kerja=${kerja}&warga=${warga}&until=${until}&img=${img}`;
try {
let res = await axios({
method: 'GET', 
url: url, 
headers: {
'DNT': 1, 
'Upgrade-Insecure-Request': 1
}, 
responseType: 'arraybuffer'
});
return { status: true, image: res.data }
} catch (err) {
return { status: false, message: err }
}
};

exports.run = {
usage: ['ktpmaker'],
hidden: ['buatktp'],
use: 'text',
category: 'tools',
async: async (m, { func, mecha, quoted }) => {
if (!/image\/(jpe?g|png)/.test(quoted.mime)) return m.reply(`Kirim/Reply foto dengan caption ${m.cmd}`)
if (!m.text) return m.reply(`Pengunaan :\n${m.prefix + m.command} Nik|Provinsi|Kabupaten|Nama|TempatTanggalLahir|JenisKel|Alamat|Rt/Rw|KelDesa|Kecamatan|Agama|Status|Pekerjaan|Region|Berlaku\n\nContoh : ${m.prefix + m.command} 9999999999|Jawa Tengah|Jepara|Surya|Jepara, 21 Mei 2005|Laki-laki|Desa Sengonbugel|03/03|Sengonbugel|Mayong|Islam|Pacaran|Wirausaha|Indonesia|Seumur Hidup`)
let [nik, prov, kabu, name, ttl, jk, jl, rtrw, lurah, camat, agama, nikah, kerja, warga, until] = m.text.split('|');
if (!nik) return m.reply('Nomor induk keluaga kak pastikan jangan mirip NIK yang asli ya')
if (!prov) return m.reply('Provinsi mana kak')
if (!kabu) return m.reply('Kabupaten mana kak')
if (!name) return m.reply('Nama nya siapa kak')
if (!ttl) return m.reply('Tempat tanggal lahir nya kak')
if (!jk) return m.reply('Jenis kelamin pria atau wanita kak')
if (!jl) return m.reply('Alamat rumah nya mana kak')
if (!rtrw) return m.reply('RT / RW berapa kak')
if (!lurah) return m.reply('Kelurahan mana kak')
if (!camat) return m.reply('Kecamatan mana kak')
if (!agama) return m.reply('Agama nya apa kak')
if (!nikah) return m.reply('Status belum ada')
if (!kerja) return m.reply('Pekerjaan belum ada')
if (!warga) return m.reply('Region belum ada')
if (!until) return m.reply('Waktu berlaku belum ada')
m.reply(global.mess.wait)
try {
let media = await mecha.downloadAndSaveMediaMessage(quoted)
let anu = await func.UploadFileUgu(media)
let res = await ktpMaker(nik || '-', name || '-', ttl || '-', jk || '-', jl || '-', rtrw || '-', lurah || '-', camat || '-', prov || '-', kabu || '-', agama || '-', nikah || '-', kerja || '-', warga || '-', until || '-', anu.url)
if (!res.status) return m.reply('Maaf terjadi kesalahan!')
await mecha.sendMessage(m.chat, {image: res.image, caption: mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (e) {
console.log(e)
return mecha.reply(m.chat, 'Error: Create Failed')
}
},
premium: true,
limit: 5
}