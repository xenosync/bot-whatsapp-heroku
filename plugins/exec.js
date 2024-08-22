const fs = require('fs');
const chalk = require('chalk');
const util = require('util');
const path = require('path');
const crypto = require('crypto');
const moment = require('moment-timezone');
const phonenumber = require('awesome-phonenumber');
const baileys = require('@whiskeysockets/baileys');
const toMs = require('ms');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const ms = require('parse-ms');
const fetch = require('node-fetch');
const { exec } = require('child_process');

exports.run = {
main: async (m, { func, mecha, plugins, update, store, users, groups, setting, week, time, calender, packname, author, isBanned, isPrem, quoted, mime, froms, fkon, errorMessage, downloadMp3, YT }) => {
if (!m.budy) return
// EVAL & EXEC CODE
if (m.command === '>') {
if (!m.text) return
try {
let evaled = await eval(m.text)
if (typeof evaled !== 'string') evaled = util.inspect(evaled)
mecha.sendMessage(m.chat, {text: util.format(evaled)}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (e) {
mecha.sendMessage(m.chat, {text: util.format(e)}, {quoted: m, ephemeralExpiration: m.expiration})
}
} else if (m.command === '>_') {
if (!m.text) return
try {
const evaling = await eval(`;(async () => { ${m.text} })();`);
return mecha.sendMessage(m.chat, {text: util.format(evaling)}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (e) {
return mecha.sendMessage(m.chat, {text: util.format(e)}, {quoted: m, ephemeralExpiration: m.expiration});
}
} else if (m.command === '=>') {
if (!m.text) return 
try {
let evaled = await eval(`(async () => { return ${m.text} })()`)
mecha.sendMessage(m.chat, {text: util.format(evaled)}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (e) {
mecha.sendMessage(m.chat, {text: util.format(e)}, {quoted: m, ephemeralExpiration: m.expiration})
}
} else if (m.command === '$') {
if (!m.text) return
mecha.sendReact(m.chat, '🕒', m.key)
exec(m.text, (err, stdout) => {
if (err) return mecha.sendMessage(m.chat, {text: err.toString()}, {quoted: m, ephemeralExpiration: m.expiration})
if (stdout) return mecha.sendMessage(m.chat, {text: util.format(stdout)}, {quoted: m, ephemeralExpiration: m.expiration})
})
}
},
devs: true
}

function get(jid) {
if (jid.endsWith('@g.us')) {
return global.db.groups[jid]
} else {
jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
return global.db.users[jid]
}
};