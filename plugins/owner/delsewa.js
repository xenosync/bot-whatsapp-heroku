exports.run = {
usage: ['delsewa'],
use: 'link group',
category: 'owner',
async: async (m, { func, mecha }) => {
if (m.isPc){
if (!m.text) return m.reply(func.example(m.cmd, 'https://chat.whatsapp.com/codeInvite'))
let link = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
let [_, code] = m.args[0].match(link) || []
if (!code) return m.reply('No invite url detected.');
let res = await mecha.groupQueryInvite(code)
if (!res) return m.reply(func.jsonFormat(res))
if (!global.db.groups[res.id].sewa.status) return m.reply('Grup tersebut tidak ada di list sewa!')
global.db.groups[res.id].sewa.expired = 0;
global.db.groups[res.id].sewa.status = false;
m.reply(`Successfully deleted rent to this group`)
} else if (m.isGc){
if (!global.db.groups[m.chat].sewa.status) return m.reply('Grup ini tidak ada di list sewa!')
global.db.groups[m.chat].sewa.expired = 0;
global.db.groups[m.chat].sewa.status = false;
m.reply(`Successfully deleted rent to this group`)
}
},
devs: true
}