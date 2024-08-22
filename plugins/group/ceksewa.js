exports.run = {
usage: ['ceksewa'],
category: 'group',
async: async (m, { func, mecha, groups }) => {
if (!groups.sewa.status) return m.reply(`Grup ini tidak terdaftar dalam list sewabot. Ketik ${m.prefix}listsewa untuk info lebih lanjut`)
let txt = `乂  *CEK SEWA GROUP*\n`
txt += `\n◦  *Group* : ${m.groupName}`
txt += `\n◦  *ID* : ${m.chat}`
txt += `\n◦  *Expire* : ${groups.sewa.expired === 'PERMANENT' ? 'PERMANENT' : func.expireTime(groups.sewa.expired)}`
m.reply(txt)
},
group: true
}