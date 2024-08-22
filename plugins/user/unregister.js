exports.run = {
usage: ['unregister'],
hidden: ['unreg'],
category: 'user',
async: async (m, { func, mecha, users }) => {
if (!users.register) return m.reply('*❌ Akun kamu belum terverifikasi!*')
let times = users.lastunreg + 86400000
if (Date.now() - users.lastunreg < 86400000) return m.reply(`Kamu sudah unregister, mohon tunggu *${func.msToTime(times - Date.now())}* untuk bisa *unregister* kembali.`)
users.lastunreg = Date.now()
users.register = false;
users.name = '';
users.age = 0;
users.gender = '';
m.reply('✅ Unregister successfully.')
},
private: true
}