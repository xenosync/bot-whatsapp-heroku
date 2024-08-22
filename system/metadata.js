const func = require('./functions.js');

module.exports = async(mecha, update) => {
try {
if (!update.messages) return;
if (global.db.setting[mecha.user.jid] && global.db.setting[mecha.user.jid].maintenance) return;
let m = update.messages[update.messages.length - 1];
Object.defineProperty(m, 'name', {
value: 'Serialize',
configurable: true
})

if (!m) return;
const from = m.key.remoteJid;

if (!from.endsWith('@g.us')) return;
if (from.endsWith('@g.us')) {
function antiSpam(limit, timeFrame) {
let callCount = 0;
let lastCallTime = Date.now();

return async function() {
const now = Date.now();
if (now - lastCallTime < timeFrame) {
callCount++;
if (callCount > limit) {
mecha.sendMessage(global.owner, {
text: `Spam metadata detected in '${global.db.metadata[from].subject}' Function execution paused temporarily.`,
}, {
quoted: func.fstatus('System Notification'),
ephemeralExpiration: m.expiration || 86400
});
console.log('Spam detected! Function execution paused temporarily.');
return;
}
} else {
callCount = 1;
lastCallTime = now;
}

if (typeof global.db.metadata[from] == 'undefined') {
global.db.metadata[from] = await await mecha.groupMetadata(from).catch((_) => {});
console.log(`Pembuatan metadata pada: ${from} telah siap`)
}
const data = global.db.metadata[from];
const metadata = await await mecha.groupMetadata(from).catch((_) => {});
// Mengubah database metadata jika metadata mengalami perubahan
if (JSON.stringify(data) !== JSON.stringify(metadata)) {
global.db.metadata[from] = { ...metadata };
};
console.log('Function executed successfully.');
};
}

// Penggunaan function antiSpam dengan batas 3 panggilan per 5 detik
const spamProtectedFunction = antiSpam(3, 10000);

// Panggil fungsi yang dijaga dari spam
spamProtectedFunction();
}
} catch (err) {
console.error(err)
}
}

func.reloadFile(__filename)