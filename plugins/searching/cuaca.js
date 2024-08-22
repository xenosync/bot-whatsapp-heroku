let axios = require('axios');
let moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id');

async function getCuaca(kota) {
try {
const response = await axios.get(`https://api.agatz.xyz/api/cuaca?message=${encodeURIComponent(kota)}`);
return response.data;
} catch (error) {
console.error('Error fetching weather data:', error);
return null;
}
}

exports.run = {
usage: ['cuaca'],
hidden: ['weather'],
use: 'kota',
category: 'information',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'medan'));
mecha.sendReact(m.chat, '🕒', m.key);
const cuaca = await getCuaca(m.text);
if (!cuaca || cuaca.status !== 200) {
return m.reply('Maaf terjadi kesalahan.');
}

const data = cuaca.data;
const location = data.location;
const current = data.current;

if (!data) {
return m.reply('Maaf, data tidak ditemukan.');
}

let txt = `乂 *CUACA ${location.name.toUpperCase()}*\n`;
txt += `\n◦  Lokasi: ${location.name}, ${location.region}, ${location.country}`;
txt += `\n◦  Waktu Lokal: ${location.localtime}`;
txt += `\n◦  Suhu: ${current.temp_c}°C (${current.temp_f}°F)`;
txt += `\n◦  Kondisi: ${current.condition.text}`;
txt += `\n◦  Kelembaban: ${current.humidity}%`;
txt += `\n◦  Kecepatan Angin: ${current.wind_kph} kph (${current.wind_mph} mph)`;
txt += `\n◦  Arah Angin: ${current.wind_dir}`;
txt += `\n◦  Tekanan: ${current.pressure_mb} mb (${current.pressure_in} in)`;
txt += `\n◦  Presipitasi: ${current.precip_mm} mm (${current.precip_in} in)`;
txt += `\n◦  Indeks UV: ${current.uv}`;
txt += `\n◦  Jarak Pandang: ${current.vis_km} km (${current.vis_miles} miles)`;
mecha.reply(m.chat, txt.trim(), m, {
expiration: m.expiration
});
},
limit: true
}