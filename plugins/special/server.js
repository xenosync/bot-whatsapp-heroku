const os = require('os');
const fetch = require('node-fetch');

exports.run = {
  usage: ['server'],
  category: 'special',
  async: async (m, { func, mecha, setting }) => {
    let server = await func.fetchJson('http://ip-api.com/json');
    delete server.status;
    const totalMemory = os.totalmem(), freeMemory = os.freemem();
    const usedMemoryPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
    const fakeUptimeFormatted = func.toTime((os.uptime() + 100 * 86400) * 1000);
    let txt = `乂  *S E R V E R*\n\n`;
    txt += `┌  ◦  OS : ${os.type()} (${os.arch()} / ${os.release()})\n`;
    txt += `│  ◦  Ram : ${func.formatSize(totalMemory - freeMemory)} / ${func.formatSize(totalMemory)} (${usedMemoryPercentage.toFixed(2)}% digunakan)\n`;
    for (let key in server) txt += `│  ◦  ${func.ucword(key)} : ${server[key]}\n`;
    txt += `│  ◦  Uptime : ${fakeUptimeFormatted}\n`;
    txt += `└  ◦  Processor : ${process.platform == 'linux' ? os.cpus()[0].model : '-'}`;
    await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
      title: global.header,
      body: global.footer,
      thumbnail: await (await fetch(setting.cover)).buffer(),
      largeThumb: true,
      expiration: m.expiration
    }) : m.reply(txt));
  }
};