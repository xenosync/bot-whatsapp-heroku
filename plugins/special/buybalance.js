exports.run = {
    usage: ['buybalance'],
    hidden: ['topupbalance'],
    category: 'special',
    async: async (m, { func, mecha }) => {
        const fpayment = {
            key: {
                remoteJid: '0@s.whatsapp.net',
                fromMe: false,
                id: 'TOP UP BALANCE',
                participant: '0@s.whatsapp.net'
            },
            message: {
                requestPaymentMessage: {
                    currencyCodeIso4217: "IDR",
                    amount1000: 5000000,
                    requestFrom: '0@s.whatsapp.net',
                    noteMessage: {
                        extendedTextMessage: {
                            text: 'TOP UP BALANCE'
                        }
                    },
                    expiryTimestamp: 999999999,
                    amount: {
                        value: 2000000000,
                        offset: 1000,
                        currencyCode: "IDR"
                    }
                }
            }
        };

        let txt = `乂  *T O P U P - B A L A N C E*

        *Paket B1*
        Rp.5.000 / $20.000.000 balance
        *Paket B2*
        Rp.10.000 / $100.000.000 balance
        *Paket B3*
        Rp.15.000 / $150.000.000 balance
        *Paket B4*
        Rp.20.000 / $200.000.000 balance

        *PAYMENT*
        - Dana : 0895415497664
        - Ovo : 0895415497664
        - Gopay : 0895415497664
        - Pulsa : 085702691440
        - QRIS (All Payment)

        *INFORMATION*
        _Melakukan top up balance artinya anda_
        _setuju dengan segala kebijakan kami_

        _*Contact Owner*_
        wa.me/62882003321562`;

        // Nonaktifkan fitur ini
        /*
        mecha.sendMessage(m.chat, {text: txt}, {quoted: fpayment, ephemeralExpiration: m.expiration});
        */
    }
}
