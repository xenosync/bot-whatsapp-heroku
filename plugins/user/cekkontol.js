exports.run = {
usage: ['cekkontol'],
hidden: ['cektol'],
category: 'user',
async: async (m, { func, mecha, froms }) => {
if (!froms) return m.reply('Mention or Reply chat target.')
let array = [
'hitam',
'pink',
'rgb',
'ungu',
'merah',
'kuning',
'hijau',
'cyan',
'biru', 
'magenta',
'kecil awokawok',
'lumayan gede',
'besar dan berurat',
'besar dan panjang',
'ga punya kontol',
// tambahin sendiri
]
let kontol = array[Math.floor(Math.random() * array.length)]
return await m.reply(`Kontol @${froms.replace(/[^0-9]/g, '')} adalah *${kontol}*`)
},
limit: true
}