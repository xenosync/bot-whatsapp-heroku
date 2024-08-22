const fs = require('fs');
const path = require('path');

exports.run = {
usage: ['delplugin'],
hidden: ['dp'],
use: 'path',
category: 'owner',
async: async (m, { func, mecha, plugins }) => {
if (!m.text) return m.reply(`Format salah!\nContoh : *${m.cmd} special/ping*`);
try {
let cmd = fs.existsSync(path.join(process.cwd(), 'plugins', `${m.text}.js`))
if (!cmd) return m.reply(`Plugin '${m.text}' tidak ditemukan!\n\n${Object.keys(plugins).map(v => v?.replace('plugins/', '')).join('\n')}`);
await fs.unlinkSync(path.join(process.cwd(), 'plugins', `${m.text}.js`));
await mecha.sendReact(m.chat, '✅', m.key)
} catch (e) {
m.reply(global.mess.error.api);
}
},
devs: true
}