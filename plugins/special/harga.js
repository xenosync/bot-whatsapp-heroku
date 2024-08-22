exports.run = {
    usage: ['buyprem', 'sewabot'],
    hidden: ['premium', 'sewa'],
    category: 'special',
    async: async (m, { func, mecha, setting }) => {
        let caption;
        if (func.somematch(['buyprem', 'premium'], m.command)) {
            caption = `「 *LIST HARGA PREMIUM* 」

*PAKET P1*
- Rp5.000 / 7 Day
- Unlock Feature Premium
- Unlimited Limit

*PAKET P2*
- Rp10.000 / 15 Day
- Unlock Feature Premium
- Unlimited Limit

*PAKET P3*
- Rp20.000 / 30 Day
- Perpanjang Rp15.000 (hemat 25%)
- Unlock Feature Premium
- Unlimited Limit

*PAKET P4*
- Rp30.000 / 60 Day
- Perpanjang Rp25.000 (hemat 17%)
- Unlock Feature Premium
- Unlimited Limit

*PAYMENT*
> • Dana : 0895415497664
> • Ovo : 0895415497664
> • Gopay : 0895415497664
> • QRIS (All Payment)

*INFORMATION*
> 1. Melakukan pembelian artinya anda setuju dengan segala kebijakan kami.
> 2. Semua pembelian bergaransi.
> 3. Tidak puas dengan layanan kami? Kami kembalikan uang Anda 100% dalam jangka waktu 1 jam setelah pembelian.
> 4. Jika bot mengalami kendala atau perbaikan hingga 24 jam atau lebih, kami berikan kompensasi berupa penambahan waktu sewa.
> 5. Perpanjangan hanya berlaku jika masa aktif tersisa kurang dari 3 hari.

Berminat? Hubungi :
wa.me/${global.owner.replace(/[^0-9]/g, '')}`;
        } else if (func.somematch(['sewabot', 'sewa'], m.command)) {
            caption = `「 *LIST HARGA SEWA BOT* 」

*PAKET S1*
- Rp15.000 / Group
- Perpanjang Rp10.000
- Masa aktif 15 Hari

*PAKET S2*
- Rp25.000 / Group
- Perpanjang Rp20.000 (hemat 25%)
- Masa aktif 1 Bulan

*PAKET S3*
- Rp40.000 / Group
- Perpanjang Rp35.000 (hemat 15%)
- Masa aktif 2 Bulan
- Anda hemat Rp5.000

*PAKET S4*
- Rp50.000 / Group
- Perpanjang Rp45.000 (hemat 10%)
- Masa aktif 3 Bulan
- Anda hemat Rp10.000

*KEUNTUNGAN*
- Fast respon
- Bot on 24 jam
- Antilink (auto kick yg kirim link)
- Antivirtex (auto kick yg kirim virtex)
- Welcome (menyambut member baru)
- Games
- Menfess
- Downloader
- Ai (artificial intelligence)
- Dan masih banyak lagi

*PAYMENT*
• Dana : 0895415497664
• Ovo : 0895415497664
• Gopay : 0895415497664
• QRIS (All Payment)

*INFORMATION*
> 1. Melakukan pembelian artinya anda setuju dengan segala kebijakan kami.
> 2. Semua pembelian bergaransi.
> 3. Tidak puas dengan layanan kami? Kami kembalikan uang Anda 100% dalam jangka waktu 1 jam setelah pembelian.
> 4. Jika bot mengalami kendala atau perbaikan hingga 24 jam atau lebih, kami berikan kompensasi berupa penambahan waktu sewa.
> 5. Perpanjangan hanya berlaku jika masa aktif tersisa kurang dari 3 hari.

Berminat? Hubungi :
wa.me/${global.owner.replace(/[^0-9]/g, '')}`;
        }
        
        // Nonaktifkan fitur ini
        /*
        mecha.sendMessage(m.chat, {
            image: {
                url: global.qrisUrl
            }, 
            caption: caption
        }, {quoted: m, ephemeralExpiration: m.expiration});
        */
    }
}
