/* module */
const fs = require('fs');
const chalk = require('chalk');
const ms = require('parse-ms');
const path = require('path');
const util = require('util');
const ytdl = require('ytdl-core');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const crypto = require('crypto');
const moment = require('moment-timezone');
const archiver = require('archiver');
const speed = require('performance-now');
const FormData = require('form-data');
const { read, MIME_JPEG, RESIZE_BILINEAR, AUTO } = require('jimp');
const { fromBuffer } = require('file-type');
const { exec } = require('child_process');
const func = new Object();

/* FUNCTION BY SURYA DEV */
func.readmore = String.fromCharCode(8206).repeat(4001) 

func.logFile = (log, filename = 'bot') => {
if (typeof log === 'object') log = JSON.stringify(log, null, 2)
const logfile = fs.createWriteStream(path.join(process.cwd(), `${filename}.log`), { flags: 'a' })
const time = moment(new Date() * 1).format('DD/MM/YY HH:mm:ss')
logfile.write(`[${time}] - ${log}\n`)
}

func.checkError = (err) => {
let status = false;
let e = String(err);
if (e.includes('rate-overlimit')) status = true;
else if (e.includes('internal-server-error')) status = true;
else if (e.includes('this.isZero')) status = true;
else if (e.includes('Connection Closed')) status = true;
else if (e.includes('Timed Out')) status = true;
else if (e.includes('Value not found')) status = true;
else if (e.includes('service-unavailable')) status = true;
else if (e.includes('Maximum call stack size exceeded')) status = true;
func.logFile(util.format(err), 'error');
return status;
}

func.expiration = function(duration) {
return duration == 7776000 ? 7776000 
: duration == 604800 ? 604800 
: duration == 86400 ? 86400 
: duration == 0 ? 0 
: 86400;
}

func.messageId = function(length) {
return 'MECHA' + crypto.randomBytes(length).toString('hex').toUpperCase()
}

func.ceklimit = function(jid, limit = 1) {
let status = false
if (global.db.users[jid].limit < 1 && !global.db.users[jid].premium) {
status = true
} else {
global.db.users[jid].limit -= limit
}
return status;
}

func.removeDuplicateLetters = function(array) {
let newArray = array.map(word => {
return word.replace(/(.)\1+/g, '$1');
});
return newArray;
}

func.totalFeature = function(plugins) {
let totalUsage = 0;
for (let plugin in plugins) {
if (plugins[plugin].run && Array.isArray(plugins[plugin].run.usage)) {
totalUsage += plugins[plugin].run.usage.length;
}
}
return totalUsage
}

func.hadiah = (hadiah) => {
let min = hadiah?.min || 1000;
let max = hadiah?.max || 3000;
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}

func.ping = (length = 4) => {
let timestamp = speed();
let latensi = speed() - timestamp;
return latensi.toFixed(length);
}

