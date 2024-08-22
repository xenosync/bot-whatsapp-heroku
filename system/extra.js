require('../config.js')
/* module */
const {
default: makeWASocket,
downloadContentFromMessage,
getContentType,
generateWAMessage,
generateWAMessageFromContent,
generateForwardMessageContent,
prepareWAMessageMedia,
getBinaryNodeChild,
areJidsSameUser,
proto,
delay,
jidDecode,
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const util = require('util');
const phoneNumber = require('awesome-phonenumber');
const jimp = require('jimp');
const path = require('path');
const { fromBuffer } = require('file-type');
const { randomBytes } = require('crypto');
/* library */
const func = require('./functions.js');
const { 
imageToWebp, 
videoToWebp, 
writeExifImg, 
writeExifVid, 
writeExifWebp 
} = require('../lib/exif.js');

module.exports = class Extra {
mention = (text = '') => text.match('@') ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []

initExtraFunc = (mecha) => {
mecha.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

mecha.getBusinessProfile = async (jid) => {
const results = await mecha.query({
tag: 'iq',
attrs: {
to: 's.whatsapp.net',
xmlns: 'w:biz',
type: 'get'
},
content: [{
tag: 'business_profile',
attrs: { v: '244' },
content: [{
tag: 'profile',
attrs: { jid }
}]
}]
})
const profiles = getBinaryNodeChild(getBinaryNodeChild(results, 'business_profile'), 'profile')
if (!profiles) return {} // if not bussines
const address = getBinaryNodeChild(profiles, 'address')
const description = getBinaryNodeChild(profiles, 'description')
const website = getBinaryNodeChild(profiles, 'website')
const email = getBinaryNodeChild(profiles, 'email')
const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
return {
jid: profiles.attrs?.jid,
address: address?.content.toString(),
description: description?.content.toString(),
website: website?.content.toString(),
email: email?.content.toString(),
category: category?.content.toString(),
}
}

mecha.sendGroupInvite = async (jid, participant, options = {}) => {
if (typeof jid == 'undefined') return;
if (typeof options.inviteCode == 'undefined') return;
let groupInvite = generateWAMessageFromContent(jid, proto.Message.fromObject({
"groupInviteMessage": {
"groupJid": jid,
"inviteCode": options?.inviteCode,
"inviteExpiration": options?.inviteExpiration ? options.inviteExpiration : + new Date(new Date + (3 * 86400000)),
"groupName": options?.groupName ? options.groupName : mecha.getName(jid),
"jpegThumbnail": await mecha.resize(options?.jpegThumbnail ? options.jpegThumbnail : 'https://telegra.ph/file/0d25a520bfa0909c74466.jpg', 200, 200),
"caption": options?.caption ? options.caption : 'Invitation to join my WhatsApp group',
}
}), { userJid: participant, quoted: options?.quoted })
return await mecha.relayMessage(participant, groupInvite.message, { messageId: groupInvite.key.id })
}

mecha.groupQueryInvite = async(code) => {
let result = await mecha.query({tag: "iq", attrs: { type: "get", xmlns: "w:g2", to: "@g.us" }, content: [{ tag: "invite", attrs: { code } }] })
let group = getBinaryNodeChild(result, "group")
let descRes = getBinaryNodeChild(group, "description")
let desc, descId, descOwner, descTime 
if (descRes) {
desc = getBinaryNodeChild(descRes, "body")?.content?.toString(),
descId = descRes?.attrs?.id,
descOwner = descRes?.attrs?.participant,
descTime = descRes?.attrs?.t
}
const hasil = {
id: group?.attrs?.id.includes("@") ? group?.attrs?.id : group?.attrs?.id + "@g.us",
owner: group?.attrs?.creator,
subject: group?.attrs?.subject,
subjectOwner: group?.attrs?.s_o,
subjectTime: group?.attrs?.s_t,
size: group?.attrs?.size,
creation: group?.attrs?.creation,
participants: group?.content?.filter(v => v.tag == "participant").map(v => v.attrs),
desc,
descId,
descOwner,
descTime
}
return hasil
}

if (mecha.user && mecha.user.id) mecha.user.jid = mecha.decodeJid(mecha.user.id)
mecha.ments = this.mention;
mecha.makeid = (count) => randomBytes(count).toString('hex');

mecha.sendMessageModify = (jid, text = '', quoted = '', opts = {}) => {
return mecha.sendMessage(jid, {
text: text, 
contextInfo: {
mentionedJid: this.mention(text), 
forwardingScore: 256, 
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: global.newsletter,
newsletterName: `Ping : ${func.ping(4)} • Powered by ${global.ownerName}`,
serverMessageId: -1
},
externalAdReply: {
showAdAttribution: opts.ads, 
title: opts.title ? opts.title : global.header, 
body: opts.body ? opts.body : global.footer, 
mediaType: 1, 
previewType: 'PHOTO', 
thumbnailUrl: opts.thumbUrl, 
thumbnail: opts.thumbnail, 
sourceUrl: opts.url, 
renderLargerThumbnail: opts.largeThumb
}
}
}, {quoted: quoted, ephemeralExpiration: func.expiration(opts.expiration), ...opts})
}

mecha.reply = async (jid, text = '', quoted, opts = {}) => {
await mecha.sendPresenceUpdate('composing', jid)
return mecha.sendMessage(jid, {text: text, mentions: this.mention(text), ...opts}, {quoted: quoted, ephemeralExpiration: func.expiration(opts.expiration)})
}

mecha.sendReact = async (jid, emoticon, keys = {}) => {
let reactionMessage = {react: {text: emoticon, key: keys}}
return await mecha.sendMessage(jid, reactionMessage)
}

mecha.sendPoll = (jid, name = '', values = [], selectableCount = 1) => {
return mecha.sendMessage(jid, {
poll: {
name,
values,
selectableCount
}
})
}

mecha.sendButton = async (from, title = '', text = '', footer = '', button = [...[type, text, content]], quoted, options = {}) => {
if (!Array.isArray(button)) return;
if (button.length == 0) return;
if (!options.mentions) options.mentions = [];
let buttons = [];
button.map(([name, display_text, id], i) => {
if (name == 'list') return buttons.push({
name: 'single_select',
buttonParamsJson: JSON.stringify({ title: display_text, sections: id })
});
else if (name == 'button') return buttons.push({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({ display_text: display_text, id: id })
});
else if (name == 'url') return buttons.push({
name: 'cta_url',
buttonParamsJson: JSON.stringify({ display_text: display_text, url: id, merchant_url: id })
});
else if (name == 'call') return buttons.push({
name: 'cta_call',
buttonParamsJson: JSON.stringify({ display_text: display_text, id: id })
});
else if (name == 'copy') return buttons.push({
name: 'cta_copy',
buttonParamsJson: JSON.stringify({ display_text: display_text, id: id, copy_code: id })
});
else if (name == 'reminder') return buttons.push({
name: 'cta_reminder',
buttonParamsJson: JSON.stringify({ display_text: display_text, id: id })
});
else if (name == 'address') return buttons.push({
name: 'address_message',
buttonParamsJson: JSON.stringify({ display_text: display_text, id: id })
});
else if (name == 'location') return buttons.push({
name: 'send_location',
buttonParamsJson: JSON.stringify({ display_text: display_text, id: id })
});
})
if (options.media) var { mime, data } = await mecha.getFile(options.media, true)
let msg = generateWAMessageFromContent(from, proto.Message.fromObject({
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
mentionedJid: [...options.mentions, ...this.mention(title + text)],
isForwarded: true,
forwardingScore: 256,
forwardedNewsletterMessageInfo: {
newsletterJid: global.newsletter,
newsletterName: `Ping : ${func.ping(4)} • Powered by ${global.ownerName}`,
serverMessageId: -1
}
},
body: proto.Message.InteractiveMessage.Body.create({
text: text
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: footer
}),
header: proto.Message.InteractiveMessage.Header.create({
title: title,
subtitle: 'SuryaDev',
hasMediaAttachment: options.media ? true : false,
...(options.media ? (await prepareWAMessageMedia({ [`${mime.split('/')[0]}`]: data }, { upload: mecha.waUploadToServer })) : {}),
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: buttons
})
})
}
}
}), {
userJid: mecha.user.jid,
quoted: quoted
});
return mecha.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}

