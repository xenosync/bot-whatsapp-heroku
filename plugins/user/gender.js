exports.run = {
usage: ['gender'],
use: 'male / female',
category: 'user',
async: async (m, { func, mecha }) => {
if (global.db.users[m.sender].gender !== '') return m.reply('Kamu sudah memiliki gender!')
if ((m.args[0] || '').toLowerCase() === 'male') {
global.db.users[m.sender].gender = 'Laki-laki'
m.reply('Kamu telah memilih kelamin *Laki-laki* dan tidak akan bisa diubah lagi.')
} else if ((m.args[0] || '').toLowerCase() === 'female') {
global.db.users[m.sender].gender = 'Perempuan'
m.reply('Kamu telah memilih kelamin *Perempuan* dan tidak akan bisa diubah lagi.')
} else m.reply('Input format male or female')
}
}