exports.run = {
usage: ['restart'],
category: 'owner',
async: async (m, { func, mecha }) => {
await mecha.sendMessage(m.chat, {text: func.texted('monospace', 'Restarting...')}, {quoted: m, ephemeralExpiration: m.expiration}).then(async () => {
await global.database.save(global.db);
if (!process.send) return m.reply('Tidak dapat me-restart bot karena file `index.js` tidak dijalankan.')
process.send('reset');
})
},
devs: true
}