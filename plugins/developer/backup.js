const fs = require('fs');

exports.run = {
usage: ['backup'],
category: 'owner',
async: async (m, { func, mecha, errorMessage }) => {
mecha.sendReact(m.chat, '🕒', m.key)
try {
await global.database.save(global.db);
await fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2))
await mecha.sendMessage(m.chat, {
document: fs.readFileSync('./database/database.json'), 
caption: `Database ${global.botName}`, 
mimetype: 'application/json', 
fileName: 'database.json'
}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (e) {
return errorMessage(e);
}
},
devs: true
}