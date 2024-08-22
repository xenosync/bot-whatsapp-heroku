exports.run = {
usage: ['addowner', 'delowner', 'listowner'],
use: 'mention or reply',
category: 'owner',
async: async (m, { func, mecha, setting, froms }) => {
switch (m.command) {
case 'addowner':
if (setting.owner.length >= 100) return m.reply('Jumlah owner sudah max.')
if (!froms) return m.reply('Mention or Reply chat target.')
if (setting.owner.includes(froms)) return m.reply(`@${froms.split('@')[0]} already in the database.`)
setting.owner.push(froms)
m.reply(`Successfully added @${froms.split('@')[0]} as owner`)
break
case 'delowner':
if (!froms) return m.reply('Mention or Reply chat target.')
if (!setting.owner.includes(froms)) return m.reply(`@${froms.split('@')[0]} not in database.`)
if (global.devs.includes(froms)) return m.reply('Access denied.');
setting.owner.splice(setting.owner.indexOf(froms), 1)
m.reply(`Successfully removed @${froms.split('@')[0]} from owner`)
break
case 'listowner':
if (setting.owner.length == 0) return m.reply('Empty data.')
let txt = `乂  *L I S T - O W N E R*\n\nTotal : ${setting.owner.length}\n`
for (let [index, jid] of setting.owner.entries()) {
txt += `\n${index + 1}. @${jid.split('@')[0]}`
}
m.reply(txt)
break
}
},
devs: true
}