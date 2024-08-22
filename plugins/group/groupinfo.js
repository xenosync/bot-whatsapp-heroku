const moment = require('moment-timezone');

exports.run = {
usage: ['groupinfo'],
hidden: ['infogroup'],
category: 'group',
async: async (m, { func, mecha, setting }) => {
let set = global.db.groups[m.chat]
let meta = await (await mecha.groupMetadata(m.chat))
let admin = meta.participants.filter(v => v.admin)
let pic = await func.fetchBuffer(await mecha.profilePictureUrl(m.chat, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png'))
let caption = `乂  *G R O U P  I N F O*

	◦  *Name* : ${meta.subject}
	◦  *ID* : ${meta.id}
	◦  *Owner* : ${meta.owner ? '@' + meta.owner.split('@')[0] : m.chat.match('-') ? '@' + m.chat.split('-')[0] : ''}
	◦  *Created :* ${moment(meta.creation * 1000).format('DD/MM/YY HH:mm:ss')}
	◦  *Member :* ${meta.participants.length}
	◦  *Admin :* ${admin.length}
	
乂  *M O D E R A T I O N*

	◦  *${set.welcome ? '[ √ ]' : '[ × ]'}* Welcome Message
	◦  *${set.left ? '[ √ ]' : '[ × ]'}* Leave Message
	◦  *${set.detect ? '[ √ ]' : '[ × ]'}* Detect Message
	◦  *${set.antitoxic ? '[ √ ]' : '[ × ]'}* Anti Toxic
	◦  *${set.antilink ? '[ √ ]' : '[ × ]'}* Anti Link
	◦  *${set.antivirtex ? '[ √ ]' : '[ × ]'}* Anti Virtex
	◦  *${set.antibot ? '[ √ ]' : '[ × ]'}* Anti Bot
	◦  *${set.antiluar ? '[ √ ]' : '[ × ]'}* Anti Luar
	◦  *${set.antihidetag ? '[ √ ]' : '[ × ]'}* Anti Hidetag
	◦  *${set.antiviewonce ? '[ √ ]' : '[ × ]'}* Anti Viewonce
	◦  *${set.antidelete ? '[ √ ]' : '[ × ]'}* Anti Delete
	◦  *${set.antiedited ? '[ √ ]' : '[ × ]'}* Anti Edited
	◦  *${set.automatically ? '[ √ ]' : '[ × ]'}* Automatically

乂  *G R O U P - S T A T U S*

	◦  Muted : *${set.mute ? '√' : '×'}*
	◦  Kirim pesan : *${meta.announce ? 'Hanya admin' : 'Semua peserta'}*
	◦  Edit info grup : *${meta.restrict ? 'Hanya admin' : 'Semua peserta'}*
	◦  Expired : *${set.sewa.expired == 0 ? '-' : func.timeReverse(set.sewa.expired)}*`
mecha.sendMessageModify(m.chat, caption, m, {
largeThumb: true, 
thumbnail: pic,
expiration: m.expiration
})
},
group: true
}