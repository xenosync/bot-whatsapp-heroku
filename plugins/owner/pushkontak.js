exports.run = {
usage: ['pushkontak'],
use: 'text',
category: 'owner',
async: async (m, { func, mecha }) => {
if (!m.text && !m.quoted) return m.reply('Input text or reply chat.')
let get = await m.metadata.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
let count = get.length;
let sentCount = 0;
m.reply(global.mess.wait)
for (let i = 0; i < get.length; i++) {
setTimeout(function() {
if (m.text) {
mecha.sendMessage(get[i], {text: m.text});
} else if (m.quoted) {
mecha.copyNForward(get[i], m.getQuotedObj(), false);
} else if (m.text && m.quoted) {
mecha.sendMessage(get[i], {text: m.text + '\n' + m.quoted.text});
}
count--;
sentCount++;
if (count === 0) {
m.reply(`Berhasil Push Kontak:\nJumlah pesan terkirim: *${sentCount}*`);
}
}, i * 1000); // delay setiap pengiriman selama 1 detik
}
},
owner: true
}