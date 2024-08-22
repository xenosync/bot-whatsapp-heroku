exports.run = {
usage: ['sider'],
use: '(options)',
category: 'admin tools',
async: async (m, { func, mecha, groups, errorMessage }) => {
try {
let member = m.members.filter(v => v.admin == null).map(x => x.id)
var day = 86400000 * 7;
var now = Date.now();
var sider = [];
member.filter(jid => {
if (!Object.values(global.db.users).some(v => v.jid == jid) && typeof groups.member.find(x => x.jid === jid) === 'undefined' && jid != m.bot) sider.push(jid)
})
let lastseen = groups.member.filter((data) => data.lastseen).sort((a, b) => a.lastseen - b.lastseen).filter(x => x.lastseen != 0 && (now - x.lastseen > day) && (global.db.users[x.jid] && !global.db.users[x.jid].premium) && x.jid != m.bot)
if (m.args && m.args[0] == '-y') {
if (!m.isBotAdmin) return mecha.reply(m.chat, global.mess.botAdmin, m)
let array = lastseen.map(({ jid }) => jid).concat(sider)
if (array.length == 0) return m.reply('There is no sider in this group.')
for (let jid of array) {
await func.delay(2000)
await mecha.groupParticipantsUpdate(m.chat, [jid], 'remove')
}
await mecha.reply(m.chat, `Done, ${array.length} siders successfully removed.`, m)
} else {
if (sider.length == 0 && lastseen.length == 0) return m.reply('There is no sider in this group.')
let txt = `乂  *S I D E R - G R O U P*`
txt += sider.length == 0 ? '' : `\n\n“Daftar *${sider.length}* anggota tidak ada aktivitas.”`
txt += sider.length == 0 ? '' : '\n' + sider.map(v => '	◦  @' + v.replace(/@.+/, '')).join('\n')
txt += lastseen.length == 0 ? '' : `\n\n“Daftar anggota *${lastseen.length}* yang tidak online selama 1 minggu.”`
txt += lastseen.length == 0 ? '' : '\n' + lastseen.map(x => '	◦  @' + x.jid.replace(/@.+/, '') + '\n	  *Lastseen* : ' + func.toDate(now - x.lastseen).split('D')[0] + ' days ago').join('\n')
txt += `\n\n*Note* : Fitur ini akan akurat ketika bot telah berada di grup selama 1 minggu, kirim *${m.cmd} -y* untuk menghapusnya.`
mecha.reply(m.chat, txt, m)
}
} catch (e){
return errorMessage(e)
}
},
admin: true,
group: true
}