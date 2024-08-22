exports.run = {
usage: ['revoke'],
category: 'group',
async: async (m, { func, mecha }) => {
await mecha.groupRevokeInvite(m.chat)
.then(res => m.reply(`Sukses menyetel ulang tautan grup!\nTautan baru: https://chat.whatsapp.com/${res}`))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
},
group: true,
admin: true,
boAdmin: true
}