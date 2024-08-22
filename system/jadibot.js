const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const { Baileys, InvCloud } = require('./baileys');
const { groupAdd, groupRemove } = new (require('./groups.js'));
const moment = require('moment-timezone');
const fs = require('fs');
const chalk = require('chalk');
const func = require('./functions.js');

module.exports = class Jadibot {
fstatus = func.fstatus('Jadibot Notification');
expiration = 86400;
keyId = null;
connecting = true;

Jadibot = (options = {}) => {
const mecha = options ? options.mecha : false;
const number = options ? options.number : false;
const state = options ? options.state : false;
const now = Date.now();
const session = 'jadibot/session-' + number.split('@')[0];
let settings = global.db.jadibot.find(v => v.number === number)

const socket = new Baileys({
pairing: {
status: state,
number: number
},
// jangan diubah, v2 untuk jadibot dan v1 untuk bot utama
type: 'mecha-v2',
session: session,
online: true,
version: [2, 2413, 51],
browser: ['Windows', 'Chrome', '20.0.04']
})

socket.try = 0;

/* starting pairing code */
socket.on('pairing', async data => {
socket.try++;
console.log('Mencoba koneksi:', socket.try)
if (socket.try > 3) {
mecha.reply(number, 'Pairing code tidak dimasukkan lebih dari 3 kali, jadibot stopped.', this.fstatus, {
expiration: this.expiration
})
const client = global.jadibot[number] ? global.jadibot[number] : Object.values(global.jadibot).find(v => v?.user?.id?.split(':')[0] == number.replace(/[^0-9]/g, ''))
if (settings && typeof client !== 'undefined') {
delete global.jadibot[number];
settings.status = false;
await client.end();
client.ws.close();
fs.rmSync(session, { recursive: true, force: true });
}
return false;
}
if (this.keyId == null) {
const key = await mecha.sendButton(number, 'Masukkan kode dibawah untuk jadi bot sementara', '1. klik titik tiga di pojok kanan atas\n2. klik "Perangkat tertaut"\n3. klik "Tautkan Perangkat"\n4. klik "Tautkan dengan nomor telepon saja"\n5. masukkan 6 digit kode di bawah', 'Your Pairing Code :', [['copy', 'Copy Code', data.code]], this.fstatus, {
expiration: this.expiration
})
this.keyId = key;
} else {
await mecha.sendMessage(number, {delete: {remoteJid: number, id: this.keyId, fromMe: true, participant: mecha.user.jid}})
const key = await mecha.sendButton(number, 'Masukkan kode dibawah untuk jadi bot sementara', '1. klik titik tiga di pojok kanan atas\n2. klik "Perangkat tertaut"\n3. klik "Tautkan Perangkat"\n4. klik "Tautkan dengan nomor telepon saja"\n5. masukkan 6 digit kode di bawah', 'Your Pairing Code :', [['copy', 'Copy Code', data.code]], this.fstatus, {
expiration: this.expiration
})
this.keyId = key;
}
})

/* starting to connect */
socket.on('connect', async data => {
if (data && typeof data === 'object' && data.message && settings.notify) {
if (data.message == 'Connecting . . .' && this.connecting) {
this.connecting = false;
mecha.reply(number, data.message, this.fstatus, {
expiration: this.expiration
})
} else {
mecha.reply(number, data.message, this.fstatus, {
expiration: this.expiration
}).then(() => settings.notify = false)
}
}
})

/* print error */
socket.on('error', async error => {
console.log(chalk.redBright.bold(error.message))
if (error && typeof error === 'object' && error.message) return /*mecha.reply(number, error.message, this.fstatus, {
expiration: this.expiration
})*/
})

/* bot is connected */
socket.on('ready', client => {
/* write data jadibot */
client.id = number;
client.user.uptime = now;
settings.status = true;
settings.session = session;
/* auto clear sessions every 10 minutes */
setInterval(async () => {
try {
/* this source from @jarspay */
const TIME = 1000 * 60 * 60
const filename = []
const files = await fs.readdirSync(session)
for (const file of files) {
if (file != 'creds.json') filename.push(path.join(session, file))
}

await Promise.allSettled(filename.map(async (file) => {
const stat = await fs.statSync(file)
if (stat.isFile() && (Date.now() - stat.mtimeMs >= TIME)) {
if (platform() === 'win32') {
let fileHandle
try {
fileHandle = await fs.openSync(file, 'r+')
} catch (e) {} finally {
await fileHandle.close()
}
}
await fs.unlinkSync(file)
}
}))
} catch {}
}, 60 * 1000 * 10)
})

/* print all message object */
socket.on('message', async ctx => {
const { m, store } = ctx;
InvCloud(store);
require('../handler.js')(socket.mecha, ctx);
require('./metadata.js')(socket.mecha, ctx);
if (global.db.setting[m.bot].autoread && m.chat === 'status@broadcast') {
if (m.message?.protocolMessage) return;
await socket.mecha.readMessages([m.key])
};
})

/* print deleted message object */
socket.on('message.delete', ctx => {
if (!ctx || !ctx.delete || !ctx.origin || ctx.origin.fromMe || ctx.origin.isBot || !ctx.origin.sender) return
if (!ctx.delete) return
if (ctx.origin.isGc && global.db.groups[ctx.origin.chat] && global.db.groups[ctx.origin.chat].antidelete) return socket.mecha.copyNForward(ctx.origin.chat, ctx.delete, false, {
quoted: ctx.delete,
ephemeralExpiration: ctx.origin.expiration || this.expiration
})
})

/* Anti Call Auto Reject */
socket.on('caller', ctx => {
require('./anticall')(socket.mecha, ctx)
})

socket.on('group.add', ctx => groupAdd(socket.mecha, ctx))
socket.on('group.remove', ctx => groupRemove(socket.mecha, ctx))
}

StopJadibot = async (options = {}) => {
const mecha = options ? options.mecha : false;
const number = options ? options.number : false;
const client = global.jadibot[number] ? global.jadibot[number] : Object.values(global.jadibot).find(v => v?.user?.id.split(':')[0] == number.replace(/[^0-9]/g, ''))
let settings = global.db.jadibot.find(v => v.number === number)
if (typeof client == 'undefined') return mecha.reply(number, 'Kamu tidak terdaftar dalam sesi jadibot!', this.fstatus, {
expiration: this.expiration
})
delete global.jadibot[number];
settings.status = false;
await client.end();
client.ws.close();
global.reply(number, 'Jadibot successfully stopped.', this.fstatus, {
expiration: this.expiration
})
}
}

func.reloadFile(__filename)