func.timezone = function () {
const today = new Date();
const date = new Date(today.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
// mengambil nama hari dalam bahasa Inggris.
const dayOfWeek = today.toLocaleDateString('id-ID', { weekday: 'long' });
const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
return {
date: `${dayOfWeek}, ${day} ${months[month]} ${year}`,
time: `${timeNow} WIB`
}
}

func.backupSC = async () => {
let backupName = `backup_${new Date().toISOString().replace(/:/g, '-')}.zip`
let output = fs.createWriteStream(backupName);
let archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
archive.on('warning', function (err) {
if (err.code === 'ENOENT') {
console.warn(err);
} else {
throw err;
}
});
archive.glob('**/*', {
cwd: process.cwd(),
ignore: ['node_modules/**/*', 'sampah/**/*', 'core/**', '.cache/**', '.npm/**', backupName]
});
await archive.finalize()
return {
name: backupName,
size: (archive.pointer() / 1024 / 1024).toFixed(2)
}
}

func.addcommand = function(cmd) {
if (/bot|test/.test(cmd)) return
if (typeof global.db == 'undefined') return
if (!global.db.statistic[cmd]) {
global.db.statistic[cmd] = {
name: cmd,
hit: 1,
hittoday: 1,
lastused: Date.now()
}
} else {
global.db.statistic[cmd].hittoday += 1;
global.db.statistic[cmd].hit += 1;
global.db.statistic[cmd].lastused = Date.now();
}
}

func.restart = () => {
let main = require('./package.json').scripts.start;
if (main === 'pm2 start main.js && pm2 save && pm2 logs') {
exec('pm2 restart main', (error, stdout, stderr) => {
return stdout;
})
} else if (main === 'node index.js') {
process.send('reset');
} else if (main === 'node main.js') {
process.exit();
}
}

func.escapeRegExp = function(string) {
return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&')
}

func.delay = (ms) => {
return new Promise(res => setTimeout(res, ms))
}

func.wa = (number) => {
return number.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
}

func.tag = (number) => {
let user = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
return '@' + user.replace(/@.+/, '')
}

func.print = (message) => {
return console.log(message)
}

func.fstatus = (text = '') => {
return {
key: {
fromMe: false, 
remoteJid: 'status@broadcast', 
participant: '0@s.whatsapp.net'
}, 
message: {
extendedTextMessage: {
text: text
},
},
}
}

func.fpayment = {
key: {
remoteJid: '0@s.whatsapp.net', 
fromMe: false, 
id: 'Mecha Bot Multi Device', 
participant: '0@s.whatsapp.net'
},
message: {
requestPaymentMessage: {
currencyCodeIso4217: 'USD', 
amount1000: 2024, 
requestFrom: '0@s.whatsapp.net',
noteMessage: {
extendedTextMessage: {
text: 'Copyright © 2024 SuryaDev, AI. Mecha-Bot'
}
}, 
expiryTimestamp: 2023, 
amount: {
value: 1000000000000000, 
offset: 1000, 
currencyCode: 'USD'
},
},
},
}

func.fverified = {
key: {
participant: '0@s.whatsapp.net', 
remoteJid: '0@s.whatsapp.net'
},
message: {
conversation: 'Mecha Verified By WhatsApp'
}
}

func.ftroli = (text = '', thumb) => {
return {
key: {
fromMe: false,
remoteJid: 'status@broadcast',
participant: '0@s.whatsapp.net'
}, message: {
orderMessage: {
itemCount: 1000000,
status: 1,
surface: 1, 
message: text,
orderTitle: 'Copyright © 2024 SuryaDev.',
thumbnail: thumb, 
sellerJid: '0@s.whatsapp.net'
},
},
}
}

func.color = (text, color) => {
return chalk.keyword(color || 'green').bold(text)
}

func.bgcolor = (text, bgcolor) => {
return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

func.reloadFile = (file) => {
file = require.resolve(file)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.greenBright.bold('[ UPDATE ]'), chalk.whiteBright(moment(Date.now()).format('DD/MM/YY HH:mm:ss')), chalk.cyan.bold('➠ ' + path.basename(file)))
delete require.cache[file]
require(file)
})
}

func.isNumber = (number) => {
if (!number) return number
number = parseInt(number)
return typeof number == 'number' && !isNaN(number)
}

func.somematch = (data, id) => {
let status = data.find((x) => x === id)
return status ? true : false;
}

