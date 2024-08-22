exports.run = {
usage: ['delwerewolf'],
hidden: ['delww'],
category: 'games',
async: async (m, { func, mecha }) => {
if (!(m.chat in global.db.werewolf)) return m.reply(`Tidak ada sesi game werewolf di grup ini`)
if (m.isAdmin || m.isOwner) {
delete global.db.werewolf[m.chat];
m.reply(`Berhasil menghapus sesi werewolf di grup ini`)
} else if (global.db.werewolf[m.chat].owner.includes(m.sender)) {
delete global.db.werewolf[m.chat];
m.reply(`Berhasil menghapus sesi werewolf di grup ini`)
} else {
m.reply(`Hanya @${global.db.werewolf[m.chat]?.owner?.split('@')[0]} yang dapat menghapus sesi game ini`);
}
},
group: true
}