mecha.sendIAMessage = async (jid, buttons = [], quoted, opts = {}, options = {}) => {
if (!Array.isArray(buttons)) return;
if (buttons.length == 0) return;
if (!opts.mentions) opts.mentions = [];
if (opts.media) {
var { mime, data } = await mecha.getFile(opts.media, true)
if (/image/.test(mime)) {
var message = await prepareWAMessageMedia({
image: data
}, {
upload: mecha.waUploadToServer
});
var media =  {
imageMessage: message.imageMessage
};
} else if (/video/.test(mime)) {
var message = await prepareWAMessageMedia({
video: data
}, {
upload: mecha.waUploadToServer
});
var media = {
videoMessage: message.videoMessage
};
} else {
var media = {};
}
}
const msg = generateWAMessageFromContent(jid, {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage: {
header: proto.Message.InteractiveMessage.create({
title: opts.header ? opts.header : '',
subtitle: opts.subtitle ? opts.subtitle : '',
hasMediaAttachment: !!(opts.media && /image|video/.test(mime)),
...media
}),
body: proto.Message.InteractiveMessage.create({
text: opts.content ? opts.content : ''
}),
footer: proto.Message.InteractiveMessage.create({
text: opts.footer ? opts.footer : ''
}),
nativeFlowMessage: proto.Message.InteractiveMessage.create({
buttons: buttons,
messageParamsJson: ''
}),
contextInfo: {
mentionedJid: [...opts.mentions, ...mecha.ments(opts.content)],
isForwarded: true,
forwardingScore: 256,
forwardedNewsletterMessageInfo: {
newsletterJid: global.newsletter,
newsletterName: `Ping ${func.ping(4)} • Powered by ${global.ownerName}`,
serverMessageId: -1
},
...options
}
}
}
}
}, {
userJid: mecha.user.jid,
quoted: quoted
});
await mecha.sendPresenceUpdate('composing', jid);
mecha.relayMessage(jid, msg.message, {
messageId: msg.key.id
});
return msg;
};

