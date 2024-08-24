const fs = require('fs');
const fetch = require('node-fetch');

exports.run = {
  usage: ['menu'],
  hidden: ['allmenu'],
  async: async (m, { func, mecha, plugins, setting }) => {
    mecha.sendReact(m.chat, '🕒', m.key);
    
    const sizedb = fs.statSync('./database/database.json').size;
    const typedb = /mongo/.test(global.mongoUrl) ? 'MongoDB' : `Local (${func.fileSize(sizedb)})`;
    const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    const library = packages.dependencies['@adiwajshing/baileys'] ? '@adiwajshing/baileys@^' + require('@adiwajshing/baileys/package.json').version : packages.dependencies['@whiskeysockets/baileys'] ? '@whiskeysockets/baileys@^' + require('@whiskeysockets/baileys/package.json').version : 'baileys';
    const version = `${packages.name} v${packages.version}`;
    const hit_today = func.formatNumber(Object.entries(global.db.statistic).map((v) => v[1].hittoday).reduce((a, b) => a + b));
    const total_hit = func.formatNumber(Object.entries(global.db.statistic).map((v) => v[1].hit).reduce((a, b) => a + b));
    const style = setting.style;

    const message = `Database: ${typedb}
Library: ${library}
Version: ${version}
Total Features: ${func.totalFeature(plugins)}
Memory Used: ${func.fileSize(process.memoryUsage().rss)} / ${(process.env.SERVER_MEMORY !== undefined && process.env.SERVER_MEMORY !== 0) ? process.env.SERVER_MEMORY + ' MB' : '∞'}
Platform: ${process.platform + ' ' + process.arch}`;

    try {
      let filter = Object.entries(plugins).filter(([_, v]) => v.run?.usage);
      let cmd = Object.fromEntries(filter);
      let category = {};
      
      for (let name in cmd) {
        let obj = cmd[name].run;
        if (!obj || !obj.category) continue;
        if (category[obj.category]) category[obj.category].push(obj);
        else category[obj.category] = [obj];
      }
      
      const keys = Object.keys(category).sort();
      let menu;
      for (let feature of keys) if (m.text.toLowerCase() === feature) menu = feature;

      if (m.text.toLowerCase() === menu) {
        let caption = `乂  *${menu.toUpperCase().split('').join(' ')}*\n\n`;
        let commands = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == menu.toLowerCase())
          .flatMap(([_, v]) => {
            if (Array.isArray(v.run.usage)) {
              return v.run.usage.map(x => ({
                usage: x,
                use: v.run.use ? func.texted('bold', v.run.use) : '',
                info: v.run.premium ? '🅟' : v.run.limit ? '🅛︎' : ''
              }));
            } else {
              return [{
                usage: v.run.usage,
                use: v.run.use ? func.texted('bold', v.run.use) : '',
                info: v.run.premium ? '🅟' : v.run.limit ? '🅛︎' : ''
              }];
            }
          });

        caption += commands.sort((a, b) => a.usage.localeCompare(b.usage))
          .map(v => `◦  ${m.prefix}${v.usage} ${v.use} ${v.info}`).join('\n');

        switch (style) {
          case 1:
            await mecha.reply(m.chat, caption + '\n\n' + global.footer, m, { expiration: m.expiration });
            break;
          case 2:
            await mecha.sendMessageModify(m.chat, caption + '\n\n' + global.footer, m, {
              title: global.header,
              body: global.footer,
              thumbnail: await (await fetch(setting.cover)).buffer(),
              largeThumb: true,
              url: setting.link,
              expiration: m.expiration
            });
            break;
          case 3:
            await mecha.sendMessage(m.chat, {
              document: { url: setting.cover },
              fileName: 'A L L - M E N U',
              fileLength: 100000000000000,
              pageCount: '2024',
              caption: caption + '\n\n' + global.footer,
              mimetype: 'image/png',
              jpegThumbnail: await mecha.resize(setting.cover, 400, 400),
              contextInfo: {
                externalAdReply: {
                  title: global.header,
                  body: global.footer,
                  thumbnailUrl: setting.cover,
                  sourceUrl: null,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
                forwardingScore: 10,
                isForwarded: true,
                mentionedJid: mecha.ments(caption),
              }
            }, { quoted: m, ephemeralExpiration: m.expiration });
            break;
        }
      } else if (m.command === 'allmenu' || m.text.toLowerCase() === 'all') {
        let caption = message;
        caption += String.fromCharCode(8206).repeat(4001);
        for (let k of keys) {
          caption += `\n\n乂  *${k.toUpperCase().split('').join(' ')}*\n\n`;
          let commands = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
            .flatMap(([_, v]) => {
              if (Array.isArray(v.run.usage)) {
                return v.run.usage.map(x => ({
                  usage: x,
                  use: v.run.use ? func.texted('bold', v.run.use) : ''
                }));
              } else {
                return [{
                  usage: v.run.usage,
                  use: v.run.use ? func.texted('bold', v.run.use) : ''
                }];
              }
            });
          caption += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `◦  ${m.prefix}${v.usage} ${v.use}`).join('\n');
        }
        switch (style) {
          case 1:
            await mecha.reply(m.chat, caption + '\n\n' + global.footer, m, { expiration: m.expiration });
            break;
          case 2:
            await mecha.sendMessage(m.chat, {
              text: caption + '\n\n' + global.footer,
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 2023,
                isForwarded: true,
                externalAdReply: {
                  title: global.header,
                  body: global.footer,
                  thumbnailUrl: setting.cover,
                  thumbnail: await (await fetch(setting.cover)).buffer(),
                  sourceUrl: setting.link,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                }
              }
            }, { quoted: m, ephemeralExpiration: m.expiration });
            break;
          case 3:
            await mecha.sendMessage(m.chat, {
              document: { url: setting.cover },
              fileName: 'A L L - M E N U',
              fileLength: 100000000000000,
              pageCount: '2024',
              caption: caption + '\n\n' + global.footer,
              mimetype: 'image/png',
              jpegThumbnail: await mecha.resize(setting.cover, 400, 400),
              contextInfo: {
                externalAdReply: {
                  title: global.header,
                  body: global.footer,
                  thumbnailUrl: setting.cover,
                  sourceUrl: null,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
                forwardingScore: 10,
                isForwarded: true,
                mentionedJid: mecha.ments(caption),
              }
            }, { quoted: m, ephemeralExpiration: m.expiration });
            break;
        }
      } else {
        let caption = message;
        caption += '\n' + String.fromCharCode(8206).repeat(4001);
        caption += `\n┌  ◦  ${m.prefix}menu ${keys[0]}`;
        keys.filter((key) => key !== keys[0]).forEach(category => {
          caption += `\n│  ◦  ${m.prefix}menu ${category}`;
        });
        caption += `\n└  ◦  ${m.prefix}menu all`;
        switch (style) {
          case 1:
            await mecha.reply(m.chat, caption + '\n\n' + global.footer, m, { expiration: m.expiration });
            break;
          case 2:
            await mecha.sendMessageModify(m.chat, caption + '\n\n' + global.footer, m, {
              title: global.header,
              body: global.footer,
              thumbnail: await (await fetch(setting.cover)).buffer(),
              largeThumb: true,
              url: setting.link,
              expiration: m.expiration
            });
            break;
          case 3:
            await mecha.sendMessage(m.chat, {
              document: { url: setting.cover },
              fileName: 'A L L - M E N U',
              fileLength: 100000000000000,
              pageCount: '2024',
              caption: caption + '\n\n' + global.footer,
              mimetype: 'image/png',
              jpegThumbnail: await mecha.resize(setting.cover, 400, 400),
              contextInfo: {
                externalAdReply: {
                  title: global.header,
                  body: global.footer,
                  thumbnailUrl: setting.cover,
                  sourceUrl: null,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
                forwardingScore: 10,
                isForwarded: true,
                mentionedJid: mecha.ments(caption),
              }
            }, { quoted: m, ephemeralExpiration: m.expiration });
            break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
  error: false,
  limit: false,
  location: __filename,
};

