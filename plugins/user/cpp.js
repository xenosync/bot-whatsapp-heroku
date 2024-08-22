exports.run = {
usage: ['cpp'],
hidden: ['cpk'],
use: 'mention or reply',
category: 'user',
async: async (m, { func, mecha, froms }) => {
if (!froms) return m.reply(func.example(m.cmd, '@0'))
const penis = [
"0 cm Buset panjang bet",
"1 cm Buset pendek bet",
"2 cm Buset pendek bet",
"3 cm Buset pendek bet",
"4 cm Buset pendek bet",
"5 cm Hemm lumayan",
"6 cm Hemm lumayan hm",
"7 cm Heum terlalu panjang ya",
"8 cm Aduh jangan ditanya",
"9 cm Diluar nurul",
"10 cm Aku nak pegang dong",
"11 cm Bang?",
"12 cm Auah panjang bet",
"13 cm Ayo panjangin coli terus",
"14 cm Gass",
"15 cm Alamak",
]
let wait = await mecha.sendMessage(m.chat, {text: `sedang mengukur penis...`}, {quoted: null, ephemeralExpiration: m.expiration})
await func.delay(1000)
await mecha.sendMessage(m.chat, {
text: `panjang penis @${froms.split('@')[0]} adalah: ${penis.random()}`, 
mentions: [froms], 
edit: wait.key
}, {quoted: null, ephemeralExpiration: m.expiration})
},
limit: true
}