func.ranNumb = (min, max = null) => {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

func.WAVersion = async () => {
let get = await fetch("https://web.whatsapp.com/check-update?version=1&platform=web").then(data => data.json())
let version = [get.currentVersion.replace(/[.]/g, ', ')]
return version
}

func.afkTime = function(ms) {
let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
var dDisplay = d > 0 ? d + (d == 1 ? ' hari, ' : ' hari, ') : '';
var hDisplay = h > 0 ? h + (h == 1 ? ' jam, ' : ' jam, ') : '';
var mDisplay = m > 0 ? m + (m == 1 ? ' menit, ' : ' menit, ') : '';
var sDisplay = s > 0 ? s + (s == 1 ? ' detik' : ' detik') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
}

func.expireTime = function(time) {
let cek = ms(time - Date.now())
return `${cek.days} day ${cek.hours} hour ${cek.minutes} minute ${cek.seconds} second`
}

func.toTime = function(time) {
let cek = ms(time)
let d = cek.days
let h = cek.hours
let m = cek.minutes
let s = cek.seconds
var dDisplay = d != 0 ? d + ' hari, ' : '';
var hDisplay = h != 0 ? h + ' jam, ' : '';
var mDisplay = m != 0 ? m + ' menit, ' : '';
var sDisplay = s != 0 ? s + ' detik' : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
}

func.timeReverse = function(duration) {
let cek = ms(duration - Date.now())
return `${cek.days}D ${cek.hours}H ${cek.minutes}M ${cek.seconds}S`
}

func.formatMs = function(ms) {
let days = Math.floor(ms / (24 * 60 * 60 * 1000));
let daysms = ms % (24 * 60 * 60 * 1000);
let hours = Math.floor(daysms / (60 * 60 * 1000));
let hoursms = ms % (60 * 60 * 1000);
let minutes = Math.floor(hoursms / (60 * 1000));
let minutesms = ms % (60 * 1000);
let seconds = Math.floor(minutesms / 1000);

let result = "";

if (days > 0) {
result += days + " day"
if (days > 1) {
result += "s";
}
result += ", ";
}

if (hours > 0) {
result += hours + " hour"
if (hours > 1) {
result += "s";
}
result += ", ";
}

if (minutes > 0) {
result += minutes + " minute";
if (minutes > 1) {
result += "s";
}
result += ", ";
}

if (seconds > 0) {
result += seconds + " second";
if (seconds > 1) {
result += "";
}
}

if (result === "") {
result = "0 second";
} else {
result = result.slice(0, -2);
}

return result;
}

func.example = (command, query) => {
return `_Example :_ ${command} ${query}`
}

func.generatePrompt = function(text) {
return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

func.jsonFormat = (obj) => {
try {
let print = (obj && (obj.constructor.name == 'Object' || obj.constructor.name == 'Array')) ? util.format(JSON.stringify(obj, null, 2)) : util.format(obj)
return print
} catch {
return util.format(obj)
}
}

func.formatNumber = (integer) => {
let numb = parseInt(integer)
return Number(numb).toLocaleString().replace(/,/g, '.')
}

func.getRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`
}

func.filename = (ext) => {
return `${Math.floor(Math.random() * 10000)}.${ext}`
}

func.arrayJoin = (arr) => {
var construct = []
for (var i = 0; i < arr.length; i++) construct = construct.concat(arr[i])
return construct
}

func.createThumb = async (source) => {
let { file } = await func.getFile(source)
let jimp = await read(await func.fetchBuffer(file))
let buff = await jimp
.quality(100)
.resize(200, AUTO, RESIZE_BILINEAR)
.getBufferAsync(MIME_JPEG)
return buff
}

func.isUrl = (url) => {
return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}

func.regex = {
igstory: (url) => {
const regex = /https:\/\/(.+)?instagram\.com\/stories\/.+/
const matchedUrl = url.match(regex)[0];
const cleanUrl = matchedUrl.split('?')[0].replace(/\/$/, '');
const [_, username, storyID] = cleanUrl.split('/');
return { username, storyID };
},
media: (url) => [/^https?:\/\/t\.me\/addstickers\/[a-zA-Z0-9_]+$/i, /https?:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\//i, /https?:\/\/(www\.|m\.|)imdb\.com\/video\/vi\d+/i, /https?:\/\/store\.line\.me\/stickershop\/product\/\d+/i, /https?:\/\/([^\s:/?#]+\.?)+(\/[^\s]*)?/i, /https?:\/\/sfile\.mobi\/[A-Za-z0-9]+/i, /https?:\/\/www\.capcut\.com\/(watch|template-detail)\/\d+\?/i, /https?:\/\/(|www\.)cocofun\.com\/share\/post\//i, /https?:\/\/(|www\.)likee\.video\/@/i, /https?:\/\/(www\.|m\.|)mediafire\.com\/file\/[a-zA-Z0-9]{15}(|\/[a-zA-Z0-9-_/%.]+)/i, /https?:\/\/drive\.+google\.+com\/file\/[a-zA-Z0-9-_./]+/i, /https?:\/\/(?:www\.|)xnxx\.com\/[a-zA-Z0-9-/_]+/i, /https?:\/\/(?:www\.|)xvideos\.com\/[a-z0-9/._-]+/i, /https?:\/\/store\.+line\.+me\/stickershop\/product\/[0-9]{1,8}/i, /https?:\/\/(?:m\.|www\.|)imdb\.com\/[a-zA-Z0-9-_\/?=&]+/i, /https?:\/\/ifunny\.co\/video\/[a-zA-Z0-9-_]+/i, /https?:\/\/(www\.|m\.|)soundcloud\.com\/[a-zA-Z0-9-_./]+/i, /https?:\/\/(www\.|)instagram\.com\/tv\/[A-z0-9-_]{1,11}/i, /https?:\/\/(?:(web\.|www\.|m\.|mobile\.|)youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i, /https?:\/\/www\.icocofun\.com\/[a-zA-Z0-9-_\/=?&]+/i, /https?:\/\/(www\.|mobile\.|id\.|)twitter\.com\/([a-zA-Z0-9_]{1,40}|i)\/(status|video)\/[0-9]*/i, /https?:\/\/(www\.|m\.|)instagram\.com\/(p|reel|([a-zA-Z0-9-_.]+\/(p|reel)))\/[a-zA-Z0-9]{1,11}/i, /https?:\/\/(www|pin|id)\.(it|pinterest\.co(m|\.[a-z]{1,2}))\S+/i, /https?:\/\/(web\.|www\.|m\.|)?(facebook|fb)\.(com|watch|gg)\S+/i, /https?:\/\/.+\.tiktok\.com\/.+/i].some(regex => regex.test(url)),
url: (url) => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i.test(url)
}

func.pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}

func.findAdmin = (arr) => {
return arr.filter((v) => v.admin !== null).map((i) => i.id)
}

func.toFirstCase = function(str) {
let first = str.split(" ").map(nama => nama.charAt(0).toUpperCase() + nama.slice(1)).join(" ");
return first
}

func.enumGetKey = function(a) {
return a.jid
}

func.rupiah = function(x) {
x = x.toString()
var pattern = /(-?\d+)(\d{3})/;
while (pattern.test(x))
x = x.replace(pattern, '$1.$2');
return x;
}

func.toDate = (ms) => {
let days = Math.floor(ms / (24 * 60 * 60 * 1000));
let daysms = ms % (24 * 60 * 60 * 1000);
let hours = Math.floor((daysms) / (60 * 60 * 1000));
let hoursms = ms % (60 * 60 * 1000);
let minutes = Math.floor((hoursms) / (60 * 1000));
let minutesms = ms % (60 * 1000);
let sec = Math.floor((minutesms) / (1000));
if (days == 0 && hours == 0 && minutes == 0) {
return "Baru-baru ini"
} else {
return days + "D " + hours + "H " + minutes + "M";
}
}

func.ucword = (str) => {
return (str + '').replace(/^([a-z])|\s+([a-z])/g, function(text) {
return text.toUpperCase();
})
}

func.texted = (type, text) => {
if (type === 'bold') {
return '*' + text + '*'
} else if (type === 'italic') {
return '_' + text + '_'
} else if (type === 'monospace') {
return '```' + text + '```'
} else {
return text
}
}

func.clockString = function(ms){
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

func.msToTime = function(ms){
var milliseconds = parseInt((ms % 1000) / 100),
seconds = Math.floor((ms / 1000) % 60),
minutes = Math.floor((ms / (1000 * 60)) % 60),
hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
let h = (hours < 10) ? '0' + hours : hours
let m = (minutes < 10) ? '0' + minutes : minutes
let s = (seconds < 10) ? '0' + seconds : seconds
return h + ':' + m + ':' + s
}

func.runtime = function(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600 * 24));
var h = Math.floor(seconds % (3600 * 24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);
var dDisplay = d > 0 ? d + (d == 1 ? ' hari, ' : ' hari, ') : '';
var hDisplay = h > 0 ? h + (h == 1 ? ' jam, ' : ' jam, ') : '';
var mDisplay = m > 0 ? m + (m == 1 ? ' menit, ' : ' menit, ') : '';
var sDisplay = s > 0 ? s + (s == 1 ? ' detik' : ' detik') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
}

func.bytesToSize = (bytes, decimals = 2) => {
if (bytes === 0) return '0 Bytes';
const k = 1024;
const dm = decimals < 0 ? 0 : decimals;
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

func.removeEmojis = (string) => {
var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
return string.replace(regex, '');
}

func.makeid = (length) => {
let result = '';
let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}

func.getDevice = id => id.length > 21 ? 'Android' : id.substring(0, 2) === '3A' ? 'IOS' : 'WhatsApp Web'

func.getEmoji = (str) => {
const regex = /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g
return str.match(regex)
}

func.removeEmojis = (string) => {
var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
return string.replace(regex, '')
}

func.isEmoji = (emo) => {
let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
let regexEmoji = new RegExp(emoji_ranges, 'gi');
return emo.match(regexEmoji)
}

func.hitungmundur = (tanggal, bulan, tahun) => {
let from = new Date(`${bulan} ${tanggal}, ${tahun} 00:00:00`).getTime();
let now = Date.now();
let distance = from - now;
let days = Math.floor(distance / (1000 * 60 * 60 * 24));
let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((distance % (1000 * 60)) / 1000);
return days + ' hari ' + hours + ' jam ' + minutes + ' menit ' + seconds + ' detik'
}

func.h2k = (number) => {
var SI_POSTFIXES = ["", " Ribu", " Juta", " Miliar", " Triliun", " P", " E"]
//var SI_POSTFIXES = ["", " K", " M", " G", " T", " P", " E"]
var tier = Math.log10(Math.abs(number)) / 3 | 0
if(tier == 0) return number
var postfix = SI_POSTFIXES[tier]
var scale = Math.pow(10, tier * 3)
var scaled = number / scale
var formatted = scaled.toFixed(1) + ''
if (/\.0$/.test(formatted))
formatted = formatted.substr(0, formatted.length - 2)
return formatted + postfix
}

func.fileSize = (number) => {
var SI_POSTFIXES = ["B", " KB", " MB", " GB", " TB", " PB", " EB"]
var tier = Math.log10(Math.abs(number)) / 3 | 0
if(tier == 0) return number
var postfix = SI_POSTFIXES[tier]
var scale = Math.pow(10, tier * 3)
var scaled = number / scale
var formatted = scaled.toFixed(1) + ''
if (/\.0$/.test(formatted))
formatted = formatted.substr(0, formatted.length - 2)
return formatted + postfix
}

func.matcher = (string, array, options) => {
function levenshtein(value, other, insensitive) {
var cache = []
var codes = []
var length
var lengthOther
var code
var result
var distance
var distanceOther
var index
var indexOther

if (value === other) {
return 0
}

length = value.length
lengthOther = other.length

if (length === 0) {
return lengthOther
}

if (lengthOther === 0) {
return length
}

if (insensitive) {
value = value.toLowerCase()
other = other.toLowerCase()
}

index = 0

while (index < length) {
codes[index] = value.charCodeAt(index)
cache[index] = ++index
}

indexOther = 0

while (indexOther < lengthOther) {
code = other.charCodeAt(indexOther)
result = distance = indexOther++
index = -1

while (++index < length) {
distanceOther = code === codes[index] ? distance : distance + 1
distance = cache[index]
cache[index] = result =
distance > result ?
distanceOther > result ?
result + 1 :
distanceOther :
distanceOther > distance ?
distance + 1 :
distanceOther
}
}
return result
}

function similarity(a, b, options) {
var left = a || ''
var right = b || ''
var insensitive = !(options || {}).sensitive
var longest = Math.max(left.length, right.length)
return ((longest === 0 ? 1 : (longest - levenshtein(left, right, insensitive)) / longest) * 100).toFixed(1)
}

let data = []
let isArray = array.constructor.name == 'Array' ? array : [array] || []
isArray.map(v => data.push({
string: v,
accuracy: similarity(string, v)
}))
return data
}

func.uuid = () => {
var dt = new Date().getTime()
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
var r = (dt + Math.random() * 16) % 16 | 0;
var y = Math.floor(dt / 16);
return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});
return uuid
}

func.formatSize = (size) => {
function round(value, precision) {
var multiplier = Math.pow(10, precision || 0)
return Math.round(value * multiplier) / multiplier
}
var megaByte = 1024 * 1024
var gigaByte = 1024 * megaByte
var teraByte = 1024 * gigaByte
if (size < 1024) {
return size + ' B'
} else if (size < megaByte) {
return round(size / 1024, 1) + ' KB'
} else if (size < gigaByte) {
return round(size / megaByte, 1) + ' MB'
} else if (size < teraByte) {
return round(size / gigaByte, 1) + ' GB'
} else {
return round(size / teraByte, 1) + ' TB'
}
return ''
}

func.getSize = async (str) => {
if (!isNaN(str)) return func.formatSize(str)
let header = await (await axios.get(str)).headers
return func.formatSize(header['content-length'])
}

func.getFile = (source, filename, options) => {
return new Promise(async (resolve) => {
try {
if (Buffer.isBuffer(source)) {
let ext, mime
try {
mime = await (await fromBuffer(source)).mime
ext = await (await fromBuffer(source)).ext
} catch {
mime = mimetypes.lookup(filename ? filename.split`.` [filename.split`.`.length - 1] : 'txt')
ext = mimetypes.extension(mime)
}
let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : ext
let size = Buffer.byteLength(source)
let filepath = 'sampah/' + (func.uuid() + '.' + ext)
let file = fs.writeFileSync(filepath, source)
let name = filename || path.basename(filepath)
let data = {
status: true,
file: filepath,
filename: name,
mime: mime,
extension: ext,
size: await func.getSize(size),
bytes: size
}
return resolve(data)
} else if (source.startsWith('./') || source.startsWith('/')) {
let ext, mime
try {
mime = await (await fromBuffer(source)).mime
ext = await (await fromBuffer(source)).ext
} catch {
mime = mimetypes.lookup(filename ? filename.split`.` [filename.split`.`.length - 1] : 'txt')
ext = mimetypes.extension(mime)
}
let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : ext
let size = fs.statSync(source).size
let name = filename || path.basename(source)
let data = {
status: true,
file: source,
filename: name,
mime: mime,
extension: ext,
size: await func.getSize(size),
bytes: size
}
return resolve(data)
} else {
axios.get(source, {
responseType: 'stream',
...options
}).then(async (response) => {
let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : mime.extension(response.headers['content-type'])
let file = fs.createWriteStream(`./sampah/${func.uuid() + '.' + extension}`)
let name = filename || path.basename(file.path)
response.data.pipe(file)
file.on('finish', async () => {
let data = {
status: true,
file: file.path,
filename: name,
mime: mime.lookup(file.path),
extension: extension,
size: await func.getSize(response.headers['content-length'] ? response.headers['content-length'] : 0),
bytes: response.headers['content-length'] ? response.headers['content-length'] : 0
}
resolve(data)
file.close()
})
})
}
} catch (e) {
console.log(e)
resolve({
status: false
})
}
})
}

func.sizeLimit = (str, max) => {
let data
if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
oversize: true
}
if (str.match('M') || str.match('MB')) {
let first = str.replace(/MB|M|G|T/g, '').trim()
if (isNaN(first)) return data = {
oversize: true
}
if (first > max) return data = {
oversize: true
}
return data = {
oversize: false
}
} else {
return data = {
oversize: false
}
}
}

func.randomNomor = (min, max = null) => {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

func.reSize = async(image, width = 200, height = 200) => {
let img = await read(image);
let hasil = await img.resize(width, height).getBufferAsync(MIME_JPEG);
return hasil
}

func.sort = (property, ascending = true) => {
if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

func.toNumber = (property, _default = 0) => {
if (property) return (a, i, b) => {
return {...b[i], [property]: a[property] === undefined ? _default : a[property]}
}
else return a => a === undefined ? _default : a
}

func.fetchText = (url, options) => new Promise(async(resolve, reject) => {
fetch(url, options).then(response => response.text())
.then(text => {
resolve(text)
}).catch((err) => {
reject(err)
})
})

func.fetchJson = async(url, options = {}) => {
try {
const res = await axios({
method: 'GET',
url: url,
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
},
...options
})
return res.data
} catch (err) {
return err
}
}

func.getBuffer = async(url, options = {}) => {
try {
let res = await axios({
url, 
method: 'GET', 
headers: {
'DNT': 1, 
'Upgrade-Insecure-Request': 1
}, 
...options, 
responseType: 'arraybuffer'
});
return res.data;
} catch (err) {
return err
}
}

func.fetchBuffer = (file, options = {}) => {
return new Promise(async (resolve, reject) => {
try {
if (func.isUrl(file)) {
let buff = await (await axios.get(file, {
responseType: "arraybuffer",
headers: options
})).data
resolve(buff)
} else {
let buff = fs.readFileSync(file)
resolve(buff)
}
} catch {
return ({
status: false
})
}
})
}

/*
</> Screaper By SuryaDev </>
*/

func.alquran = async function (surah, ayat) {
let res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`)
if (!res.ok) throw 'Error, maybe not found?'
let $ = cheerio.load(await res.text())
let content = $('body > main > div > div.content.clearfix > div.news > section > div.list-content.clearfix')
let Surah = $(content).find('div.ayat-title > h1').text()
let arab = $(content).find('div.ayat-detail > div.ayat-arab').text()
let latin = $(content).find('div.ayat-detail > div.ayat-latin').text()
let terjemahan = $(content).find('div.ayat-detail > div.ayat-detail-text').text()
let tafsir = ''
$(content).find('div.ayat-detail > div.tafsir-box > div').each(function () {
tafsir += $(this).text() + '\n'
})
tafsir = tafsir.trim()
let keterangan = $(content).find('div.ayat-detail > div.ayat-summary').text()
// https://quran.kemenag.go.id/assets/js/quran.js
let audio = `https://quran.kemenag.go.id/cmsq/source/s01/${surah < 10 ? '00' : surah >= 10 && surah < 100 ? '0' : ''}${surah}${ayat < 10 ? '00' : ayat >= 10 && ayat < 100 ? '0' : ''}${ayat}.mp3`
return {
creator: 'SuryaDev.',
surah: Surah,
arab,
latin,
terjemahan,
tafsir,
audio,
keterangan,
}
}

