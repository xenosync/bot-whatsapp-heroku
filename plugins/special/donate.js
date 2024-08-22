exports.run = {
    usage: ['donate'],
    hidden: ['donasi'],
    category: 'special',
    async: async (m, { mecha, fpayment }) => {
        let caption = `Halo ${m.pushname}👋🏻

Kamu bisa mendukung agar bot ini tetap aktif dengan
⭝ Dana : 0895415497664 
⭝ Ovo : 0895415497664
⭝ Gopay : 0895415497664
⭝ Pulsa : 085702691440
⭝ Saweria : https://saweria.co/mechabot
⭝ Sociabuzz : https://sociabuzz.com/mechabot/tribe

Hasil donasi akan digunakan untuk membeli *Server Bot* agar bot dapat aktif 24 jam tanpa kendala.
Berapapun donasi kamu akan sangat berarti, Terimakasih!`;

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
