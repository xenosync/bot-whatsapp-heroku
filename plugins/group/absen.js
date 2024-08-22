exports.run = {
usage: ['mulaiabsen', 'absen', 'cekabsen', 'hapusabsen'],
use: 'alasan',
category: 'group',
async: async (m, { mecha, calender, groups }) => {
switch (m.command) {
case 'mulaiabsen':
if (!m.isAdmin && !m.isOwner) return m.reply(global.mess.admin)
if (m.chat in groups.absen) return m.reply(`Masih ada absen di grup ini!\n\nkirim *${m.prefix}hapusabsen* untuk menghapus absen`)
groups.absen[m.chat] = {
alasan: m.text ? m.text : '-',
date: calender,
peserta: []
}
m.reply(`乂  *ABSEN DI MULAI*

Tanggal : ${groups.absen[m.chat].date}
Alasan : ${groups.absen[m.chat].alasan}

kirim *${m.prefix}absen* untuk absen`)
break
case 'absen':
if (!(m.chat in groups.absen)) return m.reply(`Tidak ada absen di grup ini!`)
let isAbsen = groups.absen[m.chat].peserta.includes(m.sender)
if (isAbsen) return m.reply('Kamu sudah Absen!')
groups.absen[m.chat].peserta.push(m.sender)
m.reply(`乂  *A B S E N*

Tanggal : ${groups.absen[m.chat].date}
Alasan : ${groups.absen[m.chat].alasan}
Total : ${groups.absen[m.chat].peserta.length}
Daftar Absen : \n${groups.absen[m.chat].peserta.map((v, i) => '◦  ' + (i + 1) + '. @' + v.split('@')[0]).join('\n')}

kirim *${m.prefix}absen* untuk absen`)
break
case 'cekabsen':
if (!(m.chat in groups.absen)) return m.reply('Tidak ada absen yang berlangsung!')
m.reply(`乂  ${m.groupName}

Tanggal : ${groups.absen[m.chat].date}
Alasan : ${groups.absen[m.chat].alasan}
Total : ${groups.absen[m.chat].peserta.length}
Daftar Absen : \n${groups.absen[m.chat].peserta.map((v, i) => '◦  ' + (i + 1) + '. @' + v.split('@')[0]).join('\n')}

kirim *${m.prefix}absen* untuk absen`)
break
case 'hapusabsen':
if (!m.isAdmin && !m.isOwner) return m.reply(global.mess.admin)
if (!(m.chat in groups.absen)) return m.reply('Tidak ada absen yang berlangsung!')
delete groups.absen[m.chat]
m.reply('Absen berhasil dihapus')
break
}
},
group: true
}