func.MLSound = async function(language, query) {
let bahasa = ['id', 'en', 'ja'];
if (!bahasa.includes(language)) language = bahasa[0];
try {
let res
if (language == 'id') {
res = await axios.get('https://mobile-legends.fandom.com/wiki/' + query + '/Audio/id')
}
if (language == 'en') {
res = await axios.get('https://mobile-legends.fandom.com/wiki/' + query + '/Audio')
}
if (language == 'ja') {
res = await axios.get('https://mobile-legends.fandom.com/wiki/' + query + '/Audio/ja')
}
const html = res.data;
const $ = cheerio.load(html);
const result = [];

$('audio').each((i, el) => {
const url = $(el).attr('src');
const text = $(el).parent().parent().text().split('.ogg')[1].trim(); 
result.push({ url, text });
});

return {
status: true, 
creator: 'SuryaDev',
result: result
};
} catch (error) {
return {
status: false,
creator: 'SuryaDev',
message: 'Failed to fetch data'
};
}
}

func.ytDownloadMp3 = async function(url){
return new Promise((resolve, reject) => {
try {
const id = ytdl.getVideoID(url)
const yutub = ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`).then((data) => {
let pormat = data.formats
let audio = []
let video = []
for (let i = 0; i < pormat.length; i++) {
if (pormat[i].mimeType == 'audio/webm; codecs=\"opus\"') {
let aud = pormat[i]
audio.push(aud.url)
}
}
const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
const result = {
creator: 'SuryaDev.',
title: title,
thumb: thumb,
channel: channel,
published: published,
views: views,
url: audio[0]
}
resolve(result)
})
return(yutub)
} catch (error) {
reject(error)
console.log(error)
}
})
}

func.ytDownloadMp4 = async function(url){
return new Promise((resolve, reject) => {
try {
const id = ytdl.getVideoID(url)
const yutub = ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`).then((data) => {
let pormat = data.formats
let video = []
for (let i = 0; i < pormat.length; i++) {
if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
let vid = pormat[i]
video.push(vid.url)
}
}
const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
const result = {
creator: 'SuryaDev.',
title: title,
thumb: thumb,
channel: channel,
published: published,
views: views,
url: video[0]
}
resolve(result)
})
return(yutub)
} catch (error) {
reject(error)
console.log(error)
}
})
}