mecha.sendNLMessage = (jid, text, options = {}) => {
const sendMessageToNewsLetter = proto.Message.encode({
extendedTextMessage: {
text: text,
...options
}
}).finish()
const result = {
tag: 'message',
attrs: { to: jid, type: 'text' },
content: [
{
tag: 'plaintext',
attrs: {},
content: sendMessageToNewsLetter
}
]
}

return mecha.query(result)
}

mecha.setStatus = async (status) => {
return await mecha.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
// <iq to="s.whatsapp.net" type="set" xmlns="status" id="21168.6213-69"><status>"Hai, saya menggunakan WhatsApp"</status></iq>
}

mecha.resize = async (image, width, height) => {
if (!width) width = 400;
if (!height) height = 400;
const read = await jimp.read(image);
const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
return data;
};

mecha.createprofile = async (jid, buff) => {
const media = await jimp.read(buff);
const crop = media.crop(0, 0, (await media.getWidth()), (await media.getHeight()));
const img = await crop.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG);
return mecha.query({ 
tag: 'iq', 
attrs: {
to: jid,
type: 'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: {
type: 'image'
},
content: img
}
]
})
}

mecha.downloadM = async (m, type, saveToFile) => {
if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
const stream = await downloadContentFromMessage(m, type)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
if (saveToFile) var { filename } = await mecha.getFile(buffer, true)
return saveToFile && fs.existsSync(filename) ? filename : buffer
}

