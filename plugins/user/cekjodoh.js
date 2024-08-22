exports.run = {
usage: ['cekjodoh'],
hidden: ['jodohku'],
category: 'user',
async: async (m, { func, mecha }) => {
let user = Object.values(global.db.users).filter(x => !x.banned && x.jid != m.sender && x.jid != m.bot).map(v => v.jid);
let jodoh = user[Math.floor(Math.random() * user.length)];
let txt = `Jodohmu adalah @${jodoh.split('@')[0]} ❤️ @${m.sender.split('@')[0]}`
await m.reply(txt)
},
limit: true
}