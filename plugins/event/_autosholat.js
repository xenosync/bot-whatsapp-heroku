exports.run = {
    main: async (m, { func, mecha, setting }) => {
        mecha.autosholat = mecha.autosholat ? mecha.autosholat : {};
        let id = m.chat;
        if (id in mecha.autosholat) {
            return false;
        }
        // jadwal sholat wilayah jakarta dan sekitarnya
        let jadwalSholat = {
            Subuh: '04:40',
            Dhuhur: '12:00',
            Ashar: '15:11',
            Maghrib: '18:03',
            Isya: '19:12',
        };
        let date = new Date(new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta'
        }));
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Nonaktifkan fitur ini
        for (let [sholat, waktu] of Object.entries(jadwalSholat)) {
            if (timeNow === waktu) {
                // Komentar kode pengiriman pesan
                /*
                let txt = `Selamat menunaikan ibadah sholat ${sholat}`;
                mecha.autosholat[id] = [
                    mecha.sendMessage(m.chat, {
                        audio: {
                            url: 'https://cdn.filestackcontent.com/KUVE2KRaQUuoNDH08JmM'
                        },
                        mimetype: 'audio/mpeg',
                        ptt: true,
                        contextInfo: {
                            mentionedJid: [m.sender], 
                            externalAdReply: {
                                title: txt,
                                body: `${waktu} untuk wilayah Jakarta dan sekitarnya`,
                                mediaType: 1,
                                previewType: 'PHOTO', 
                                sourceUrl: '',
                                thumbnailUrl: setting.cover,
                                renderLargerThumbnail: true
                            }
                        }
                    }, {quoted: null, ephemeralExpiration: m.expiration}),
                    setTimeout(() => {
                        delete mecha.autosholat[id];
                    }, 1000 * 60 * 5)
                ];
                */
            }
        }
    }
}