mecha.downloadAndSaveMediaMessage = async (message, filename) => {
if (message.quoted ? message.quoted.message : message.msg.viewOnce) {
let type = message.quoted ? Object.keys(message.quoted.message)[0] : message.mtype;
message = message.quoted ? message.quoted.message[type] : message.msg;
} else {
let quoted = message.quoted ? message.quoted : message;
message = quoted.msg ? quoted.msg : quoted;
}
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await fromBuffer(buffer)
let trueFileName = './sampah/' + (filename ? filename : func.filename(type.ext))
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

mecha.getFile = async (PATH, returnAsFilename) => {
let res, filename
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split(',')[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../sampah/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
return {
res,
filename,
...type,
data
}
}

mecha.getmetadata = async (jid) => {
const getGroups = await mecha.groupFetchAllParticipating();
try {
if (!Object.keys(getGroups).includes(jid)) return ({});
let metadata = Object.values(getGroups).find((x) => x.id === jid);
return metadata;
} catch (e) {
if (!Object.keys(getGroups).includes(jid)) return ({});
let metadata = await mecha.groupMetadata(jid) || {};
return metadata;
}
}

mecha.isgroup = (jid) => new Promise(async (resolve) => {
const getGroups = await mecha.groupFetchAllParticipating();
const listGroups = Object.keys(getGroups);
const findGroups = listGroups.find((id) => id === jid);
const status = findGroups ? true : false;
resolve(status)
})

mecha.sendMedia = async (jid, path, quoted, options = {}) => {
let { ext, mime, data } = await mecha.getFile(path)
let messageType = mime.split('/')[0]
let type = messageType.replace('application', 'document') || messageType
return await mecha.sendMessage(jid, {[`${type}`]: data, mimetype: mime, ...options}, {quoted: quoted, ephemeralExpiration: func.expiration(options.expiration)})
}

mecha.sendFile = async (jid, path, caption = '', quoted, ptt = false, options = {}) => {
let type = await mecha.getFile(path, true)
let { res, data: file, filename: pathFile } = type
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) {
if (e.json) throw e.json
}
}
if (!type) options.asDocument = true
let mtype = '', mimetype = type.mime, convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime)) (
convert = await (ptt ? toPTT : toAudio)(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'
let message = {
...options,
caption,
ptt,
[mtype]: { url: pathFile },
mimetype
}
let m
try {
m = await mecha.sendMessage(jid, message, {quoted: quoted, ephemeralExpiration: func.expiration(options.expiration)})
} catch (e) {
mecha.logger.error(e)
m = null
} finally {
if (!m) m = await mecha.sendMessage(jid, { ...message, [mtype]: file }, {quoted: quoted, ephemeralExpiration: func.expiration(options.expiration)})
return m
}
}

/* FUNCTION MAKE STICKER BY SURYA */
mecha.sendStickerFromUrl = async(from, PATH, quoted, options = {}) => {
let { writeExif } = require('../lib/sticker')
let types = await mecha.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : 'Suryaaa 𝑓𝑡 Wulannn.', author: options.author ? options.author : '', categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
await mecha.sendMessage(from, {sticker: {url: pathFile}}, {quoted: quoted, ephemeralExpiration: func.expiration(options.expiration), ...options})
return fs.promises.unlink(pathFile)
}

mecha.sendSticker = async (jid, path, quoted, options = {}) => {
let buffer = /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split(',')[1], 'base64') : Buffer.alloc(0)
let { mime } = await fromBuffer(buffer)
let convert = (/image\/(jpe?g|png|gif)|octet/.test(mime)) ? (options && (options.packname || options.author)) ? await writeExifImg(buffer, options) : await imageToWebp(buffer) : (/video/.test(mime)) ? (options && (options.packname || options.author)) ? await writeExifVid(buffer, options) : await videoToWebp(buffer) : (/webp/.test(mime)) ? await writeExifWebp(buffer, options) : Buffer.alloc(0)
return mecha.sendMessage(jid, {sticker: {url: convert}, ...options}, {quoted: quoted, ephemeralExpiration: func.expiration(options.expiration)})
}

