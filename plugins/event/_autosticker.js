let database = {};

// Message filter
const usedCommandRecently = new Set()

/**
 * Check is number filtered.
 * @param {String} from 
 * @returns {Boolean}
 */
const isFiltered = (from) => {
return !!usedCommandRecently.has(from)
}

/**
 * Add number to filter.
 * @param {String} from 
 */
const addFilter = (from) => {
usedCommandRecently.add(from)
setTimeout(() => {
return usedCommandRecently.delete(from)
}, 1000) // 1 seconds delay, I don't recommend below that.
}

const addSpam = (jid) => {
let position = false
Object.keys(database).forEach((i) => {
if (database[i].id === jid) {
position = i
}
})
if (position !== false) {
database[position].spam += 1
} else {
database[jid] = {
id: jid,
spam: 1,
expired: Date.now() + 300000
}
}
}

exports.run = {
main: async (m, { mecha, users, setting, packname, author, isPrem }) => {
setInterval(() => {
let position = null
Object.keys(database).forEach((i) => {
if (Date.now() >= database[i].expired) {
position = i
}
})
if (position !== null) {
console.log(`Spam image expired: @${database[position].id.split('@')[0]}`)
delete database[position]
}
}, 1000)

async function spamimage(){
if (typeof database[m.sender] == 'undefined') await addSpam(m.sender)
let user = database[m.sender]
if (user.spam < 3) {
user.spam += 1
await mecha.reply(m.chat, `Sistem mendeteksi Anda melakukan spam, harap jeda selama *${global.cooldown}* detik.`, m)
} else {
delete database[m.sender]
return mecha.reply(m.chat, `Anda dilarang menggunakan bot karena Anda melakukan spam berlebihan.`, m).then(() => {
global.db.users[m.sender].banned = true;
global.db.users[m.sender].expired.banned = 'PERMANENT';
})
}
}

if (setting.autosticker && !m.isPrefix && !m.fromMe) {
if (/imageMessage/i.test(m.mtype)) {
if (isFiltered(m.sender)) return spamimage()
if (!m.isOwner && !isPrem) addFilter(m.sender)
//if (users.limit < 1) return m.reply(global.mess.limit);
let media = await m.download()
await mecha.sendSticker(m.chat, media, m, {
packname: packname, 
author: author, 
expiration: m.expiration
})
//await mecha.sendMessage(m.chat, {sticker: await mecha.makeSticker(media, {author: author, pack: packname, circle: false, keepScale: false })}, {quoted: m, ephemeralExpiration: m.expiration})
//global.db.users[m.sender].limit -= 1
} else if (/videoMessage/i.test(m.mtype)) {
if (users.limit < 1) return m.reply(global.mess.limit);
if (m.seconds > 9) return m.reply('Maksimal 9 detik!')
let media = await m.download()
await mecha.sendSticker(m.chat, media, m, {
packname: packname, 
author: author, 
expiration: m.expiration
})
//await mecha.sendMessage(m.chat, {sticker: await mecha.makeSticker(media, {author: author, pack: packname, circle: false, keepScale: false})}, {quoted: m, ephemeralExpiration: m.expiration})
global.db.users[m.sender].limit -= 1
}
}
},
private: true
}