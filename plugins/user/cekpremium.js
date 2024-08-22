exports.run = {
usage: ['cekpremium'],
hidden: ['cekprem'],
category: 'user',
async: async (m, { func, mecha, users }) => {
if (!users.premium) return m.reply(`Kamu bukan pengguna premium. kirim ${m.prefix}buyprem untuk melihat list harga premium.`)
let txt = '乂  *C E K - P R E M I U M*\n\n'
txt += `◦  *ID* : @${m.sender.split('@')[0]}\n`
txt += `◦  *Name* : ${users.name}\n`
txt += `◦  *Expire* : ${users.expired.premium != 'PERMANENT' ? func.expireTime(users.expired.premium) : 'PERMANENT'}`
m.reply(txt)
}
}