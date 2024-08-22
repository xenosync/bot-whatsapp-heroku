const fs = require('fs'), fetch = require('node-fetch');

exports.run = {
  usage: ['menfes', 'stopmenfes'],
  category: 'tools',
  async: async (m, { func, mecha }) => {
    const [nomor, pesan] = m.text.split(',');
    switch (m.command) {
      case 'menfes':
        if (!m.isPc) return m.reply(global.mess.private);
        if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit);
        if (Object.values(global.db.menfes).find(room => [room.a, room.b].includes(m.sender))) 
          return m.reply(`Kamu masih berada dalam sesi menfes\nkirim ${m.prefix}stopmenfes untuk stop menfes`);
        if (!(nomor && pesan)) return m.reply(`Kirim Perintah ${m.cmd} nomor,pesan\n\nContoh :\n${m.prefix + m.command} +62xxx,Halo`);
        let crush = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        if (Object.values(global.db.menfes).find(room => [room.a, room.b].includes(crush))) 
          return m.reply('Orang yang kamu menfes sedang menfes bersama orang lain :)');
        if (crush.startsWith('0')) return m.reply(`Awali nomor dengan +62`);
        let cekno = await mecha.onWhatsApp(crush);
        if (cekno.length == 0) return m.reply(`Masukkan nomor yang valid dan terdaftar di WhatsApp!`);
        if (crush === m.sender) return m.reply(`Tidak bisa menfes diri sendiri!`);
        if (crush === m.bot) return m.reply(`Tidak bisa menfes bot!`);
        let txt = `Hi ada menfess nih buat kamu\n\nPesan : ${pesan}\n\n*Kirim (Y/N)* untuk menerima atau menolak menfes\n\n_Pesan ini di tulis oleh seseorang, bot hanya menyampaikan saja_`,
          id = mecha.makeid(9).toUpperCase();
        global.db.menfes[id] = { id, a: m.sender, b: crush, status: 'WAITING' };
        await mecha.sendMessageModify(crush, txt, null, {
          title: global.header, body: global.footer, thumbnail: await (await fetch('https://telegra.ph/file/de9c0b200515ed2b0bb5e.jpg')).buffer(), 
          largeThumb: true, expiration: m.expiration });
        mecha.reply(m.chat, `Pesan terkirim ke @${crush.split('@')[0]}\nSilahkan tunggu balasannya..`, m);
        break;
      case 'stopmenfes':
        if (!m.isPc) return m.reply(global.mess.private);
        let room = Object.values(global.db.menfes).find(room => [room.a, room.b].includes(m.sender));
        if (!room) return m.reply('Belum ada sesi menfes!');
        let tujuan = room.a == m.sender ? room.b : room.a;
        await mecha.reply(tujuan, `Teman chat kamu telah menghentikan menfes ini.`, func.fstatus('System Notification'));
        await mecha.reply(m.chat, 'Menfes berhasil di putuskan!', m);
        delete global.db.menfes[room.id];
        break;
    }
  },
  main: async (m, { func, mecha }) => {
    if (m.isPc && !m.fromMe) {
      let room = Object.values(global.db.menfes).find(room => room.status == 'WAITING' && [room.a, room.b].includes(m.sender)),
        txt = `Chat Sudah Terhubung✓\nSilahkan Kirim Pesan\nAtau bisa kirim media seperti Sticker/Audio/Video/Image/VN\n\nDilarang Spam Room Chat\nKetahuan : Banned\n\nJika pesan kamu direaction : 📬\nBerarti pesan kamu diteruskan\n\n_Ketik ${m.prefix}stopmenfes untuk stop_`;
      if (room && m.sender == room.b && room.status == 'WAITING') {
        if (func.somematch(['y', 'terima'], m.budy.toLowerCase())) {
          room.status = 'CHATTING';
          await mecha.reply(room.a, txt, func.fstatus('System Notification'));
          await mecha.reply(room.b, txt, func.fstatus('System Notification'));
        } else if (func.somematch(['n', 'tolak'], m.budy.toLowerCase())) {
          await mecha.reply(room.b, 'Menfes berhasil di tolak.', m);
          await mecha.reply(room.a, `@${room.b.split('@')[0]} menolak menfes kamu :(`, func.fstatus('System Notification'));
          delete global.db.menfes[room.id];
        } else return m.reply(`Mohon masukkan keyword dengan benar!\n\n_kirim Y untuk menerima menfes dan kirim N untuk menolak menfes._`);
      }
    }
    if (m.isPc && !m.isPrefix && !m.fromMe) {
      let room = Object.values(global.db.menfes).find(room => room.status == 'CHATTING' && [room.a, room.b].includes(m.sender));
      if (room) {
        let other = room.a == m.sender ? room.b : room.a;
        await mecha.copyNForward(other, m, true, m.quoted && m.quoted.fromMe ? { contextInfo: { ...m.msg.contextInfo, participant: other } } : {});
        await mecha.sendMessage(m.chat, { react: { text: '📬', key: m.key } });
      }
    }
  },
  private: true
}