mecha.sendkontak = (jid, numbers, name, quoted, options = {}) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'item1.X-ABLabel:Ponsel\n'
+ 'item2.EMAIL;type=INTERNET:suryaskylark05@gmail.com\n'
+ 'item2.X-ABLabel:Email\nitem3.URL:https://instagram.com/surya_skylark05\n'
+ 'item3.X-ABLabel:Instagram\n'
+ 'item4.ADR:;;Indonesia;;;;\n'
+ 'item4.X-ABLabel:Region\n'
+ 'END:VCARD'
return mecha.sendMessage(jid, {contacts: {displayName: name, contacts: [{ vcard }]}, mentions: [number + '@s.whatsapp.net']}, {quoted: quoted, ephemeralExpiration: func.expiration(options.expiration)})
}

mecha.sendkontakV2 = (jid, name, arr = [...[satu = "", dua = "", tiga = ""]], quoted = '', opts = {}) => {
const vcard = {
contacts: {
displayName: name, 
contacts: arr.map(i => ({displayName: i[0], vcard: 'BEGIN:VCARD\n'+'VERSION:3.0\n'+'FN:'+i[0]+'\n'+'ORG:'+i[2]+';\n'+'TEL;type=CELL;type=VOICE;waid='+i[1]+':+'+i[1]+'\n'+'END:VCARD' }))
}, 
...opts
}
return mecha.sendMessage(jid, vcard, {quoted: quoted, ephemeralExpiration: func.expiration(opts.expiration)})
};

