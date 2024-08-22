const fetch = require('node-fetch');

exports.run = {
    usage: ['rules'],
    hidden: ['rulesbot'],
    category: 'special',
    async: async (m, { mecha, setting }) => {
        const rules = {
            id: `乂  *PERATURAN ${global.botName.toUpperCase()}*

1. Data pengguna, grup, dan obrolan akan dihapus secara otomatis jika tidak ada aktivitas yang terdeteksi selama 7 hari (alasan: pembersihan database).

2. Pengguna gratis mendapatkan ${setting.limit} limit / hari dan akan direset jam 12 malam.

3. Pengguna premium dilarang memberikan balance / limit kepada pengguna gratis secara berlebihan.

4. Pengguna premium dilarang keras mentransfer balance ke nomor lain. jika melanggar akan mendapatkan sanksi berupa banned dan blokir.

5. Jangan spam, jeda setiap penggunaan perintah selama ${global.cooldown} detik.

6. Jangan mengisi data diri palsu saat melakukan register karena kalian akan mendapatkan sanksi berupa banned.

7. Jangan melakukan panggilan suara atau video (Telepon & Video Call), jika Anda melakukannya akan diblokir.

8. Jangan toxic kepada bot karena kalian akan mendapatkan sanksi berupa banned dan blokir.

9. Jangan mencari & membuat konten dewasa (+18), misal: membuat stiker dari foto bugil atau mencari desahan ASMR.

10. Jika ingin membuka blokir dan banned, masing-masing akan dikenakan biaya sebesar Rp. 5.000,-

11. Pelaku spam akan dibanned secara permanen untuk pengguna gratis dan premium (tidak ada pengembalian uang).

12. Semua Syarat & Ketentuan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.`,
            en: `乂  *RULES ${global.botName.toUpperCase()}*

1. User, group, and chat data will be deleted automatically if no activity is detected for 7 days (reason: database cleaning).

2. Free users get ${setting.limit} / day and will reset after 12 hours

3. Premium users are prohibited from giving excessive balance / limits to free users.

4. Premium users are strictly prohibited from transferring balances to other numbers. If you violate, you will receive sanctions in the form of being banned and blocked.

5. Don't spam, pause each command usage for ${global.cooldown} seconds.

6. Do not make voice or video calls (Telephone & Video Calls), if you do it will be blocked.

7. Don't fill in fake personal data when registering because you will get sanctions in the form of being banned.

8. Don't be toxic to bots because you will get sanctions in the form of being banned and blocked.

9. Don't search & create adult content (+18), eg: make stickers from nude photos or search for ASMR sighs.

10. If you want to unblock and unbanned, each will be charged a fee of Rp. 5,000,-

11. Spammers will be permanently banned for free and premium users (+ no refund).

12. All Terms & Conditions are subject to change at any time without prior notice.`
        }
        const txt = m.sender.startsWith('62') ? rules.id : rules.en;
        // Nonaktifkan fitur ini
        /*
        await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
            title: global.header,
            body: global.footer,
            thumbnail: await (await fetch(setting.cover)).buffer(),
            largeThumb: true, 
            expiration: m.expiration
        }) : m.reply(txt))
        */
    }
}
