const axios = require('axios');

// Function to get recent earthquake data
const getGempaTerkini = async () => {
return new Promise(async (resolve, reject) => {
axios.get('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/information/gempa_terkini.json')
.then(({ data }) => {
resolve(data);
})
.catch(reject);
});
};

exports.run = {
usage: ['gempaterkini'],
use: 'text',
category: 'searching',
async: async (m, { func, mecha }) => {
let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
await getGempaTerkini().then(res => {
let txt = `乂 *G E M P A - T E R K I N I*\n\n`;
res.forEach(gempa => {
txt += `- Waktu: ${gempa.waktu}\n`;
txt += `- Lintang: ${gempa.lintang}\n`;
txt += `- Bujur: ${gempa.bujur}\n`;
txt += `- Magnitudo: ${gempa.magnitudo}\n`;
txt += `- Kedalaman: ${gempa.kedalaman}\n`;
txt += `- Wilayah: ${gempa.wilayah}\n\n`;
});
mecha.sendMessage(m.chat, { text: `${txt}`, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
}).catch(err => {
mecha.sendMessage(m.chat, { text: `Error: ${err.message}`, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
});
},
limit: true
}