mecha.sendContact = async (jid, contact, quoted, info = {}, opts = {}) => {
let list = []
contact.map(v => list.push({
displayName: v.name,
vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\nORG:${info && info.org ? info.org : 'Surya Dev'}\nTEL;type=CELL;type=VOICE;waid=${v.number}:${phoneNumber('+' + v.number).getNumber('international')}\nEMAIL;type=Email:${info && info.email ? info.email : 'suryaskylark05@gmail.com'}\nURL;type=Website:${info && info.website ? info.website : 'https://neoxr.my.id'}\nADR;type=Location:;;Unknown;;\nOther:${v.about}\nEND:VCARD`
}))
return mecha.sendMessage(jid, {contacts: {displayName: `${list.length} Contact`, contacts: list}, ...opts}, {quoted: quoted, ephemeralExpiration: func.expiration(opts.expiration)})
}

mecha.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}

let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await mecha.relayMessage(jid, waMessage.message, {quoted: options.quoted, ephemeralExpiration: 86400, messageId: waMessage.key.id})
return waMessage
}

mecha.cMod = async (jid, copy, text = '', sender = mecha.user.id, options = {}) => {
let mtype = getContentType(copy.message);
let isEphemeral = mtype === 'ephemeralMessage';
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
copy.message = copy.message.ephemeralMessage.message[mtype];
}
let content = copy.message;
if (typeof content === 'string') {
copy.message = text || content;
} else if (text || content.caption) {
content.caption = text || content.caption;
} else if (content.text) {
content.text = text || content.text;
}
if (typeof content !== 'string') {
copy.message = { ...content, ...options };
}
if (copy.key.participant) {
sender = sender || copy.key.participant;
} else if (copy.key.remoteJid.includes('@s.whatsapp.net')) {
sender = sender || copy.key.remoteJid;
} else if (copy.key.remoteJid.includes('@broadcast')) {
sender = sender || copy.key.remoteJid;
}
copy.key.remoteJid = jid;
copy.key.fromMe = areJidsSameUser(sender, (mecha.user && mecha.user.id));
return proto.WebMessageInfo.fromObject(copy);
}

mecha.downloadMediaMessage = async (message) => {
let quoted = message.quoted ? message.quoted : message
if (quoted?.msg?.viewOnce) {
let type = message.quoted ? Object.keys(message.quoted.message)[0] : message.mtype
message = message.quoted ? message.quoted.message[type] : message.msg
}
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

mecha.preSudo = async (text, who, m, chatUpdate) => {
let messages = await generateWAMessage(m.chat, { text, mentions: m.mentionedJid }, {
userJid: who,
quoted: m.quoted && m.quoted.fakeObj
})
messages.key.fromMe = areJidsSameUser(who, mecha.user.id)
messages.key.id = m.key.id
messages.pushName = m.pushname
if (m.isGc) messages.key.participant = messages.participant = who
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)].map(v => (v.mecha = this, v)),
type: 'append'
}
mecha.ev.emit('messages.upsert', msg)
}

return mecha
}

initSerialize = (mecha, m, store) => {
if (!m) return m
let M = proto.WebMessageInfo
const mtype = () => {
try {
return Object.keys(m.message)[0] == "senderKeyDistributionMessage" ? Object.keys(m.message)[2] == "messageContextInfo" ? Object.keys(m.message)[1] : Object.keys(m.message)[2] : Object.keys(m.message)[0] != "messageContextInfo" ? Object.keys(m.message)[0] : Object.keys(m.message)[1];
} catch {
return null;
}
};
if (m.key) {
m.id = m.key.id
m.isBot = /pollCreationMessage/.test(mtype()) ? false : m.id.startsWith('MECHA') && m.id.length === 16 || m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('B24E') && m.id.length === 20 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && m.id.length === 22 || m.id.startsWith('3EB0') && m.id.length === 40 || m.id.startsWith('B1EY') && m.id.length === 20
m.chat = m.key.remoteJid;
m.fromMe = /pollCreationMessage/.test(mtype()) ? false : m.key.fromMe;
m.isGc = m.chat.endsWith('@g.us')
m.isPc = m.chat.endsWith('@s.whatsapp.net')
m.sender = m.fromMe ? (mecha.user.id.split(':')[0] + '@s.whatsapp.net' || mecha.user.id) : (m.key.participant || m.key.remoteJid);
}
if (m.message) {
m.pushname = m.pushName || '';
m.bot = mecha.user.id ? mecha.user.id.split(':')[0] + '@s.whatsapp.net' : mecha.user.jid;
m.setting = global.db?.setting ? global.db.setting[m.bot] : {};
m.user = {
id: m.sender,
device: m.isBot ? 'web' : 'smartphone',
jadibot: mecha.id ? true : false
};
if (m.isGc) {
m.metadata = global.db.metadata[m.chat] || {};
m.groupName = m.metadata?.subject || '';
m.members = m.metadata?.participants || [];
m.admins = (m.members.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []))
m.isAdmin = !!m.admins.find((member) => member.id === m.sender)
m.isBotAdmin = !!m.admins.find((member) => member.id === m.bot)
}
if (m.message.viewOnceMessage) {
m.mtype = Object.keys(m.message.viewOnceMessage.message)[0];
m.msg = m.message.viewOnceMessage.message[m.mtype];
} else if (m.message.viewOnceMessageV2) {
m.mtype = Object.keys(m.message.viewOnceMessageV2.message)[0];
m.msg = m.message.viewOnceMessageV2.message[m.mtype];
} else {
m.mtype = mtype();
m.msg = m.message[m.mtype];
}
if (m.mtype === "ephemeralMessage" || m.mtype === "documentWithCaptionMessage") {
this.initSerialize(mecha, m.msg, store);
m.mtype = m.msg.mtype;
m.msg = m.msg.msg;
}
m.isMedia = !!m.msg?.mimetype
if (m.isMedia) {
m.mime = m.msg?.mimetype;
m.size = m.msg?.fileLength;
m.height = m.msg?.height || '';
m.width = m.msg?.width || '';
if (/webp/i.test(m.mime)) {
m.isAnimated = m.msg?.isAnimated;
}
if (/audio|video/i.test(m.mime)) {
m.seconds = m.msg?.seconds;
}
}
let quoted = m.quoted = typeof m.msg != 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null : null
m.mentionedJid = typeof m.msg != 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [] : []
if (m.quoted) {
let type = Object.keys(m.quoted)[0]
m.quoted = m.quoted[type]
if (/productMessage|documentWithCaptionMessage/i.test(type)) {
type = Object.keys(m.quoted)[0]
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBot = m.quoted.id ? (m.quoted.id.startsWith('MECHA') && m.quoted.id.length === 16 || m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 22 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 40 || m.quoted.id.startsWith('B24E') && m.quoted.id.length === 20 || m.quoted.id.startsWith('B1EY') && m.quoted.id.length === 20) : false
m.quoted.sender = m.msg.contextInfo.participant.split(":")[0] || m.msg.contextInfo.participant
m.quoted.fromMe = areJidsSameUser(m.quoted.sender, (mecha.user && mecha.user.id));
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => mecha.copyNForward(jid, vM, forceForward, options)
m.getQuotedObj = async () => {
if (!m.quoted.id) return false;
let quotedMsg = await store.loadMessage(m.chat, m.quoted.id);
return this.initSerialize(mecha, quotedMsg, store);
};
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGc ? {
participant: m.quoted.sender
} : {})
})
m.quoted.mtype = m.quoted != null ? Object.keys(m.quoted.fakeObj.message)[0] : null
m.quoted.text = m.quoted?.text || m.quoted?.caption || (m.quoted.mtype === "interactiveMessage" ? m.quoted?.body?.text : '') || (/viewOnceMessage/.test(m.quoted.mtype) ? m.quoted.message[Object.keys(m.quoted.message)[0]].caption : '') || (m.quoted.mtype == "buttonsMessage" ? m.quoted.contentText : '') || (m.quoted.mtype == "templateMessage" ? m.quoted?.hydratedFourRowTemplate?.hydratedContentText : '') || '';
m.quoted.isMedia = !!(m.quoted.message ? m.quoted.message[Object.keys(m.quoted.message)[0]].mimetype : m.quoted.mimetype);
m.quoted.download = () => {
if (m.quoted.isMedia) {
let type = m.quoted.message ? Object.keys(m.quoted.message)[0] : m.quoted;
let q = m.quoted.message ? m.quoted.message[type] : m.quoted;
return mecha.downloadMediaMessage(q)
}
}
if (m.quoted.isMedia) {
let type = m.quoted.message ? Object.keys(m.quoted.message)[0] : m.quoted;
let q = m.quoted.message ? m.quoted.message[type] : m.quoted;
m.quoted.mime = q.mimetype;
m.quoted.size = q.fileLength;
m.quoted.height = q.height || '';
m.quoted.width = q.width || '';
if (/webp/i.test(m.quoted.mime)) {
m.quoted.isAnimated = q.isAnimated || false
}
if (/audio|video/i.test(m.quoted.mime)) {
m.quoted.seconds = q.seconds;
}
}
}
m.reply = async (text = '', options = {}) => {
mecha.sendMessage(m.chat, {
text: text, 
contextInfo: m?.setting?.fakereply ? {
mentionedJid: [m.sender, ...this.mention(text)], 
forwardingScore: 256, 
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: global.newsletter,
newsletterName: `Ping : ${func.ping(4)} • Powered by ${global.ownerName}`,
serverMessageId: -1
},
externalAdReply: {
title: global.header, 
body: global.fake, 
sourceUrl: 'https://vcard-suryadev.vercel.app/',
thumbnail: await (await fetch(m?.setting?.cover || 'https://telegra.ph/file/b69efb039ffcad022a3b6.jpg')).buffer()
}
} : {
mentionedJid: [m.sender, ...this.mention(text)],
forwardingScore: 0, 
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: global.newsletter,
newsletterName: `Ping : ${func.ping(4)} • Powered by ${global.ownerName}`,
serverMessageId: -1
}
},
...options
}, {quoted: m, ephemeralExpiration: func.expiration(m.expiration), detectLinks: false, ...options})
}
m.copyNForward = (jid = m.chat, message, forceForward = false, options = {}) => mecha.copyNForward(jid, message, forceForward, options);
if (typeof m.msg != 'undefined') {
if (m.msg.url) m.download = () => mecha.downloadMediaMessage(m.msg)
}
}
m.body = (m.mtype == "interactiveResponseMessage" ? JSON.parse(m.msg?.nativeFlowResponseMessage?.paramsJson).id : '') || (m.mtype == "pollCreationMessage" ? (m.body == undefined ? '' : (m?.setting?.prefix || '.') + m.body) : '') || (m.mtype == "stickerMessage" && global.db && global.db.stickercmd ? typeof global.db.stickercmd[m.msg.fileSha256.toString()] != "undefined" ? global.db.stickercmd[m.msg.fileSha256.toString()].text : '' : '') || (m.mtype == "editedMessage" ? m.msg.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text : '') || (m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : '') || (m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : '') || (m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : '') || (typeof m.msg != "undefined" ? m.msg.text : '') || (typeof m.msg != "undefined" ? m.msg.caption : '') || m.msg || '';
m.budy = typeof m.body == "string" ? m.body : '';
m.prefix = m?.setting?.multiprefix ? (global.prefixes.test(m.budy) ? m.budy.match(global.prefixes)[0] : '.') : m?.setting?.prefix || '.';
m.isDevs = [...global.developer, ...global.devs].includes(m.sender);
m.isOwner = [global.owner, m.bot, ...(m?.setting?.owner || []), ...global.developer, ...global.devs].includes(m.sender);
m.isPrefix = m.budy.startsWith(m.prefix);
m.command = m.isOwner ? m.budy.replace(m.prefix, '').trim().split(/ +/).shift().toLowerCase() : m.isPrefix ? m.budy.replace(m.prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
m.cmd = m.prefix + m.command;
m.arg = m.budy.trim().split(/ +/).filter(a => a) || []
m.args = m.budy.trim().replace(new RegExp('^' + func.escapeRegExp(m.prefix), 'i'), '').replace(m.budy.replace(m.prefix, '').trim().split(/ +/).shift(), '').split(/ +/).filter(a => a) || []
m.text = m.args.join(' ')
m.expiration = m.msg?.contextInfo?.expiration || 0

return M.fromObject(m);
};

initPrototype = () => {
Number.prototype.rupiah = function rupiah() {
var tostr = this.toString();
var mlds = tostr.length % 3;
var iris = tostr.substr(0, mlds);
var ribu = tostr.substr(mlds).match(/\d{3}/g);
let res;
if (ribu) {
res = mlds ? "," : "";
iris += res + ribu.join(",");
}
return iris;
};

Array.prototype.random = function random() {
return this[Math.floor(Math.random() * this.length)];
};

Number.prototype.datestring = function datestring() {
let year = this.getFullYear(),
moon = this.getMonth(),
date = this.getDate(),
hours = this.getHours(),
minutes = this.getMinutes();
return `${date}-${moon + 1}-${year} ${hours}:${minutes}`;
};

Number.prototype.timers = function timers() {
const seconds = Math.floor((this / 1000) % 60),
minutes = Math.floor((this / (60 * 1000)) % 60),
hours = Math.floor((this / (60 * 60 * 1000)) % 24),
days = Math.floor(this / (24 * 60 * 60 * 1000));
return `${days ? days + ' hari ' : ''}${hours ? hours + ' jam ' : ''}${minutes ? minutes + ' menit ' : ''}${seconds ? seconds + ' detik' : ''}`
};

Number.prototype.sizeString = function sizeString(des = 2) {
if (this === 0) return "0 Bytes";
const dm = des < 0 ? 0 : des;
const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const i = Math.floor(Math.log(this) / Math.log(1024));
return parseFloat((this / Math.pow(1024, i)).toFixed(dm)) + " " + sizes[i];
};

Number.prototype.toTimeString = function toTimeString() {
// const milliseconds = this % 1000
const seconds = Math.floor((this / 1000) % 60)
const minutes = Math.floor((this / (60 * 1000)) % 60)
const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
const days = Math.floor((this / (24 * 60 * 60 * 1000)))
return (
(days ? `${days} day ` : '') +
(hours ? `${hours} hour ` : '') +
(minutes ? `${minutes} minute ` : '') +
(seconds ? `${seconds} second` : '')
).trim()
};
}
}

func.reloadFile(__filename)