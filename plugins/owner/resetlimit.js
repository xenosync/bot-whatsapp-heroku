exports.run = {
usage: ['resetlimit'],
category: 'owner',
async: async (m, { mecha, setting }) => {
setting.lastreset = Date.now();
Object.values(global.db.users).filter((v) => v.limit < setting.limit.free && !v.premium).map((x) => x.limit = setting.limit.free);
Object.values(global.db.users).filter(v => v.premium).map(v => v.limit = setting.limit.premium);
m.reply(`Sukses reset limit ${Object.keys(global.db.users).length} users!`);
},
devs: true
}