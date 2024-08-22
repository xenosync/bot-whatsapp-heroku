function addResponList(groupID, key, response, isImage, image_url, _db) {
let obj_add = {
id: groupID,
key: key,
response: response,
isImage: isImage,
image_url: image_url
}
_db.push(obj_add)
}

function getDataResponList(groupID, key, _db) {
let position = null
Object.keys(_db).forEach((x) => {
if (_db[x].id === groupID && _db[x].key === key) {
position = x
}
})
if (position !== null) {
return _db[position]
}
}

function isAlreadyResponList(groupID, key, _db) {
let found = false
Object.keys(_db).forEach((x) => {
if (_db[x].id === groupID && _db[x].key === key) {
found = true
}
})
return found
}

function sendResponList(groupId, key, _db) {
let position = null
Object.keys(_db).forEach((x) => {
if (_db[x].id === groupId && _db[x].key === key) {
position = x
}
})
if (position !== null) {
return _db[position].response
}
}

function isAlreadyResponListGroup(groupID, _db) {
let found = false
Object.keys(_db).forEach((x) => {
if (_db[x].id === groupID) {
found = true
}
})
return found
}

function delResponList(groupID, key, _db) {
let position = null
Object.keys(_db).forEach((x) => {
if (_db[x].id === groupID && _db[x].key === key) {
position = x
}
})

if (position !== null) {
_db.splice(position, 1)
}
}

function updateResponList(groupID, key, response, isImage, image_url, _db) {
let position = null
Object.keys(_db).forEach((x) => {
if (_db[x].id === groupID && _db[x].key === key) {
position = x
}
})
if (position !== null) {
_db[position].response = response
_db[position].isImage = isImage
_db[position].image_url = image_url
}
}

exports.run = {
usage: ['list', 'addlist', 'dellist', 'updatelist'],
use: 'text',
category: 'admin tools',
async: async (m, { func, mecha, groups, quoted }) => {
const [key, response] = m.text.split(',')
switch (m.command) {
case 'list':
if (!m.isGc) return m.reply(global.mess.group)
if (groups.list.length === 0) return m.reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(m.chat, groups.list)) return m.reply(`Belum ada list message yang terdaftar di group ini`)
let teks_list = `*List ${m.groupName}*`
for (let x of groups.list) {
if (x.id === m.chat) {
teks_list += `\n\nKey : ${x.key}\nResponse : ${x.response}\nisImage : ${x.isImage ? 'Yes' : 'No'}`
}
}
m.reply(teks_list)
break
case 'addlist':
if (!m.isGc) return m.reply(global.mess.group)
if (!m.isAdmin && !m.isOwner) return m.reply(global.mess.admin)
if (!m.text.includes(',')) return m.reply(func.example(m.cmd, 'halo,halo juga'))
if (isAlreadyResponList(m.chat, key, groups.list)) return m.reply(`List respon dengan key : ${key} sudah ada di group ini.`)
if (/image/.test(quoted.mime)) {
let media = await mecha.downloadAndSaveMediaMessage(m)
let listimg = (await func.telegraPh(media)).url
addResponList(m.chat, key, response, true, listimg, groups.list)
m.reply(`Sukses set list message dengan key : ${key}`)
} else {
addResponList(m.chat, key, response, false, '-', groups.list)
m.reply(`Sukses set list message dengan key : ${key}`)
}
break
case 'dellist':
if (!m.isGc) return m.reply(global.mess.group)
if (!m.isAdmin && !m.isOwner) return m.reply(global.mess.admin)
if (groups.list.length === 0) return m.reply(`Belum ada list message di database`)
if (!m.text) return m.reply(func.example(m.cmd, 'halo'))
if (!isAlreadyResponList(m.chat, m.text, groups.list)) return m.reply(`List respon dengan key : ${m.text} tidak ada di database!`)
delResponList(m.chat, m.text, groups.list)
m.reply(`Sukses delete list message dengan key : ${m.text}`)
break
case 'updatelist':
if (!m.isGc) return m.reply(global.mess.group)
if (!m.isAdmin && !m.isOwner) return m.reply(global.mess.admin)
if (!m.text.includes(',')) return m.reply(func.example(m.cmd, 'halo,halo juga'))
if (!isAlreadyResponListGroup(m.chat, groups.list)) return m.reply(`Maaf, untuk key : ${key} belum terdaftar di group ini`)
if (/image/.test(quoted.mime)) {
let media = await mecha.downloadAndSaveMediaMessage(m)
let listimg = (await func.telegraPh(media)).url
updateResponList(m.chat, key, response, true, listimg, groups.list)
m.reply(`Sukses update list message dengan key : ${key}`)
} else {
updateResponList(m.chat, key, response, false, '-', groups.list)
m.reply(`Sukses update respon list dengan key : ${key}`)
}
break
}
},
main: async (m, { mecha, groups, isCmd }) => {
/* FUNCTION LIST BY SURYA */
if (m.isGc && isAlreadyResponList(m.chat, m.budy, groups.list) && !isCmd) {
let data = getDataResponList(m.chat, m.budy, groups.list)
if (data.isImage) {
mecha.sendMessage(m.chat, {image: {url: data.image_url}, caption: data.response }, {quoted: m, ephemeralExpiration: m.expiration})
} else mecha.sendMessage(m.chat, {text: sendResponList(m.chat, m.budy, groups.list)}, {quoted: m, ephemeralExpiration: m.expiration})
}
}
}