const axios = require('axios');

// STALKER ML
const stalkml = async(id, zoneId) => {
return new Promise(async (resolve, reject) => {
axios
.post(
'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
new URLSearchParams(
Object.entries({
productId: '1',
itemId: '2',
catalogId: '57',
paymentId: '352',
gameId: id,
zoneId: zoneId,
product_ref: 'REG',
product_ref_denom: 'AE',
})
),
{
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
Referer: 'https://www.duniagames.co.id/',
Accept: 'application/json',
},
}
)
.then((response) => {
resolve({
status: 200,
creator: 'Surya',
id: id,
zoneId: zoneId,
nickname: response.data.data.gameDetail.userName
})
})
.catch((err) => {
resolve({
status: 404,
creator: 'Surya',
msg: 'User Id or ZoneId Not Found'
})
})
})
}

exports.run = {
usage: ['mlstalk'],
hidden: ['stalkml'],
use: 'id zoneid',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.args[1]) return m.reply(func.example(m.cmd, '382948365 9782'))
await stalkml(m.args[0], m.args[1]).then(data => {
if (data.status == 404) return m.reply(data.msg) //m.reply('Error ID tidak ditemukan\nSilahkan kirim ID yang valid!')
let txt = `乂  *STALKER MOBILE LEGENDS*\n`
txt += `\n◦  *ID:* ${data.id}`
txt += `\n◦  *Zone ID:* ${data.zoneId}`
txt += `\n◦  *Username:* ${data.nickname}`
mecha.reply(m.chat, txt, m)
})
},
limit: true
}