func.UploadFileUgu = async (input) => {
return new Promise(async (resolve, reject) => {
const form = new FormData
form.append("files[]", fs.createReadStream(input));
await axios({
url: "https://uguu.se/upload.php",
method: "POST",
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
...form.getHeaders(),
},
data: form,
})
.then((data) => {
resolve(data.data.files[0]);
})
.catch((err) => reject(err));
});
}

func.telegraPh = async (path) => {
return new Promise(async (resolve, reject) => {
if (!fs.existsSync(path)) return reject(new Error("File not Found"))
try {
let form = new FormData
form.append('file', fs.createReadStream(path))
const json = await (await axios.post('https://telegra.ph/upload', form, {
headers: {
"Accept": "*/*",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
"Origin": "https://telegra.ph",
"Referer": "https://telegra.ph",
"Referrer-Policy": "strict-origin-when-cross-origin",
"sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
"sec-ch-ua-platform": "Android",
"sec-fetch-dest": "empty",
"sec-fetch-mode": "cors",
"sec-fetch-site": "same-origin",
"x-requested-with": "XMLHttpRequest",
...form.getHeaders()
}
})).data
if (!json || json.length < 1) return resolve({
creator: 'SuryaDev.',
status: false,
msg: 'Failed to upload!'
})
resolve({
creator: 'SuryaDev.',
status: true,
url: 'https://telegra.ph' + json[0].src
})
} catch (e) {
console.log(e)
resolve({
creator: 'SuryaDev.',
status: false,
msg: e.message
})
}
})
}

