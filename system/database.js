/*
* Nama Pengembang: SuryaDev
* Kontak Whatsapp: wa.me/62895415497664
* Kontak Telegram: t.me/surya_skylark
* Akun Instagram: surya_skylark05
* Catatan: tolong laporkan kepada saya jika anda menemukan ada yang menjual script ini tanpa seizin saya.
*/

const toMs = require('ms');
const func = require('./functions.js');

module.exports = (mecha, update) => {
try {
const msg = update.messages[update.messages.length - 1];
if (!msg.message) return;
if (msg.key && msg.key.remoteJid === 'status@broadcast') return
const isNumber = x => typeof x === 'number' && !isNaN(x)
const from = msg.key.remoteJid;
const bot = mecha.user.id ? mecha.user.id.split(':')[0] + '@s.whatsapp.net' : mecha.user.jid;
const sender = msg.key.fromMe ? bot : (msg.key.participant || msg.key.remoteJid);
const pushname = msg.pushName || '-'
const tekswelcome = 'Hello, +user Thank you for joining the group'
const teksleft =  'Goodbye +user'
const calender = new Date().toLocaleDateString('id', {
day: 'numeric',
month: 'long',
year: 'numeric'
})

// DATABASE USER
if (sender.endsWith('@s.whatsapp.net')) {
let users = global.db.users[sender]
if (typeof users !== 'object') global.db.users[sender] = {}
if (users) {
if (!('jid' in users)) users.jid = sender
if (!('register' in users)) users.register = false
if (!('name' in users)) users.name = pushname
if (!('gender' in users)) users.gender = ''
if (!isNumber(users.age)) users.age = 0
if (!('date' in users)) users.date = calender
if (!isNumber(users.limit)) users.limit = 100
if (!isNumber(users.balance)) users.balance = 1000
if (!isNumber(users.afk)) users.afk = 0
if (!('alasan' in users)) users.alasan = ''
if (!('afkObj' in users)) users.afkObj = {}
if (!('premium' in users)) users.premium = false
if (!('jadibot' in users)) users.jadibot = false
if (!('banned' in users)) users.banned = false
if (!isNumber(users.warning)) users.warning = 0
if (!('pasangan' in users)) users.pasangan = {
id: '',
time: 0
}
if (!('expired' in users)) users.expired = {
user: Date.now() + toMs('7d'), 
premium: 0,
jadibot: 0,
banned: 0
}
if (!('jadibot' in users.expired)) users.expired.jadibot = 0
if (!('game' in users)) users.game = {
tictactoe: 0,
suit: 0,
petakbom: 0,
tebaklagu: 0,
tebakheroml: 0,
tebaklogo: 0,
tebakgambar: 0,
tebakkalimat: 0,
tebakkata: 0,
tebaklirik: 0,
tebakkimia: 0,
tebakbendera: 0,
tebakanime: 0,
kuis: 0,
siapakahaku: 0,
asahotak: 0,
susunkata: 0,
caklontong: 0,
family100: 0,
math: 0,
casino: 0
}
if (!isNumber(users.lastunreg)) users.lastunreg = 0
if (!isNumber(users.exp)) users.exp = 0
if (!isNumber(users.level)) users.level = 0
if (!('role' in users)) users.role = 'Bronze'
if (users.register) {
if (!isNumber(users.money)) users.money = 0
if (!isNumber(users.atm)) users.atm = 0
if (!isNumber(users.health)) users.health = 100
if (!isNumber(users.potion)) users.potion = 0
if (!isNumber(users.trash)) users.trash = 0
if (!isNumber(users.wood)) users.wood = 0
if (!isNumber(users.rock)) users.rock = 0
if (!isNumber(users.string)) users.string = 0
if (!isNumber(users.iron)) users.iron = 0
if (!isNumber(users.sand)) users.sand = 0
if (!isNumber(users.botol)) users.botol = 0
if (!isNumber(users.kaleng)) users.kaleng = 0
if (!isNumber(users.kardus)) users.kardus = 0
if (!isNumber(users.aqua)) users.aqua = 0

if (!isNumber(users.emerald)) users.emerald = 0
if (!isNumber(users.diamond)) users.diamond = 0
if (!isNumber(users.gold)) users.gold = 0
if (!isNumber(users.steel)) users.steel = 0
if (!isNumber(users.kargo)) users.kargo = 0
if (!isNumber(users.kapal)) users.kapal = 0

if (!isNumber(users.common)) users.common = 0
if (!isNumber(users.commoncount)) users.commoncount = 0
if (!isNumber(users.uncommon)) users.uncommon = 0
if (!isNumber(users.uncommoncount)) users.uncommoncount = 0
if (!isNumber(users.mythic)) users.mythic = 0
if (!isNumber(users.mythiccount)) users.mythiccount = 0
if (!isNumber(users.legendary)) users.legendary = 0
if (!isNumber(users.legendarycount)) users.legendarycount = 0
if (!isNumber(users.pet)) users.pet = 0
if (!isNumber(users.petcount)) users.petcount = 0
if (!isNumber(users.petfood)) users.petfood = 0

if (!isNumber(users.horse)) users.horse = 0
if (!isNumber(users.horseexp)) users.horseexp = 0
if (!isNumber(users.cat)) users.cat = 0
if (!isNumber(users.catexp)) users.catexp = 0
if (!isNumber(users.fox)) users.fox = 0
if (!isNumber(users.foxexp)) users.foxexp = 0
if (!isNumber(users.dog)) users.dog = 0
if (!isNumber(users.dogexp)) users.dogexp = 0
if (!isNumber(users.wolf)) users.wolf = 0
if (!isNumber(users.wolfexp)) users.wolfexp = 0
if (!isNumber(users.centaur)) users.centaur = 0
if (!isNumber(users.centaurexp)) users.centaurexp = 0
if (!isNumber(users.phoenix)) users.phoenix = 0
if (!isNumber(users.phoenixexp)) users.phoenixexp = 0
if (!isNumber(users.dragon)) users.dragon = 0
if (!isNumber(users.dragonexp)) users.dragonexp = 0
if (!isNumber(users.horselvl)) users.horselvl = 0
if (!isNumber(users.catlvl)) users.catlvl = 0
if (!isNumber(users.foxlvl)) users.foxlvl = 0
if (!isNumber(users.doglvl)) users.doglvl = 0
if (!isNumber(users.wolflvl)) users.wolflvl = 0
if (!isNumber(users.centaurlvl)) users.centaurlvl = 0
if (!isNumber(users.phoenixlvl)) users.phoenixlvl = 0
if (!isNumber(users.dragonlvl)) users.dragonlvl = 0
if (!isNumber(users.horsehealth)) users.horsehealth = 0
if (!isNumber(users.cathealth)) users.cathealth = 0
if (!isNumber(users.foxhealth)) users.foxhealth = 0
if (!isNumber(users.doghealth)) users.doghealth = 0
if (!isNumber(users.wolfhealth)) users.wolfhealth = 0
if (!isNumber(users.centaurhealth)) users.centaurhealth = 0
if (!isNumber(users.phoenixhealth)) users.phoenixhealth = 0
if (!isNumber(users.dragonhealth)) users.dragonhealth = 0

if (!isNumber(users.horselastfeed)) users.horselastfeed = 0
if (!isNumber(users.catlastfeed)) users.catlastfeed = 0
if (!isNumber(users.foxlastfeed)) users.foxlastfeed = 0
if (!isNumber(users.doglastfeed)) users.doglastfeed = 0
if (!isNumber(users.wolflastfeed)) users.wolflastfeed = 0
if (!isNumber(users.centaurlastfeed)) users.centaurlastfeed = 0
if (!isNumber(users.phoenixlastfeed)) users.phoenixlastfeed = 0
if (!isNumber(users.dragonlastfeed)) users.dragonlastfeed = 0
if (!isNumber(users.lastadu)) users.lastadu = 0

if (!isNumber(users.armor)) users.armor = 0
if (!isNumber(users.armordurability)) users.armordurability = 0
if (!isNumber(users.sword)) users.sword = 0
if (!isNumber(users.sworddurability)) users.sworddurability = 0
if (!isNumber(users.pickaxe)) users.pickaxe = 0
if (!isNumber(users.pickaxedurability)) users.pickaxedurability = 0
if (!isNumber(users.fishingrod)) users.fishingrod = 0
if (!isNumber(users.fishingroddurability)) users.fishingroddurability = 0
if (!isNumber(users.bow)) users.bow = 0
if (!isNumber(users.bowdurability)) users.bowdurability = 0

if (!isNumber(users.lastclaim)) users.lastclaim = 0
if (!isNumber(users.lastadventure)) users.lastadventure = 0
if (!isNumber(users.lastfishing)) users.lastfishing = 0
if (!isNumber(users.lastmining)) users.lastmining = 0
if (!isNumber(users.lasthunt)) users.lasthunt = 0
if (!isNumber(users.lastweekly)) users.lastweekly = 0
if (!isNumber(users.lastmonthly)) users.lastmonthly = 0
if (!isNumber(users.lastbansos)) users.lastbansos = 0
if (!isNumber(users.lastdagang)) users.lastdagang = 0
if (!isNumber(users.lastberkebon)) users.lastberkebon = 0
if (!isNumber(users.lastmasak)) users.lastmasak = 0
if (!isNumber(users.lastrampok)) users.lastrampok = 0
if (!isNumber(users.lastbunuh)) users.lastbunuh = 0
if (!isNumber(users.lastnebang)) users.lastnebang = 0
if (!isNumber(users.lastmulung)) users.lastmulung = 0
if (!isNumber(users.masakcount)) users.masakcount = 0
if (!isNumber(users.craftcount)) users.craftcount = 0
if (!isNumber(users.adventurecount)) users.adventurecount = 0
if (!isNumber(users.mancingcount)) users.mancingcount = 0

if (!isNumber(users.bibitmangga)) users.bibitmangga = 0
if (!isNumber(users.bibitapel)) users.bibitapel = 0
if (!isNumber(users.bibitpisang)) users.bibitpisang = 0
if (!isNumber(users.bibitjeruk)) users.bibitjeruk = 0
if (!isNumber(users.bibitanggur)) users.bibitanggur = 0
if (!isNumber(users.mangga)) users.mangga = 0
if (!isNumber(users.apel)) users.apel = 0
if (!isNumber(users.pisang)) users.pisang = 0
if (!isNumber(users.jeruk)) users.jeruk = 0
if (!isNumber(users.anggur)) users.anggur = 0

if (!isNumber(users.banteng)) users.banteng = 0
if (!isNumber(users.harimau)) users.harimau = 0
if (!isNumber(users.gajah)) users.gajah = 0
if (!isNumber(users.kambing)) users.kambing = 0
if (!isNumber(users.panda)) users.panda = 0
if (!isNumber(users.buaya)) users.buaya = 0
if (!isNumber(users.kerbau)) users.kerbau = 0
if (!isNumber(users.sapi)) users.sapi = 0
if (!isNumber(users.monyet)) users.monyet = 0
if (!isNumber(users.babihutan)) users.babihutan = 0
if (!isNumber(users.babi)) users.babi = 0
if (!isNumber(users.ayam)) users.ayam = 0

if (!isNumber(users.orca)) users.orca = 0
if (!isNumber(users.paus)) users.paus = 0
if (!isNumber(users.lumba)) users.lumba = 0
if (!isNumber(users.hiu)) users.hiu = 0
if (!isNumber(users.ikan)) users.ikan = 0
if (!isNumber(users.lele)) users.lele = 0
if (!isNumber(users.bawal)) users.bawal = 0
if (!isNumber(users.nila)) users.nila = 0
if (!isNumber(users.kepiting)) users.kepiting = 0
if (!isNumber(users.lobster)) users.lobster = 0
if (!isNumber(users.gurita)) users.gurita = 0
if (!isNumber(users.cumi)) users.cumi = 0
if (!isNumber(users.udang)) users.udang = 0

if (!isNumber(users.masak)) users.masak = 0
if (!isNumber(users.masakrole)) users.masakrole = 0
if (!isNumber(users.masakexp)) users.masakexp = 0
if (!isNumber(users.masaklevel)) users.masaklevel = 0

if (!isNumber(users.bawang)) users.bawang = 0
if (!isNumber(users.cabai)) users.cabai = 0
if (!isNumber(users.kemiri)) users.kemiri = 0
if (!isNumber(users.jahe)) users.jahe = 0
if (!isNumber(users.saus)) users.saus = 0
if (!isNumber(users.asam)) users.asam = 0

if (!isNumber(users.steak)) users.steak = 0
if (!isNumber(users.sate)) users.sate = 0
if (!isNumber(users.rendang)) users.rendang = 0
if (!isNumber(users.kornet)) users.kornet = 0
if (!isNumber(users.nugget)) users.nugget = 0
if (!isNumber(users.bluefin)) users.bluefin = 0
if (!isNumber(users.seafood)) users.seafood = 0
if (!isNumber(users.sushi)) users.sushi = 0
if (!isNumber(users.moluska)) users.moluska = 0
if (!isNumber(users.squidprawm)) users.squidprawm = 0

if (!isNumber(users.rumahsakit)) users.rumahsakit = 0
if (!isNumber(users.restoran)) users.restoran = 0
if (!isNumber(users.pabrik)) users.pabrik = 0
if (!isNumber(users.tambang)) users.tambang = 0
if (!isNumber(users.pelabuhan)) users.pelabuhan = 0
if (!('rumahsakitname' in users)) users.rumahsakitname = ''
if (!('restoranname' in users)) users.restoranname = ''
if (!('pabrikname' in users)) users.pabrikname = ''
if (!('tambangname' in users)) users.tambangname = ''
if (!('pelabuhanname' in users)) users.pelabuhanname = ''
if (!isNumber(users.rumahsakitexp)) users.rumahsakitexp = 0
if (!isNumber(users.restoranexp)) users.restoranexp = 0
if (!isNumber(users.pabrikexp)) users.pabrikexp = 0
if (!isNumber(users.tambangexp)) users.tambangexp = 0
if (!isNumber(users.pelabuhanexp)) users.pelabuhanexp = 0
if (!isNumber(users.rumahsakitlvl)) users.rumahsakitlvl = 0
if (!isNumber(users.restoranlvl)) users.restoranlvl = 0
if (!isNumber(users.pabriklvl)) users.pabriklvl = 0
if (!isNumber(users.tambanglvl)) users.tambanglvl = 0
if (!isNumber(users.pelabuhanlvl)) users.pelabuhanlvl = 0
}
} else {
global.db.users[sender] = {
jid: sender,
register: false,
name: pushname,
gender: '',
age: 0,
date: calender,
limit: 15,
balance: 10000,
afk: 0,
alasan: '',
afkObj: {},
premium: false,
jadibot: false,
banned: false,
warning: 0,
pasangan: {
id: '',
time: 0
},
expired: {
user: Date.now() + toMs('7d'),
premium: 0,
jadibot: 0,
banned: 0
},
game: {
tictactoe: 0,
suit: 0,
petakbom: 0,
tebaklagu: 0,
tebakheroml: 0,
tebaklogo: 0,
tebakgambar: 0,
tebakkalimat: 0,
tebakkata: 0,
tebaklirik: 0,
tebakkimia: 0,
tebakbendera: 0,
tebakanime: 0,
kuis: 0,
siapakahaku: 0,
asahotak: 0,
susunkata: 0,
caklontong: 0,
family100: 0,
math: 0,
casino: 0
},
lastunreg: 0,
exp: 0,
level: 0,
role: 'Bronze',
}
}
}

// DATABASE GROUP
if (from.endsWith('@g.us')) {
let groups = global.db.groups[from]
if (typeof groups !== 'object') global.db.groups[from] = {}
if (groups) {
if (!('jid' in groups)) groups.jid = from
if (!('name' in groups)) groups.name = '-'
if (!('tekswelcome' in groups)) groups.tekswelcome = tekswelcome
if (!('teksleft' in groups)) groups.teksleft = teksleft
if (!('welcome' in groups)) groups.welcome = false
if (!('left' in groups)) groups.left = false
if (!('detect' in groups)) groups.detect = false
if (!('mute' in groups)) groups.mute = false
if (!('antitoxic' in groups)) groups.antitoxic = false
if (!('antilink' in groups)) groups.antilink = false
if (!('antivirtex' in groups)) groups.antivirtex = false
if (!('antibot' in groups)) groups.antibot = false
if (!('antiviewonce' in groups)) groups.antiviewonce = false
if (!('antihidetag' in groups)) groups.antihidetag = false
if (!('antidelete' in groups)) groups.antidelete = false
if (!('antiedited' in groups)) groups.antiedited = false
if (!isNumber(groups.expired)) groups.expired = Date.now() + toMs('7d')
if (!('sewa' in groups)) groups.sewa = {
status: false, 
expired: 0
}
if (!('absen' in groups)) groups.absen = {};
if (!('list' in groups)) groups.list = [];
if (!('blacklist' in groups)) groups.blacklist = [];
if (!('member' in groups)) groups.member = [];
} else {
global.db.groups[from] = {
jid: from,
name: '-', 
tekswelcome: tekswelcome,
teksleft: teksleft,
welcome: false,
left: false,
detect: false,
mute: false, 
antitoxic: false, 
antilink: false, 
antivirtex: false,
antibot: false,
antiviewonce: false,
antihidetag: false,
antidelete: false,
antiedited: false,
expired: Date.now() + toMs('7d'),
sewa: {
status: false,
expired: 0
},
absen: {},
list: [],
blacklist: [],
member: []
}
}
}

// DATABASE SETTING
let settings = global.db.setting[bot]
if (typeof settings !== 'object') global.db.setting[bot] = {}
if (settings) {
if (!('typefile' in settings)) settings.typefile = 'document'
if (!('prefix' in settings)) settings.prefix = '.'
if (!('multiprefix' in settings)) settings.multiprefix = false
if (!('online' in settings)) settings.online = false
if (!('verify' in settings)) settings.verify = false
if (!('self' in settings)) settings.self = false
if (!('maintenance' in settings)) settings.maintenance = false
if (!('pconly' in settings)) settings.pconly = false
if (!('gconly' in settings)) settings.gconly = false
if (!('autosticker' in settings)) settings.autosticker = false
if (!('autoread' in settings)) settings.autoread = false
if (!('autoblockcmd' in settings)) settings.autoblockcmd = false
if (!('autoclearsession' in settings)) settings.autoclearsession = false
if (!('anticall' in settings)) settings.anticall = false
if (!('antispam' in settings)) settings.antispam = false
if (!('fakereply' in settings)) settings.fakereply = false
if (!('autolevelup' in settings)) settings.autolevelup = false
if (!('owner' in settings)) settings.owner = []
if (!('packname' in settings)) settings.packname = '‎ '
if (!('author' in settings)) settings.author = ''
if (!('cover' in settings)) settings.cover = 'https://telegra.ph/file/66ea637e36d49f218e4d1.jpg'
if (!('link' in settings)) settings.link = 'https://whatsapp.com/channel/0029VakPMNr6hENhTdQEvN2c'
if (!isNumber(settings.style)) settings.style = 1
if (!isNumber(settings.timer)) settings.timer = 1800000
if (!isNumber(settings.gamewaktu)) settings.gamewaktu = 60
if (!('hadiah' in settings)) settings.hadiah = {
min: 1000,
max: 3000
}
if (!('limit' in settings)) settings.limit = {
premium: 99999,
free: 15,
price: 1000
}
if (!isNumber(settings.max_upload)) settings.max_upload = {
premium: 100,
free: 10
}
if (!isNumber(settings.lastreset)) settings.lastreset = Date.now()
if (!isNumber(settings.max_toxic)) settings.max_toxic = 15
if (!('toxic' in settings)) settings.toxic ['ajg', 'anjink', 'anjg', 'anjk', 'anjim', 'anjing', 'anjrot', 'anying', 'asw', 'autis', 'babi', 'bacod', 'bacot', 'bagong', 'bajingan', 'bangsad', 'bangsat', 'bastard', 'bego', 'bgsd', 'biadab', 'biadap', 'bitch', 'bngst', 'bodoh', 'bokep', 'cocote', 'coli', 'colmek', 'comli', 'dajjal', 'dancok', 'dongo', 'fuck', 'goblog', 'goblok', 'guoblog', 'guoblok', 'henceut', 'idiot', 'jancok', 'jembut', 'jingan', 'kafir', 'kanjut', 'keparat', 'kntl', 'kontol', 'lonte', 'meki', 'memek', 'ngentod', 'ngentot', 'ngewe', 'ngocok', 'ngtd', 'njeng', 'njing', 'njinx', 'pantek', 'pantek', 'peler', 'pepek', 'pler', 'pucek', 'puki', 'pukimak', 'setan', 'silit', 'telaso', 'tempek', 'tete', 'titit', 'toket', 'tolol', 'tomlol','asu','Asu','Asw','4su','Asww','kntol','mmk','mmek','memk','uke','femme','butchy','bkp','ddk','bbg','daddykink','mommykink','kink']
if (!('blockcmd' in settings)) settings.blockcmd = [];
} else {
global.db.setting[bot] = {
typefile: 'document',
prefix: '.',
multiprefix: false,
online: false,
verify: false,
self: false,
maintenance: false,
gconly: false,
autosticker: false,
autoread: false,
autoblockcmd: false,
autoclearsession: false,
anticall: false,
antispam: false,
fakereply: false,
autolevelup: false,
owner: [],
packname: '‎ ',
author: '',
cover: 'https://telegra.ph/file/66ea637e36d49f218e4d1.jpg',
link: 'https://whatsapp.com/channel/0029VakPMNr6hENhTdQEvN2c',
style: 1,
timer: 1800000,
gamewaktu: 60,
hadiah: {
min: 1000,
max: 3000
},
limit: {
premium: 99999,
free: 15,
price: 1000
},
max_upload: {
premium: 100,
free: 10
},
lastreset: Date.now(),
max_toxic: 15,
toxic: ['ajg', 'anjink', 'anjg', 'anjk', 'anjim', 'anjing', 'anjrot', 'anying', 'asw', 'autis', 'babi', 'bacod', 'bacot', 'bagong', 'bajingan', 'bangsad', 'bangsat', 'bastard', 'bego', 'bgsd', 'biadab', 'biadap', 'bitch', 'bngst', 'bodoh', 'bokep', 'cocote', 'coli', 'colmek', 'comli', 'dajjal', 'dancok', 'dongo', 'fuck', 'goblog', 'goblok', 'guoblog', 'guoblok', 'henceut', 'idiot', 'jancok', 'jembut', 'jingan', 'kafir', 'kanjut', 'keparat', 'kntl', 'kontol', 'lonte', 'meki', 'memek', 'ngentod', 'ngentot', 'ngewe', 'ngocok', 'ngtd', 'njeng', 'njing', 'njinx', 'pantek', 'pantek', 'peler', 'pepek', 'pler', 'pucek', 'puki', 'pukimak', 'setan', 'silit', 'telaso', 'tempek', 'tete', 'titit', 'toket', 'tolol', 'tomlol','asu','Asu','Asw','4su','Asww','kntol','mmk','mmek','memk','uke','femme','butchy','bkp','ddk','bbg','daddykink','mommykink','kink'],
blockcmd: []
}
}

} catch (e) {
console.error(e);
}
}

func.reloadFile(__filename)