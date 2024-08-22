const fs = require('fs');
const path = require('path');

exports.run = {
usage: ['saveplugin'],
hidden: ['sp'], 
use: 'path + reply code',
category: 'owner',
async: async (m, { func, mecha, quoted }) => {
if (!m.text) return m.reply(`Mau simpan plugin di path apa?`);
if (!m.quoted) return m.reply(`Mau simpan plugin dengan command apa? reply teks script nya!`);
try {
let data;
if (/application\/javascript/.test(quoted.mime)) data = await quoted.download();
else data = m.quoted.text;
fs.writeFileSync(path.join(process.cwd(), 'plugins', `${m.text}.js`), data);
await mecha.sendReact(m.chat, '✅', m.key)
} catch (e) {
m.reply(global.mess.error.api);
}
},
devs: true
}