func.uploadImage = (path) => {
return new Promise(async (resolve, reject) => {
if (!fs.existsSync(path)) return reject(new Error("File not Found"))
try {
const server = await (await axios.get('https://neoxr.my.id/srv')).data
let form = new FormData
form.append('someFiles', fs.createReadStream(path))
let json = await (await fetch(server.api_path, {
method: 'POST',
body: form
})).json()
const result = {
creator: 'SuryaDev.',
status: true,
url: json.data.url
}
resolve(result)
} catch (e) {
console.log(e)
return resolve({
creator: 'SuryaDev.',
status: false,
msg: e.message
})
}
})
}

func.uploadImageV2 = async (input) => {
return new Promise(async resolve => {
try {
const image = Buffer.isBuffer(input) ? input : input.startsWith('http') ? await (await axios.get(input, {
responseType: 'arraybuffer'
})).data : input
let form = new FormData
form.append('source', Buffer.from(image), 'image.jpg')
form.append('type', 'file')
form.append('action', 'upload')
form.append('timestamp', (new Date() * 1))
form.append('auth_token', '3b0ead89f86c3bd199478b2e14afd7123d97507f')
form.append('nsfw', 0)
const json = await (await axios.post('https://freeimage.host/json', form, {
headers: {
"Accept": "*/*",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
"Origin": "https://freeimage.host",
"Referer": "https://freeimage.host/",
"Referrer-Policy": "strict-origin-when-cross-origin",
"sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
"sec-ch-ua-platform": "Android",
"sec-fetch-dest": "empty",
"sec-fetch-mode": "cors",
"sec-fetch-site": "same-origin",
"x-requested-with": "XMLHttpRequest",
...form.getHeaders()
}
})).data
if (json.status_code != 200) return resolve({
creator: 'SuryaDev.',
status: false,
msg: 'Failed to Upload!'
})
resolve({
creator: 'SuryaDev.',
status: true,
original: json,
data: {
url: json.image.url
}
})
} catch (e) {
console.log(e)
resolve({
creator: 'SuryaDev.',
status: false,
msg: e.message
})
}
})
}

