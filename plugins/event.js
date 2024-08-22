exports.run = {
usage: ['eventpc', 'eventgc'],
use: 'text or reply media',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
mecha.quizset = mecha.quizset ? mecha.quizset : [];
if (!m.isOwner) return m.reply(global.mess.owner)
try {
let q = m.quoted ? m.quoted : m;
let mime = (q.msg || q).mimetype || '';
let chatJid = Object.values(global.db.users).filter(v => v.register && !v.banned).map(v => v.jid)
let groupList = Object.values(await mecha.groupFetchAllParticipating()).filter(v => v.participants.find(v => v.id == mecha.user.jid) && v.announce == false)
let groupJid = groupList.map(x => x.id)
let mentions = [];
groupList.map(({ participants }) => participants.map(v => v.id)).map(jid => mentions.push(...jid))
const chat = m.command == 'eventpc' ? chatJid : groupJid
if (chat.length == 0) return m.reply('Error, ID does not exist.')
if (!m.text) return m.reply(explain(m.cmd))
let [question, answer, slot, rKey, rVal] = m.text.split('|')
const rewardKey = Object.freeze({
1: 'PREMIUM',
2: 'BALANCE',
3: 'LIMIT',
4: 'RANDOM_BALANCE',
5: 'RANDOM_LIMIT'
})
if (/video|image\/(jpe?g|png)/.test(mime)) {
if (!question) return m.reply('Event should have questions.')
if (!answer) return m.reply('Event should have an answer.')
if (!slot) return m.reply('Give the number of respondents.')
if (slot && isNaN(slot)) return m.reply('The number of respondents must be in numeric form.')
mecha.sendReact(m.chat, '🕒', m.key)
const id = func.makeid(15);
const media = await q.download();
const today = new Date();
const date = new Date(today.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1; // perhatikan bahwa bulan dimulai dari 0, maka ditambahkan 1.
const year = today.getFullYear();
const dateNow = `${day}/${month}/${year}`
const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
mecha.quizset.push({
id: id,
status: true,
question: question.trim(),
answer: answer.trim().toLowerCase(),
reward_key: Number(rKey || 4),
reward_value: Number(rVal || 1),
slot: Number(slot),
correct: [],
respondents: [],
keyId: [],
created_at: new Date * 1,
datenow: dateNow,
timenow: timeNow,
timer: setting.timer,
url: await (await func.UploadFileUgu(await mecha.downloadAndSaveMediaMessage(m))).url,
timeout: setTimeout(function () {
// Mencari indeks elemen yang memiliki id tertentu
let index = mecha.quizset.findIndex(item => item.id === id);
// Jika elemen ditemukan, hapus elemen tersebut dari array
if (index !== -1) {
mecha.quizset.splice(index, 1);
}
}, setting.timer)
})
let caption = `乂  *E V E N T - G I F T🎁*\n\n`
caption += `Event gift edisi ${dateNow} (${timeNow}) WIB\n`
caption += ` ${question.trim()}\n\n`
caption += `slot : *${slot.trim()}*\n`
caption += `expired : *${((setting.timer / 1000) / 60)} menit*\n`
caption += `reply pesan broadcast ini dengan jawaban yang benar .\n\n`
caption += `#ID-${id}`
for (let jid of chat) {
await new Promise(resolve => setTimeout(resolve, 5000));
await mecha.sendMessage(jid, {
image: media, 
caption, 
mentions: m.command == 'eventgc' ? mentions : []
}, {quoted: null, ephemeralExpiration: m.expiration})
}
mecha.reply(m.chat, `Successfully send broadcast message to ${chat.length} ${m.command == 'eventpc' ? 'chats' : 'groups'}`, m)
} else mecha.reply(m.chat, 'Media not found or media is not supported.', m)
} catch (e) {
return mecha.reply(m.chat, func.jsonFormat(e), m)
}
},
main: async (m, { func, mecha, users, setting, packname, author }) => {
mecha.quizset = mecha.quizset ? mecha.quizset : [];
try {
if (m.budy && m.quoted && /[#]ID/.test(m.quoted.text)) {
const id = (m.quoted.text.split('#ID-')[1]).trim()
let quizset = mecha.quizset.find(v => v.id == id)
if (!quizset) return
if (!quizset.status || quizset.correct.length == quizset.slot || (new Date() - quizset.created_at > setting.timer)) return mecha.reply(m.chat, `${func.texted('italic', `❌ Event telah selesai silahkan tunggu edisi *Event gift* di lain kesempatan.`)}\n\n${quizset.correct.map(v => `- @${v.split('@')[0]}`).join('\n')}\n\n^ Ke-${quizset.correct.length} orang diatas adalah mereka yang mendapatkan hadiah event edisi saat ini.`, m).then(() => quizset.status = false)
if (m.budy.toLowerCase() == 'qzclue' || m.budy.toLowerCase() == m.prefix + 'qzclue') return mecha.reply(m.chat, 'Clue : ' + quizset.answer.replace(/[bcdfghjklmnpqrstvwxyz]/g, '-'), m) 
if (quizset.respondents.includes(m.sender)) return m.reply(`Maaf kamu hanya bisa menjawab 1 kali saja jika code yang kamu masukan salah kesempatan kamu akan *hangus*.`)
quizset.respondents.push(m.sender)
if (quizset.answer != m.budy.toLowerCase()) return mecha.sendStickerFromUrl(m.chat, 'https://cdn.filestackcontent.com/gVDAxx9mTSegKTqwBvqr', m, {
packname: packname,
author: author, 
expiration: m.expiration
});
// mecha.sendReact(m.chat, '❌', m.key)
if (quizset.correct.length >= quizset.slot) quizset.status = false
if (quizset.correct.length == quizset.slot) return
quizset.correct.push(m.sender)
let hadiah;
if (quizset.reward_key == 1) {
const value = quizset.reward_value || 1
users.limit += 10
users.premium = true
users.expired.premium = (new Date() * 1) + (86400000 * parseInt(value))
hadiah = `✅ selamat kamu mendapatkan reward akses premium untuk ${value} hari.`
} else if (quizset.reward_key == 2) {
const value = (quizset.reward_value * 500) || 5000
users.balance += value
hadiah = `✅ selamat kamu mendapatkan reward balance sebanyak ${func.rupiah(value)}.`
} else if (quizset.reward_key == 3) {
const value = quizset.reward_value || 10
users.limit += value
hadiah = `✅ selamat kamu mendapatkan reward limit sebanyak ${func.rupiah(value)}.`
} else if (quizset.reward_key == 4) {
const value = func.ranNumb(1, 10000)
users.balance += value
hadiah = `✅ selamat kamu mendapatkan reward balance sebanyak ${func.rupiah(value)}.`
} else if (quizset.reward_key == 5) {
const value = func.ranNumb(1, 15)
users.limit += value
hadiah = `✅ selamat kamu mendapatkan reward limit sebanyak ${func.rupiah(value)}.`
}
mecha.reply(m.chat, func.texted('bold', hadiah), m).then(() => {
let caption = `乂  *E V E N T - G I F T🎁*\n\n`
caption += `Event Gift edisi ${quizset.datenow} (${quizset.timenow}) WIB\n`
caption += `${quizset.question.trim()}\n\n`
caption += `Slot : *${quizset.slot - quizset.correct.length}*\n`
caption += `Timeout : *${((setting.timer / 1000) / 60)} menit*\n\n`
caption += `reply pesan broadcast ini dengan jawaban yang benar .\n\n`
caption += `#ID-${quizset.id}`
mecha.sendMedia(m.chat, quizset.url, null, {
caption, 
expiration: m.expiration
}).then(key => quizset.keyId.push(key))
})
}
} catch (e) {
return mecha.reply(m.chat, func.jsonFormat(e), m)
}
}
//event adalah quiz yang di modif oleh mr.one @Liv
}

const explain = (cmd) => {
return `乂  *R K E Y*

1: 'PREMIUM'
2: 'BALANCE'
3: 'LIMIT' 
4: 'RANDOM_BALANCE'
5: 'RANDOM_LIMIT'

Format : ${cmd} question | answer | slot | rKey | rValue`
}