const fs = require('fs')

exports.run = {
usage: ['update'],
hidden: ['up'], 
use: 'reply code',
category: 'owner',
async: async (m, { func, mecha, quoted }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'handler + reply code'))
if (!m.quoted) return m.reply('Reply text atau file scriptnya.');
let value = m.text.toLowerCase();
let path;
let data;
if (value === 'handler') path = './handler.js';
else if (value === 'main') path = './main.js';
else if (value === 'config') path = './config.js'
else if (value === 'extra') path = './system/extra.js'
else if (value === 'console') path = './system/console.js'
else if (value === 'database') path = './system/database.js'
else if (value === 'localdb') path = './system/localdb.js'
else if (value === 'mongodb') path = './system/mongodb.js'
else if (value === 'detects') path = './system/detects.js'
else if (value === 'baileys') path = './system/baileys.js'
else if (value === 'jadibot') path = './system/jadibot.js'
else if (value === 'groups') path = './system/groups.js'
else if (value === 'events') path = './system/events.js'
else if (value === 'functions') path = './system/functions.js'
else return m.reply('Format invalid!')
if (/application\/javascript/.test(quoted.mime)) data = await quoted.download();
else data = m.quoted.text;
await fs.writeFileSync(path, data);
await mecha.sendReact(m.chat, '✅', m.key)
},
devs: true
}