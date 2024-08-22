exports.run = {
usage: ['spam'],
use: 'number,text,amount',
category: 'tools',
async: async (m, { func, mecha, quoted }) => {
mecha.spamming = mecha.spamming ? mecha.spamming : {};
if (m.sender in mecha.spamming) return m.reply('Masih ada proses yang sedang dijalankan, silahkan tunggu.');
if (!m.text) return m.reply(`Contoh Pengunaan :\n${m.cmd} number,text,amount\nContoh:\n\n${m.cmd} 62xxx,sayang,30`)
let [target, text, amount] = m.text.split(',')
target = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
if (!(target && text && amount)) return m.reply(`Contoh Pengunaan :\n${m.cmd} number,text,amount\nContoh:\n\n${m.cmd} 62xxx,sayang,30`)
if (isNaN(amount)) return m.reply(`Harus nomor kocak!`)
if (Number(amount) > 100) return m.reply('Max 100 amount')
mecha.spamming[m.sender] = true;
m.reply('Wait sedang menyepam...')
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
var media = await quoted.download()
for (let i = 0; i < amount; i++) {
mecha.sendMessage(target, {image: media, caption: text}, {ephemeralExpiration: m.expiration})
await func.delay(500)
}
delete mecha.spamming[m.sender];
m.reply(`Successfully sent ${amount} spam to target.`)
} else if (/video/.test(quoted.mime)) {
var media = await quoted.download()
for (let i = 0; i < amount; i++) {
mecha.sendMessage(target, {video: media, caption: text}, {ephemeralExpiration: m.expiration})
await func.delay(500)
}
delete mecha.spamming[m.sender];
m.reply(`Successfully sent ${amount} spam to target.`)
} else if (/webp/.test(quoted.mime)) {
var media = await m.quoted.download()
for (let i = 0; i < amount; i++) {
mecha.sendMessage(target, {sticker: media}, {quoted: func.fstatus(text), ephemeralExpiration: m.expiration})
await func.delay(500)
}
delete mecha.spamming[m.sender];
m.reply(`Successfully sent ${amount} spam to target.`)
} else if (/audio/.test(quoted.mime)) {
var media = await m.quoted.download()
for (let i = 0; i < amount; i++) {
mecha.sendMessage(target, {audio: media, mimetype: 'audio/mpeg', ptt: true}, {quoted: func.fstatus(text), ephemeralExpiration: m.expiration})
await func.delay(500)
}
delete mecha.spamming[m.sender];
m.reply(`Successfully sent ${amount} spam to target.`)
} else {
for (let i = 0; i < amount; i++) {
await mecha.sendMessage(target, {text: text, mentions: mecha.ments(text)}, {ephemeralExpiration: m.expiration})
}
delete mecha.spamming[m.sender];
m.reply(`Successfully sent ${amount} spam to target.`)
};
},
premium: true
}