func.fileio = async (path) => {
return new Promise (async (resolve, reject) => {
if (!fs.existsSync(path)) return reject(new Error("File not Found"))
try {
const form = new FormData
form.append("file", fs.createReadStream(path))
let res = await fetch('https://file.io/?expires=30d', { // 1 Day Expiry Date
method: 'POST',
body: form
})
let json = await res.json()
resolve({
creator: 'SuryaDev.',
status: json.status,
name: json.name,
mimetype: json.mimetype,
size: json.size,
url: json.link
})
} catch (e) {
console.log(e)
return resolve({ creator: 'SuryaDev.', status: false })
}
})
}

func.tiktok = async (url) => {
const bodyForm = new FormData()
bodyForm.append("q", url)
bodyForm.append("lang", "id")
try {
const { data } = await axios('https://savetik.co/api/ajaxSearch', {
method: 'POST', 
data: bodyForm,
headers: {
"content-type": "application/x-www-form-urlencoded", "User-Agent": "PostmanRuntime/7.32.2"
} 
})
const $ = cheerio.load(data.data)
let result = {
status: 200,
creator: 'SuryaDev.',
result: {
caption: $("div.video-data > div > .tik-left > div > .content > div > h3").text(),
thumbnail: $(".image-tik.open-popup img").attr("src"),
low: $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href"),
medium: $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href"),
hd: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href"),
audio: $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href")
}
}
return result;
} catch (e) {
let result = {
status: 400,
creator: 'SuryaDev.'
}
return result;
}
}

