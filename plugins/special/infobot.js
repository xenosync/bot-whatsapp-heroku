const fetch = require('node-fetch');

exports.run = {
  usage: ['infobot'],
  hidden: ['botinfo'],
  category: 'special',
  async: (message, { func, mecha, setting, time, calender }) => {
    const memoryUsage = func.memoryUsage(process.memoryUsage().rss);
    const hostname = process.env.HOSTNAME ?? '-';
    const platform = `${process.platform} ${process.arch}`;
    const mode = setting.self ? 'Self' : 'Public';
    const totalUsers = Object.keys(global.db.users).length;
    const totalGroups = Object.keys(global.db.groups).length;
    const serverMemory = process.env.SERVER_MEMORY !== undefined && process.env.SERVER_MEMORY !== 0 ? process.env.SERVER_MEMORY + ' MB' : '∞';
    let botInfo = `乂  *BOT INFORMATION*\n\n`
      + `*› Library* : @whiskeysockets/baileys\n`
      + `*› Versions* : ${global.version}\n`
      + `*› Memory Used* : ${memoryUsage} MB\n`
      + `*› Server Memory* : ${serverMemory}\n`
      + `*› Hostname* : ${hostname}\n`
      + `*› Platform* : ${platform}\n`
      + `*› Mode* : ${mode}\n`
      + `*› Time* : ${time} WIB\n`
      + `*› Date* : ${calender}\n`
      + `*› Total User* : ${totalUsers} Users\n`
      + `*› Total Group:* ${totalGroups} Groups`
    if (setting.fakereply) {
      fetch(setting.cover)
        .then(res => res.buffer())
        .then(thumbnailBuffer => {
          mecha.sendMessageModify(message.chat, botInfo, message, {
            title: global.header,
            body: global.footer,
            thumbnail: thumbnailBuffer,
            largeThumb: true,
            expiration: message.expiration
          });
        })
        .catch(err => {
          console.error('Failed to fetch thumbnail:', err);
          message.reply(botInfo);
        });
    } else {
      message.reply(botInfo);
    }
  }
};