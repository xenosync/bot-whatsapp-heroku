const moment = require('moment-timezone'),
fetch = require('node-fetch');

exports.run = {
usage: ['botstat'],
category: 'special',
async: async (m, { func, mecha, setting }) => {
let blockList = await mecha.fetchBlocklist().catch((_) => []);
let groupList = async () => Object.entries(await mecha.groupFetchAllParticipating()).slice(0).map(entry => entry[1])
class Hit extends Array {
total(key) {return this.reduce((a, b) => a + (b[key] || 0), 0)}
}
let sum = new Hit(...Object.values(global.db.statistic))
const stats = {
users: Object.keys(global.db.users).length,
groups: await (await groupList()).map(v => v.id).length,
banned: Object.values(global.db.users).filter(v => v.banned).length,
premium: Object.values(global.db.users).filter(v => v.premium).length,
blocked: blockList.length,
hitstat: sum.total('hit') != 0 ? sum.total('hit') : 0,
uptime: func.runtime(process.uptime())
}
const statistic = (stats) => {
return `乂  *B O T S T A T*

◦  *${func.formatNumber(stats.groups)}* Groups Joined
◦  *${func.formatNumber(stats.users)}* Users In Database
◦  *${func.formatNumber(stats.banned)}* Users Banned
◦  *${func.formatNumber(stats.blocked)}* Users Blocked
◦  *${func.formatNumber(stats.premium)}* Premium Users
◦  *${func.formatNumber(stats.hitstat)}* Commands Hit
◦  Memory Used : *${func.fileSize(process.memoryUsage().rss)} / ${(process.env.SERVER_MEMORY != undefined && process.env.SERVER_MEMORY != 0) ? process.env.SERVER_MEMORY + ' MB' : '∞'}*
◦  Platform : *${process.platform + ' ' + process.arch}*
◦  Runtime : *${stats.uptime}*
◦  Hostname : *${process.env.HOSTNAME ?? '-'}*

乂  *S Y S T E M*

◦  *${setting.online ? '[ √ ]' : '[ × ]'}* Always Online
◦  *${setting.autosticker ? '[ √ ]' : '[ × ]'}* Auto Sticker
◦  *${setting.autoblockcmd ? '[ √ ]' : '[ × ]'}* Auto Blockcmd 
◦  *${setting.antispam ? '[ √ ]' : '[ × ]'}* Anti Spam
◦  *${setting.anticall ? '[ √ ]' : '[ × ]'}* Anti Call
◦  *${setting.gconly ? '[ √ ]' : '[ × ]'}* Group Mode
◦  *${setting.maintenance ? '[ √ ]' : '[ × ]'}* Maintenance Mode
◦  *${setting.self ? '[ √ ]' : '[ × ]'}* Self Mode
◦  Prefix : *( ${m.prefix} )*
◦  Reset At : ${moment(setting.lastreset).format('DD/MM/YYYY HH:mm')}`
}
await (setting.fakereply ? mecha.sendMessageModify(m.chat, statistic(stats), m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(statistic(stats)))
}
}