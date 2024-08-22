exports.run = {
usage: ['totalwin'],
hidden: ['totalmenang'],
category: 'games',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender].game;
let txt = `乂  *LIST TOTAL WIN GAME*\n\n`
let totalwin = 0;
for (let x in user) totalwin += user[x];
if (totalwin == 0) return m.reply('Data kosong.')
for (let x in user) {
if (user[x] == 0) continue;
txt += `◦  ${func.ucword(x)} : ${user[x]}\n`;
}
txt += `\nTotal : *${totalwin}*`;
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
}
}