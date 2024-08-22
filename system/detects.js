const {
getContentType,
WAMessageStubType,
isJidGroup
} = require('@whiskeysockets/baileys');
const func = require('./functions.js');

module.exports = async(mecha, update) => {
// if (global.db.setting.maintenance) return;
if (global.db.setting[mecha.user.jid] && global.db.setting[mecha.user.jid].maintenance) return;
let fsub = "@admin telah mengubah subject grup menjadi @subject"
let fppgc = "@admin telah mengubah icon grup ini."
let fbgc = "@admin telah membuka grup ini, sekarang member dapat mengirim pesan ke grup ini."
let ftgc = "@admin telah menutup grup ini, sekarang member tidak dapat mengirim pesan ke grup ini."
let fbinp = "@admin telah mengubah setelan grup ini, sekarang member dapat mengedit info grup ini."
let ftinp = "@admin telah mengubah setelan grup ini, sekarang member tidak dapat mengedit info grup ini."
let fpm = "@admin telah menaikan jabatan @user menjadi admin."
let fdm = "@admin telah menurunkan jabatan @user menjadi member biasa."
let faddadmin = "@admin telah menambahkan @user kedalam grup ini."
let faddlink = "@user bergabung ke grup ini menggunakan tautan."
let faddinv = "@user telah bergabung dengan grup menggunakan undangan bot."
let fout = "@user telah keluar dari grup ini\n> *kalau udah keluar jangan harap bisa balik lagi.*"
let fkick = "@admin telah mengeluarkan @user dari grup ini."
let fephe = "@admin telah menetapkan pesan sementara pada grup ini @jumlah"
let fofephe = "@admin telah mematikan pesan sementara pada grup ini."
try {
let m = update.messages[update.messages.length - 1];
Object.defineProperty(m, 'name', {
value: 'Serialize',
configurable: true
})

if (!m) return;
const bot = await mecha.decodeJid(mecha.user.id);
const from = m.key.remoteJid;
const isGroup = from.endsWith('@g.us');
const mtype = m.message ? getContentType(m.message) : '';
const msg = m.message ? m.message[mtype] : {};

if (isGroup && typeof global.db.groups[from] !== 'undefined') {
let groups = global.db.groups[from];
let jid = m.key.participant;
let mstub = m.messageStubParameters;
let fstatus = func.fstatus('System Notification')
let expiration = msg?.ephemeralExpiration || 86400;

switch (m.messageStubType){
case 21:{ // DETEK SUBJECT
if (!groups.detect) return 
let text = fsub.replace('@subject', mstub.join()).replace('@admin', '@' + jid.split('@')[0])
mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
break;
case 22:{ // DETEK PP UPDATE GC
if (!groups.detect) return
let text = fppgc.replace('@admin', '@' + jid.split('@')[0])
mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
break;
case 25:{ // DETEK SETTING GC
if (!groups.detect) return
if (mstub.includes('off')) {
let text = fbinp.replace('@admin', '@' + jid.split('@')[0])
return mecha.reply(from, text, fstatus, {
expiration: expiration
});
} else if (mstub.includes('on')) {
let text = ftinp.replace('@admin', '@' + jid.split('@')[0])
return mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
}
break;
case 26:{ // DETECT TUTUP/BUKA GC
if (!groups.detect) return
if (mstub.includes('off')) {
let text = fbgc.replace('@admin', '@' + jid.split('@')[0])
if (jid !== bot) return mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
if (mstub.includes('on')) {
let text = ftgc.replace('@admin', '@' + jid.split('@')[0])
if (jid !== bot) return mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
}
break;
case 27:{ // ADD
if (!groups.detect) return
let text = (txt) => txt.replace('@admin', '@' + jid.split('@')[0]).replace('@user', mstub.map(v => `@${v.split('@')[0]}`).join(', '));
if (!m.key.participant) {
/* blacklist user from this group */
if (groups && groups.blacklist.some((x) => mstub.includes(x))) {
mecha.sendMessage(from, {text: `Sorry ${mstub.map(v => `@${v.split('@')[0]}`).join(', ')}, you have been blacklisted from this group.`, mentions: mstub}, {quoted: fstatus, ephemeralExpiration: expiration})
return await func.delay(2000).then(() => mecha.groupParticipantsUpdate(from, mstub, 'remove'))
}
let { key } = await mecha.reply(from, text(faddlink), fstatus, {
expiration: expiration
});
setTimeout(() => mecha.sendMessage(from, { delete: key }), 30 * 1000)
return
}
//if (jid.includes(bot)) return mecha.reply(from, text(faddinv), fstatus);
if (jid !== bot) {
let { key } = await mecha.reply(from, text(faddadmin), fstatus, {
expiration: expiration
});
setTimeout(() => mecha.sendMessage(from, { delete: key }), 30 * 1000)
}
}
break;
case 28:{ // KICK
if (!groups.detect) return
if (mstub.includes(bot)) return
let text = fkick.replace('@admin', '@' + jid.split('@')[0]).replace('@user', mstub.map(v => `@${v.split('@')[0]}`).join(', '))
mstub.filter(v => !groups.blacklist.includes(v)).map(x => groups.blacklist.push(x))
if (jid !== bot) return mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
break;
case 29:{ // PROMOTE
if (!groups.detect) return
let text = fpm.replace('@admin', `@${jid.split('@')[0]}`).replace('@user', mstub.map(v => `@${v.split('@')[0]}`).join(', '))
if (jid !== bot) return mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
break;
case 30:{ // DEMOTE
if (!groups.detect) return
let text = fdm.replace('@admin', '@' + jid.split('@')[0]).replace('@user', mstub.map(v => `@${v.split('@')[0]}`).join(', '))
if (jid !== bot) return mecha.reply(from, text, fstatus, {
expiration: expiration
});
}
break;
case 32:{ // LEAVE
if (!groups.detect) return
if (mstub.includes(bot)) return;
let text = fout.replace('@admin', '@' + jid.split('@')[0]).replace('@user', mstub.map(v => `@${v.split('@')[0]}`).join(', '))
mstub.filter(v => !groups.blacklist.includes(v)).map(x => groups.blacklist.push(x))
let { key } = await mecha.reply(from, text, fstatus, {
expiration: expiration
});
setTimeout(() => mecha.sendMessage(from, { delete: key }), 30 * 1000)
}
break;
default:{
if (!groups.detect) return
let eph = msg?.ephemeralExpiration
let text = (eph !== 0 ? fephe.replace('@admin', '@' + jid.split('@')[0]).replace('@jumlah', (eph == 7776000 ? '90 Hari' : eph == 604800 ? '7 Hari' : eph == 86400 ? '24 Jam' : '')) : fofephe.replace('@admin', `@${jid.split('@')[0]}`));
if (/protocolMessage/.test(mtype) && msg?.type == 3) {
await mecha.reply(from, text, func.fstatus('Notifikasi Update Group'));
}
}
} // akhir dari switch
}
} catch (err) {
console.error(err)
}
}

func.reloadFile(__filename)