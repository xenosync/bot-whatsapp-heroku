exports.run = {
usage: ['black', 'white', 'blacklist'],
use: 'mention or reply',
category: 'admin tools',
async: async (m, { func, mecha, groups, froms }) => {
/* mencegah data blacklist menjadi duplikat */
let uniqueJids = new Set();
let result = groups.blacklist.filter(jid => {
if (!uniqueJids.has(jid)) {
uniqueJids.add(jid);
return true;
}
return false;
});
groups.blacklist = result;

switch (m.command) {
case 'black':
if (!froms) return m.reply(func.example(m.cmd, '@0'))
if (groups.blacklist.includes(froms)) return m.reply(`'@${froms.split('@')[0]}' already in the blacklist.`)
groups.blacklist.push(froms)
m.reply(`'@${froms.split('@')[0]}' added successfully!`)
break
case 'white':
if (!froms) return m.reply(func.example(m.prefix + m.command, '@0'))
if (!groups.blacklist.includes(froms)) return m.reply(`'@${froms.split('@')[0]}' not in blacklist.`)
groups.blacklist.splice(groups.blacklist.indexOf(froms), 1)
m.reply(`'@${froms.split('@')[0]}' has been removed.`)
break
case 'blacklist':
if (groups.blacklist.length == 0) return m.reply('Empty data.')
let txt = `乂  *B L A C K - L I S T*\n\nTotal : ${groups.blacklist.length}\n`
for (let jid of groups.blacklist) {
txt += `\n◦  @${jid.split('@')[0]}`
}
m.reply(txt)
break
}
},
group: true,
admin: true
}