const axios = require('axios');

exports.run = {
usage: ['terabox'],
hidden: ['tbxdl'],
use: 'link terabox',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'link'));
mecha.sendReact(m.chat, '🕒', m.key)
try {
const url = `https://tera.instavideosave.com/?url=${encodeURIComponent(m.text)}`;
await mecha.sendMessage(m.chat, `Here is your download link: ${url}`);
await mecha.sendReact(m.chat, '✅', m.key);
} catch (error) {
console.error('Error:', error);
const errorMessage = error.message ? error.message : String(error)
m.reply(`Internal Error: ${errorMessage}\n\nFull Error: ${JSON.stringify(error, null, 2)}`);
}
},
premium: true,
limit: 3
};