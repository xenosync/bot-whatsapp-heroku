const fetch = require('node-fetch');

let sound = ['sound1', 'sound2', 'sound3', 'sound4', 'sound5', 'sound6', 'sound7', 'sound8', 'sound9', 'sound10', 'sound11', 'sound12', 'sound13', 'sound14', 'sound15', 'sound16', 'sound17', 'sound18', 'sound19', 'sound20', 'sound21', 'sound22', 'sound23', 'sound24', 'sound25', 'sound26', 'sound27', 'sound28', 'sound29', 'sound30', 'sound31', 'sound32', 'sound33', 'sound34', 'sound35', 'sound36', 'sound37', 'sound38', 'sound39', 'sound40', 'sound41', 'sound42', 'sound43', 'sound44', 'sound45', 'sound46', 'sound47', 'sound48', 'sound49', 'sound50', 'sound51', 'sound52', 'sound53', 'sound54', 'sound55', 'sound56', 'sound57', 'sound58', 'sound59', 'sound60', 'sound61', 'sound62', 'sound63', 'sound64', 'sound65', 'sound66', 'sound67', 'sound68', 'sound69', 'sound70', 'sound71', 'sound72', 'sound73', 'sound74', 'sound75', 'sound76', 'sound77', 'sound78', 'sound79', 'sound80', 'sound81', 'sound82', 'sound83', 'sound84', 'sound85', 'sound86', 'sound87', 'sound88', 'sound89', 'sound90', 'sound91', 'sound92', 'sound93', 'sound94', 'sound95', 'sound96', 'sound97', 'sound98', 'sound99', 'sound100', 'sound101', 'sound102', 'sound103', 'sound104', 'sound105', 'sound106', 'sound107', 'sound108', 'sound109', 'sound110', 'sound111', 'sound112', 'sound113', 'sound114', 'sound115', 'sound116', 'sound117', 'sound118', 'sound119', 'sound120', 'sound121', 'sound122', 'sound123', 'sound124', 'sound125', 'sound126', 'sound127', 'sound128', 'sound129', 'sound130', 'sound131', 'sound132', 'sound133', 'sound134', 'sound135', 'sound136', 'sound137', 'sound138', 'sound139', 'sound140', 'sound141', 'sound142', 'sound143', 'sound144', 'sound145', 'sound146', 'sound147', 'sound148', 'sound149', 'sound150', 'sound151', 'sound152', 'sound153', 'sound154', 'sound155', 'sound156', 'sound157', 'sound158', 'sound159', 'sound160', 'sound161', 'sound162', 'sound163', 'sound164', 'sound165', 'sound166', 'sound167', 'sound168', 'sound169', 'sound170', 'sound171', 'sound172', 'sound173', 'sound174', 'sound175', 'sound176', 'sound177', 'sound178', 'sound179', 'sound180']
let mangkane = ['mangkane1', 'mangkane2', 'mangkane3', 'mangkane4', 'mangkane5', 'mangkane6', 'mangkane7', 'mangkane8', 'mangkane9', 'mangkane10', 'mangkane11', 'mangkane12', 'mangkane13', 'mangkane14', 'mangkane15', 'mangkane16', 'mangkane17', 'mangkane18', 'mangkane19', 'mangkane20', 'mangkane21', 'mangkane22', 'mangkane23', 'mangkane24', 'mangkane25', 'mangkane26', 'mangkane27', 'mangkane28', 'mangkane29', 'mangkane30', 'mangkane31', 'mangkane32', 'mangkane33', 'mangkane34', 'mangkane35', 'mangkane36', 'mangkane37', 'mangkane38', 'mangkane39', 'mangkane40', 'mangkane41', 'mangkane42', 'mangkane43', 'mangkane44', 'mangkane45', 'mangkane46', 'mangkane47', 'mangkane48', 'mangkane49', 'mangkane50', 'mangkane51', 'mangkane52', 'mangkane53', 'mangkane54']
let effect = ['acumalaka', 'reza-kecap', 'farhan-kebab', 'omaga', 'kamu-nanya', 'anjay', 'siuu']

exports.run = {
usage: ['sound', ...sound, ...mangkane, ...effect],
category: 'sound',
async: async (m, { func, mecha, setting }) => {
if (m.command === 'sound') {
let rows_sound = [];
let rows_mangkane = [];
let rows_effect = [];
for (let key of sound) {
rows_sound.push({
title: `${func.ucword(key)}`,
id: `${m.prefix + key}`
})
}
for (let key of mangkane) {
rows_mangkane.push({
title: `${func.ucword(key)}`,
id: `${m.prefix + key}`
})
}
for (let key of effect) {
rows_effect.push({
title: `${func.ucword(key)}`,
id: `${m.prefix + key}`
})
}
let sections = [{
title: `Sound TikTok ( ${sound.length} Sound )`, 
highlight_label: 'Populer Sound',
rows: rows_sound
},
{
title: `Sound Mangkane ( ${mangkane.length} Sound )`, 
highlight_label: 'Populer Sound',
rows: rows_mangkane
},
{
title: `Sound Effects ( ${effect.length} Sound )`,
highlight_label: 'Populer Sound',
rows: rows_effect
}]
let buttons = [
['list', 'Click Here ⎙', sections]
]
return mecha.sendButton(m.chat, 'S O U N D', 'Select the list button below.', global.footer, buttons, m, {
userJid: m.sender,
expiration: m.expiration
})
}
let soundUrl;
if (/sound/.test(m.command)) soundUrl = `https://raw.githubusercontent.com/Jabalsurya2105/database/master/sound/${m.command}.mp3`
if (/mangkane/.test(m.command)) soundUrl = `https://raw.githubusercontent.com/Jabalsurya2105/database/master/mangkane/${m.command}.mp3`
if (/acumalaka|reza-kecap|farhan-kebab|omaga|kamu-nanya|anjay|siuu/.test(m.command)) soundUrl = `https://raw.githubusercontent.com/Jabalsurya2105/database/master/audio/${m.command}.mp3`
if (m.text.toLowerCase() === 'cover') {
mecha.sendReact(m.chat, '🕒', m.key)
mecha.sendMessage(m.chat, {audio: {url: soundUrl}, mimetype: 'audio/mpeg', ptt: false, 
contextInfo: {
externalAdReply: {
mediaUrl: 'https://instagram.com/surya_skylark05', 
mediaType: 2, 
title: '  ⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ↻  ', 
body: '  ━━━━⬤──────────  ', 
description: 'Now Playing...',
mediaType: 2, 
sourceUrl: 'https://instagram.com/surya_skylark05',
thumbnail: await (await fetch(setting.cover)).buffer(), 
renderLargerThumbnail: true
}
}
}, {quoted: m, ephemeralExpiration: m.expiration})
} else mecha.sendMessage(m.chat, {audio: {url: soundUrl}, mimetype: 'audio/mpeg', ptt: false}, {quoted: m, ephemeralExpiration: m.expiration})
},
limit: true
}