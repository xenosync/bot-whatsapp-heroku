exports.run = {
usage: ['delchat'],
category: 'owner',
async: async (m, { mecha }) => {
let chat = m.text ? (m.text.endsWith('@g.us') ? m.text : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net') : m.chat;
await mecha.chatModify({delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }]}, chat)
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
},
owner: true
}