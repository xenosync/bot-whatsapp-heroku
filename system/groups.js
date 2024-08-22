const fetch = require('node-fetch');
const func = require('./functions.js');

module.exports = class Groups {
expiration = 86400;

groupAdd = async (mecha, extra) => {
if (global.db.setting[mecha.user.jid].maintenance) return;
const { from, subject, desc, jid } = extra;
if (typeof global.db.groups[from] == 'undefined') return;
const groups = global.db.groups[from];
const caption = (groups.tekswelcome.replace('+user', `@${jid.split('@')[0]}`).replace('+group', subject).replace('+desc', desc))

/* add member to database member */
if (!groups.member.find(v => v.jid == jid)) groups.member.push({
jid: jid, 
lastseen: Date.now(),
toxic: 0,
chat: 0
})

/* localonly to remove new member when the number not from indonesia */
if (groups && groups.antiluar && !jid.startsWith('62')) {
mecha.reply(from, func.texted('bold', `Sorry @${sender.split('@')[0]}, this group is only for indonesian people and you will removed automatically.`), {
expiration: this.expiration
})
mecha.updateBlockStatus(jid, 'block')
return await func.delay(2000).then(() => mecha.groupParticipantsUpdate(from, [jid], 'remove'))
}

/* blacklist user from this group */
if (groups && groups.blacklist.some((x) => x === jid) && !groups.detect) {
mecha.reply(from, func.texted('bold', `Sorry @${jid.split('@')[0]}, you have been blacklisted from this group.`))
return await func.delay(2000).then(() => mecha.groupParticipantsUpdate(from, [jid], 'remove'))
}

/* send message with modify welcome to group */
if (groups.welcome) mecha.sendMessageModify(from, caption, func.fverified, {
title: 'Welcome Message',
body: global.header,
thumbnail: await fetch(global.db.setting[mecha.user.jid].cover).then(response => response.buffer()),
largeThumb: false,
expiration: this.expiration
})

/*if (groups.welcome && !groups.blacklist.includes(jid)) {
const messageId = 'SURYA' + func.makeid(8).toUpperCase() + 'DEV'
const thumb = await mecha.resize('https://telegra.ph/file/66ea637e36d49f218e4d1.jpg', 400, 400)
await mecha.sendMessage(from, {
document: require('fs').readFileSync("package.json"),
fileName: 'WELCOME',
fileLength: 100000000000000,
pageCount: "2024",
caption: caption,
mimetype: 'image/png',
jpegThumbnail: thumb,
contextInfo: {
externalAdReply: {
title: global.header,
body: global.footer,
thumbnailUrl: global.db.setting[mecha.user.jid].cover,
sourceUrl: null,
mediaType: 1,
renderLargerThumbnail: true, 
},
forwardingScore: 10,
isForwarded: true,
mentionedJid: [jid],
businessMessageForwardInfo: {
businessOwnerJid: '6285700408187@s.whatsapp.net'
},
forwardedNewsletterMessageInfo: {
newsletterJid: '120363261409301854@newsletter',
newsletterName: 'Powered by : SuryaDev',
serverMessageId: null,
}
}
}, {
quoted: func.fverified,
ephemeralExpiration: this.expiration,
messageId: messageId
});
}*/

/* mencegah data member menjadi duplikat */
let uniqueJids = new Set();
let result = groups.member.filter(v => {
if (!uniqueJids.has(v.jid)) {
uniqueJids.add(v.jid);
return true;
}
return false;
});
groups.member = result;
}

groupRemove = async (mecha, extra) => {
if (global.db.setting[mecha.user.jid].maintenance) return;
const { from, subject, desc, jid } = extra;
if (typeof global.db.groups[from] == 'undefined') return;
const groups = global.db.groups[from];
const caption = (groups.teksleft.replace('+user', `@${jid.split('@')[0]}`).replace('+group', subject).replace('+desc', desc))

/* send message with modify leave to group */
if (groups.left) mecha.sendMessageModify(from, caption, func.fverified, {
title: 'Leave Message',
body: global.header,
thumbnail: await fetch(global.db.setting[mecha.user.jid].cover).then(response => response.buffer()),
largeThumb: false,
expiration: this.expiration
})

/* mencegah data member menjadi duplikat */
let uniqueJids = new Set();
let result = groups.member.filter(v => {
if (!uniqueJids.has(v.jid)) {
uniqueJids.add(v.jid);
return true;
}
return false;
});
groups.member = result;
}
}