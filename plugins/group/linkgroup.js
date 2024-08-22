exports.run = {
usage: [],
hidden: ['linkgc'],
category: 'group',
async: async (m, { func, mecha }) => {
let url = await mecha.groupInviteCode(m.chat).catch((e) => m.reply(func.jsonFormat(e)))
url = 'https://chat.whatsapp.com/' + url
m.reply(url)
},
group: true,
botAdmin: true
}