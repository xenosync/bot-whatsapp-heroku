const path = require('path');
const fs = require('fs');

exports.run = {
usage: ['getplugin'],
hidden: ['gp'],
use: 'path',
category: 'owner',
async: async (m, { func, mecha, plugins }) => {
try {
if (!m.text) return m.reply(`Format salah!\nContoh : *${m.cmd} special/ping*`);
let plugin = fs.readFileSync(path.join(process.cwd(), 'plugins', m.text + '.js'), 'utf-8')
mecha.sendMessage(m.chat, {text: plugin}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (e) {
m.reply(`Plugin '${m.text}' tidak ditemukan!\n\n${Object.keys(plugins).map(v => v?.replace('plugins/', '')).join('\n')}`);
}
},
devs: true
}