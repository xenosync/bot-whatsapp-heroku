exports.run = {
usage: ['stopbot'],
category: 'jadibot',
desc: 'Berhenti menjadi bot sementara',
async: async (m, { func, mecha, users }) => {
if (!users.jadibot) return m.reply(global.mess.jadibot)
if (Object.keys(global.jadibot).length == 0) return m.reply('Tidak ada bot sementara yang aktif saat ini')
const client = global.jadibot[m.sender] ? global.jadibot[m.sender] : Object.values(global.jadibot).find(v => v.user.id.split(':')[0] == m.sender.split('@')[0])
if (typeof client == 'undefined') return m.reply('Kamu tidak terdaftar dalam sesi jadibot!')
await client.end('stopbot');
delete global.jadibot[client.id];
},
private: true
}