func.instagramv1 = async (url) => {
return new Promise(async (resolve, reject) => {
const payload = new URLSearchParams(Object.entries({ url: url, host: "instagram" }))
await axios.request({
method: "POST",
baseURL: "https://saveinsta.io/core/ajax.php",
data: payload,
headers: {
"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
"cookie": "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
"user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
}
})
.then(( response ) => {
const $ = cheerio.load(response.data)
const mediaURL = $("div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom").map((_, el) => {
return "https://saveinsta.io/" + $(el).find("div.col-md-8.mx-auto > a").attr("href")
}).get()
const res = {
status: true,
media: mediaURL
}
resolve(res)
})
.catch((e) => {
console.log(e)
reject({ status: false, message: String(e) })
})
})
}

func.facebookv1 = function(url){
return new Promise(async(resolve, reject) => {
try {
const config = {
'id': url,
'locale': 'id'
}
const { data, status } = await axios('https://getmyfb.com/process', {
method: 'POST',
data: new URLSearchParams(Object.entries(config)),
headers: {
"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
"cookie": "PHPSESSID=914a5et39uur28e84t9env0378; popCookie=1; prefetchAd_4301805=true"
}
})
if (status === 200) {
const $ = cheerio.load(data)
const thumb = $('div.container > div.results-item > div.results-item-image-wrapper').find('img').attr('src')
const caption = $('div.container > div.results-item > div.results-item-text').text().trim()
const video_hd = $('div.container > div.results-download > ul > li:nth-child(1) > a').attr('href')
const video_sd = $('div.container > div.results-download > ul > li:nth-child(2) > a').attr('href')
const hasil = {
status: true,
caption: caption,
thumb: thumb,
video_sd: video_sd,
video_hd: video_hd
};
resolve(hasil)
} else {
console.log('No result found')
reject({ status: false, msg: 'No result found' })
}
} catch (error) {
console.error(error)
reject({ status: false, msg: error })
}
})
}

func.facebookv2 = function(url){
return new Promise(async(resolve,reject) => {
axios("https://getmyfb.com/process", {
headers: { "cookie": "PHPSESSID=mtkljtmk74aiej5h6d846gjbo4; __cflb=04dToeZfC9vebXjRcJCMjjSQh5PprejufZXs2vHCt5; _token=K5Qobnj4QvoYKeLCW6uk" },
data: { id: url, locale: 'en' },
"method": "POST"
}).then(res => { 
let $ = cheerio.load(res.data)
let result = {
caption: $("div.results-item-text").eq(0).text().trim(),
thumb: $(".results-item-image-wrapper img").attr("src"),
video: $("a").attr("href")
}
resolve(result) 
})
})
}

func.pinterestv2 = function(query, count = 10) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get("https://ar.pinterest.com/search/pins/?autologin=true&q=" + query, {
        headers: {
          'sec-ch-ua': "\"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\", \";Not A Brand\";v=\"99\"",
          'cookie': "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0",
          'User-Agent': "Mozilla/5.0 (Linux; Android 13; ASUS_I008D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
        }
      });
      const $ = cheerio.load(data);
      const result = [];
      const hasil = [];
      $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src');
        result.push(link);
      });
      result.forEach(v => {
        if (v == undefined) return;
        hasil.push(v.replace(/236/g, '736'));
      });
      hasil.shift();
      resolve(hasil.slice(0, count));
    } catch (error) {
      reject(error);
    }
  });
};

func.mediafire = function(url){
return new Promise(async(resolve, reject) => {
try {
const { data, status } = await axios.get(url)
const $ = cheerio.load(data);
let filename = $('.dl-info > div > div.filename').text();
let filetype = $('.dl-info > div > div.filetype').text();
let filesize = $('a#downloadButton').text().split("(")[1].split(")")[0];
let uploadAt = $('ul.details > li:nth-child(2)').text().split(": ")[1];
let link = $('#downloadButton').attr('href');
let desc = $('div.description > p.description-subheading').text();
if (typeof link === undefined) return resolve({ status: false, msg: 'No result found' })
let result = {
status: true,
filename: filename,
filetype: filetype,
filesize: filesize,
uploadAt: uploadAt,
link: link,
desc: desc
}
console.log(result)
resolve(result)
} catch (err) {
console.error(err)
resolve({ status: false, msg: 'No result found' })
}
})
}

module.exports = func;