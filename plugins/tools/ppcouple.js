const { proto, generateWAMessageFromContent, generateWAMessageContent, prepareWAMessageMedia } = require('@whiskeysockets/baileys');
const fetch = require('node-fetch');

exports.run = {
usage: ['ppcouple'],
hidden: ['ppcp'],
category: 'tools',
async: async (m, { func, mecha }) => {
mecha.sendReact(m.chat, '🕒', m.key)
let ppcouple = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/ppcouple.json').then(response => response.json())
let result = ppcouple.result.random()
let cards = [
{
header: {
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: {url: result.male} }, { upload: mecha.waUploadToServer }))
},
body: {
text: 'Cowo'
},
nativeFlowMessage: {
buttons: [{
name: 'cta_url',
buttonParamsJson: JSON.stringify({ display_text: 'Source Url', url: result.male })
}],
},
},
{
header: {
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: {url: result.female} }, { upload: mecha.waUploadToServer }))
},
body: {
text: 'Cewe'
},
nativeFlowMessage: {
buttons: [{
name: 'cta_url',
buttonParamsJson: JSON.stringify({ display_text: 'Source Url', url: result.female })
}],
},
}
]
let msg = generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: {
interactiveMessage: {
footer: {
text: 'Powered by SuryaDev.'
},
carouselMessage: {
cards: cards,
messageVersion: 1,
},
},
},
},
},
{}
)

await mecha.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id,
})
},
limit: true
}