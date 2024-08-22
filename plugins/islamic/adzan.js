let axios = require('axios');
let moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id');

async function getJadwalSholat(kota) {
    try {
        const response = await axios.get(`https://api.agatz.xyz/api/jadwalsholat?kota=${encodeURIComponent(kota)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

function calculateTimeDifference(currentTime, prayerTime) {
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [prayerHour, prayerMinute] = prayerTime.split(':').map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const prayerTotalMinutes = prayerHour * 60 + prayerMinute;
    const difference = prayerTotalMinutes - currentTotalMinutes;
    return difference >= 0 ? difference : difference + 24 * 60;
}

function getNextPrayer(prayerTimes, now) {
    let closestPrayer = null;
    let closestTimeDifference = Infinity;
    for (let prayer in prayerTimes) {
        const timeDifference = calculateTimeDifference(now.format('HH:mm'), prayerTimes[prayer]);
        if (timeDifference < closestTimeDifference) {
            closestTimeDifference = timeDifference;
            closestPrayer = prayer;
        }
    }
    return { prayer: closestPrayer, minutesLeft: closestTimeDifference };
}

exports.run = {
    usage: ['adzan'],
    use: 'kota',
    category: 'islamic',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'jepara'));
        mecha.sendReact(m.chat, '🕒', m.key);
        const jadwalSholat = await getJadwalSholat(m.text);
        if (!jadwalSholat || jadwalSholat.status !== 200) return m.reply('Maaf terjadi kesalahan.');
        const data = jadwalSholat.data;
        if (!data) return m.reply('Maaf, data tidak ditemukan.');
        
        // Perbarui waktu saat ini dengan menggunakan moment
        const now = moment();
        
        let txt = `*JADWAL ADZAN KOTA ${m.text.toUpperCase()}*\n`;
        txt += `*${now.format('dddd, DD-MM-YYYY')}*\n\n`;
        
        for (let key in data) txt += `◦ ${func.ucword(key)}: ${data[key]}\n`;
        
        // Perbarui waktu saat ini sebelum menghitung waktu sisa
        const nextPrayer = getNextPrayer(data, now);
        
        if (nextPrayer && nextPrayer.prayer) {
            const hours = Math.floor(nextPrayer.minutesLeft / 60);
            const minutes = nextPrayer.minutesLeft % 60;
            const timeLeft = hours > 0 ? `${hours} jam ${minutes} menit` : `${minutes} menit`;
            txt += `\nAdzan terdekat: *${func.ucword(nextPrayer.prayer)}*\nDalam: ${timeLeft}.`;
        }
        
        mecha.reply(m.chat, txt.trim(), m);
        mecha.sendReact(m.chat, '✅', m.key);
    }
};