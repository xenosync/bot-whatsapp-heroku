exports.run = {
main: async (m, { mecha, store, groups, errorMessage }) => {
mecha.edited = mecha.edited ? mecha.edited : {};
try {
if (groups.antiedited && m.mtype === 'editedMessage') {
const key = m.msg.message.protocolMessage.key;
if (!key) return;
// Memeriksa apakah pesan sudah dimuat sebelumnya
if (!mecha.edited[key.id]) {
const edit = await store.loadMessage(key.remoteJid, key.id);
if (!edit) return;
mecha.edited[key.id] = {
jid: edit.key.participant,
from: edit.message?.extendedTextMessage?.text ?? edit?.message?.conversation,
to: m.msg.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text ?? m.msg.message?.protocolMessage?.editedMessage?.conversation
};
}

const data = mecha.edited[key.id];
if (!data || typeof data.from === 'undefined') return;
const newText = m.msg.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text ?? m.msg.message?.protocolMessage?.editedMessage?.conversation;
let txt = `乂  *E D I T E D - M E S S A G E*\n\n`
txt += `@${data.jid.replace(/@.+/, '')} edited the message.\n\n`;
txt += `➠ *From* : ${data.from}\n`;
txt += `➠ *To* : ${newText !== data.to ? newText : data.to}`;
mecha.edited[key.id].from = newText;
await mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
}
} catch (e) {
return errorMessage(e)
}
},
group: true
}