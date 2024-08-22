exports.run = {
usage: ['resetlistpesan'],
hidden: ['resetlistchat'],
category: 'group',
async: async (m, { func, mecha, groups }) => {
// menghapus data member yang sudah tidak ada di grup
groups.member.filter(itemPertama => !m.members.some(itemKedua => itemKedua.id === itemPertama.jid))
.map((member, index) => {
return groups.member.splice(groups.member.indexOf(member), 1);
})
let data = groups.member.filter(v => v.chat !== undefined && v.chat > 0)
if (data.length == 0) return m.reply('Already reset.')
data.map(x => x.chat = 0);
m.reply(`Successfully reset these ${data.length} group message lists.`)
},
admin: true,
group: true
}