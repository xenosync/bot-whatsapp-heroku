const os = require('os');
const fetch = require('node-fetch');

exports.run = {
  usage: ['server'],
  category: 'special',
  async: async (m, { func, mecha, setting }) => {
    let server = await func.fetchJson('http://ip-api.com/json');
    delete server.status;
    const actualUptime = os.uptime();
    const fakeUptime = actualUptime + 100 * 86400;
    const fakeUptimeFormatted = func.toTime(fakeUptime * 1000);
    let txt = `乂  *S E R V E R*\n\n`;
    txt += `┌  ◦  OS : ${os.type()} (${os.arch()} / ${os.release()})\n`;
    txt += `│  ◦  Ram : ${func.formatSize(process.memoryUsage().rss)} / ${func.formatSize(os.totalmem())}\n`;
    for (let key in server) {
      txt += `│  ◦  ${func.ucword(key)} : ${server[key]}\n`;
    }
    txt += `│  ◦  Uptime : ${fakeUptimeFormatted}\n`;
    txt += `└  ◦  Processor : ${process.platform == 'linux' ? os.cpus()[0].model : '-'}\n\n`;
    await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
      title: global.header,
      body: global.footer,
      thumbnail: await (await fetch(setting.cover)).buffer(),
      largeThumb: true,
      expiration: m.expiration
    }) : m.reply(txt));
  }
};