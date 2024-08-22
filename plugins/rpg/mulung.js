const cooldown = 900000

exports.run = {
usage: ['mulung'],
category: 'rpg',
async: async (m, { func, mecha, setting }) => {
let user = global.db.users[m.sender];
let timers = (cooldown - (new Date - user.lastmulung))
if (new Date - user.lastmulung <= cooldown) return m.reply(`Kamu sudah mulung dan kelelahan, mohon tunggu *${func.clockString(timers)}*`)
let botol = ranNumb(10, 100)
let kaleng = ranNumb(10, 100)
let kardus = ranNumb(10, 100)
user.botol += botol
user.kaleng += kaleng
user.kardus += kardus
let txt = `Selamat kamu mendapatkan :\n+${botol} Botol\n+${kardus} Kardus\n+${kaleng} Kaleng`
m.reply('_Sedang memulung..._')
user.lastmulung = new Date * 1
setTimeout(() => {
mecha.reply(m.chat, txt, m)
}, setting.gamewaktu * 1000)
},
register: true,
limit: true
}

function ranNumb(min, max = null) {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}