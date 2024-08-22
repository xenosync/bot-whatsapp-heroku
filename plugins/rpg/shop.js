const items = {
buy: {
potion: {
money: 1250,
},
wood: {
money: 2000,
},
aqua: {
money: 1000
},
rock: {
money: 2000,
},
string: {
money: 2500,
},
iron: {
money: 3000,
},
sand: {
money: 1500,
},
emerald: {
money: 200000,
},
diamond: {
money: 300000,
},
gold: {
money: 100000,
},
petfood: {
money: 2500,
},
bawang: {
money: 150,
},
cabai: {
money: 250,
},
kemiri: {
money: 100,
},
jahe: {
money: 100,
},
saus: {
money: 70,
},
asam: {
money: 50,
},
bibitapel: {
money: 150,
},
bibitanggur: {
money: 200,
},
bibitmangga: {
money: 250,
},
bibitpisang: {
money: 50,
},
bibitjeruk: {
money: 300,
},
common: {
money: 10000,
},
uncommon: {
money: 15000,
},
mythic: {
money: 25000,
},
legendary: {
money: 40000,
},
banteng: {
money: 11000,
},
harimau: {
money: 18000,
},
gajah: {
money: 16000,
},
kambing: {
money: 12000,
},
panda: {
money: 20000,
},
buaya: {
money: 5000,
},
kerbau: {
money: 9000,
},
sapi: {
money: 10000,
},
monyet: {
money: 5000,
},
babihutan: {
money: 4000,
},
babi: {
money: 8000,
},
ayam: {
money: 3000,
},
orca: {
money: 20000,
},
paus: {
money: 45000,
},
lumba: {
money: 5000,
},
hiu: {
money: 4500,
},
ikan: {
money: 2500,
},
lele: {
money: 3000,
},
bawal: {
money: 3500,
},
nila: {
money: 3000,
},
kepiting: {
money: 7000,
},
lobster: {
money: 15000,
},
gurita: {
money: 3000,
},
cumi: {
money: 5000,
},
udang: {
money: 7500,
},
horse: {
money: 500000,
},
cat: {
money: 500000,
},
fox: {
money: 500000,
},
dog: {
money: 500000,
},
wolf: {
money: 1000000,
},
centaur: {
gold: 15,
},
phoenix: {
emerald: 10,
},
dragon: {
diamond: 10,
},
rumahsakit: {
money: 2000000,
},
restoran: {
money: 2500000,
},
pabrik: {
money: 1000000,
},
tambang: {
money: 2000000,
},
pelabuhan: {
money: 2500000,
}
},
sell: {
potion: {
money: 125,
},
petfood: {
money: 125,
},
trash: {
money: 20,
},
botol: {
money: 50,
},
kaleng: {
money: 150,
},
kardus: {
money: 100,
},
banteng: {
money: 9900,
},
harimau: {
money: 16200,
},
gajah: {
money: 14400,
},
kambing: {
money: 10800,
},
panda: {
money: 18000,
},
buaya: {
money: 4500,
},
kerbau: {
money: 8100,
},
sapi: {
money: 9000,
},
monyet: {
money: 4500,
},
babihutan: {
money: 3600,
},
babi: {
money: 7200,
},
ayam: {
money: 2700,
},
orca: {
money: 18000,
},
paus: {
money: 40500,
},
lumba: {
money: 4500,
},
hiu: {
money: 4050,
},
ikan: {
money: 2250,
},
lele: {
money: 2700,
},
bawal: {
money: 3150,
},
nila: {
money: 2700,
},
kepiting: {
money: 6300,
},
lobster: {
money: 13500,
},
gurita: {
money: 2700,
},
cumi: {
money: 4500,
},
udang: {
money: 6750,
},
mangga: {
money: 400,
},
anggur: {
money: 300,
},
jeruk: {
money: 450,
},
pisang: {
money: 200,
},
apel: {
money: 300,
},
steak: {
money: 35000,
},
sate: {
money: 45000,
},
rendang: {
money: 31000,
},
kornet: {
money: 27000,
},
nugget: {
money: 32000,
},
bluefin: {
money: 65000,
},
seafood: {
money: 65000,
},
sushi: {
money: 54500,
},
moluska: {
money: 65000,
},
squidprawm: {
money: 60500,
},
horse: {
money: 450000,
},
cat: {
money: 450000,
},
fox: {
money: 450000,
},
dog: {
money: 450000,
},
wolf: {
money: 900000,
},
centaur: {
money: 1350000,
},
phoenix: {
money: 1800000,
},
dragon: {
money: 2700000,
},
rumahsakit: {
money: 1800000,
},
restoran: {
money: 2250000,
},
pabrik: {
money: 900000,
},
tambang: {
money: 1800000,
},
pelabuhan: {
money: 2250000,
}
}
}

exports.run = {
usage: ['buy', 'sell'],
hidden: ['beli', 'shop', 'jual'],
use: '[item] [count]',
category: 'rpg',
async: async (m, { func, mecha, isPrem }) => {
let user = global.db.users[m.sender]
const listItems = Object.fromEntries(Object.entries(items[`${func.somematch(['buy', 'shop', 'beli'], m.command) ? 'buy' : 'sell'}`]).filter(([v]) => v && v in user))
let info = `Format : *${m.cmd} [item] [jumlah]*
Contoh : *${m.cmd} potion 10*

*D A I L Y - I T E M S*
%| potion%
%| aqua%
%| petfood%

*C R A F T - I T E M S*
%| wood | rock%
%| string | iron%
%| sand | emerald%
%| diamond | gold%

*COOKING - INGREDIENTS*${func.readmore}
%| bawang | cabai%
%| kemiri | jahe%
%| saus | asam%

*GARDENING - MATERIALS*
%| bibitmangga%
%| bibitapel%
%| bibitpisang%
%| bibitjeruk%
%| bibitanggur%

*G A C H A - B O X*
%| common%
%| uncommon%
%| mythic%
%| legendary%

*L A N D - A N I M A L S*
%| banteng | harimau%
%| gajah | kambing%
%| panda | buaya%
%| kerbau | sapi%
%| monyet | babihutan%
%| babi | ayam%

*S E A - A N I M A L S*
%| orca | paus%
%| lumba | hiu%
%| ikan | lele%
%| bawal | nila%
%| kepiting | lobster%
%| gurita | cumi%
%| udang%

*P E T - S H O P*
%| horse | cat%
%| fox | dog%
%| wolf | centaur%
%| phoenix | dragon%

*B U I L D I N G S*
%| rumahsakit%
%| estoran%
%| pabrik%
%| tambang%
%| pelabuhan%`

let infos = `Format : *${m.cmd} [item] [jumlah]*
Contoh : *${m.cmd} potion 10*

*D A I L Y - I T E M S*
%| potion%
%| petfood%
%| trash%

*S E L L - A N I M A L S*
%| banteng | harimau%
%| gajah | kambing%
%| panda | buaya%
%| kerbau | sapi%
%| monyet | babihutan%
%| babi | ayam%

*S E A - A N I M A L S*${func.readmore}
%| orca | paus%
%| lumba | hiu%
%| ikan | lele%
%| bawal | nila%
%| kepiting | lobster%
%| gurita | cumi%
%| udang%

*S E L L - F R U I T S*
%| mangga%
%| anggur%
%| jeruk%
%| pisang%
%| apel%

*P E T - S E L L*
%| horse | cat%
%| fox | dog%
%| wolf | centaur%
%| phoenix | dragon%

*B U I L D I N G S*
%| rumahsakit%
%| estoran%
%| pabrik%
%| tambang%
%| pelabuhan%`

const item = (m.args[0] || '').toLowerCase()
const total = Math.floor(func.isNumber(m.args[1]) ? Math.min(Math.max(parseInt(m.args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
if (func.somematch(['sell', 'jual'], m.command) && m.text.toLowerCase() === 'hewan darat') {
let itemArray = ['banteng', 'harimau', 'gajah', 'kambing', 'panda', 'buaya', 'kerbau', 'sapi', 'monyet', 'babihutan', 'babi', 'ayam']
let totalItem = 0;
let totalHarga = 0;
for (let x of itemArray) totalItem += parseInt(user[x]);
if (totalItem == 0) return m.reply(`Kamu tidak memiliki *${m.text.toLowerCase()}* untuk dijual.`)
for (let i of itemArray) {
let count = parseInt(user[i])
user[i] -= count;
user.money += listItems[i].money * count;
totalHarga += listItems[i].money * count;
}
return m.reply(`Menjual *${totalItem} ${m.text.toLowerCase()}* dengan harga *${totalHarga} money*`)
} else if (func.somematch(['sell', 'jual'], m.command) && m.text.toLowerCase() === 'hewan laut') {
let itemArray = ['orca', 'paus', 'lumba', 'hiu', 'ikan', 'lele', 'bawal', 'nila', 'kepiting', 'lobster', 'gurita', 'cumi', 'udang']
let totalItem = 0;
let totalHarga = 0;
for (let x of itemArray) totalItem += parseInt(user[x]);
if (totalItem == 0) return m.reply(`Kamu tidak memiliki *${m.text.toLowerCase()}* untuk dijual.`)
for (let i of itemArray) {
let count = parseInt(user[i])
user[i] -= count;
user.money += listItems[i].money * count;
totalHarga += listItems[i].money * count;
}
return m.reply(`Menjual *${totalItem} ${m.text.toLowerCase()}* dengan harga *${totalHarga} money*`)
} else if (func.somematch(['sell', 'jual'], m.command) && m.text.toLowerCase() === 'buah') {
let itemArray = ['mangga', 'anggur', 'jeruk', 'pisang', 'apel']
let totalItem = 0;
let totalHarga = 0;
for (let x of itemArray) totalItem += parseInt(user[x]);
if (totalItem == 0) return m.reply(`Kamu tidak memiliki *${m.text.toLowerCase()}* untuk dijual.`)
for (let i of itemArray) {
let count = parseInt(user[i])
user[i] -= count;
user.money += listItems[i].money * count;
totalHarga += listItems[i].money * count;
}
return m.reply(`Menjual *${totalItem} ${m.text.toLowerCase()}* dengan harga *${totalHarga} money*`)
}
if (!listItems[item] && func.somematch(['buy', 'shop', 'beli'], m.command)) return m.reply(info.replaceAll('%', '```'))
if (!listItems[item] && func.somematch(['sell', 'jual'], m.command)) return m.reply(infos.replaceAll('%', '```'))
let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
if (func.somematch(['buy', 'shop', 'beli'], m.command)) {
if (func.somematch(['horse', 'cat', 'fox', 'dog', 'wolf', 'centaur', 'phoenix', 'dragon', 'rumahsakit', 'restoran', 'pabrik', 'tambang', 'pelabuhan'], m.args[0].toLowerCase())) {
if (user[item] == 0) {
if (total > 1) return m.reply(`Kamu belum memiliki *${item}*, hanya dapat beli 1`)
if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`Kamu tidak memiliki cukup ${paymentMethod} untuk membeli *${total} ${item}*.\nDibutuhkan *${(listItems[item][paymentMethod] * total) - user[paymentMethod]} ${paymentMethod}* untuk dapat membeli.`)
user[paymentMethod] -= listItems[item][paymentMethod] * total
user[item] += total
user[`${item}lvl`] += 1
return m.reply(`Membeli *${total} ${item}* seharga *${listItems[item][paymentMethod] * total} ${paymentMethod}*`)
} else {
let itemlvl = user[`${item}lvl`];
if (user[`${item}`] + total > 2 * itemlvl) return m.reply(`Perlu upgrade ${item} ke level ${2 * itemlvl} terlebih dahulu.`)
let harga = listItems[item][paymentMethod] * total * user[`${item}`] * itemlvl
if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`Kamu tidak memiliki cukup ${paymentMethod} untuk membeli *${total} ${item} level ${itemlvl}*.\nDibutuhkan *${(listItems[item][paymentMethod] * total) - user[paymentMethod]} ${paymentMethod}* untuk dapat membeli.`)
user[paymentMethod] -= harga
user[item] += total
return m.reply(`Membeli *${total} ${item}* seharga *${harga} ${paymentMethod}*`)
}
} else {
if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`Kamu tidak memiliki cukup ${paymentMethod} untuk membeli *${total}* ${item}.\nDibutuhkan *${(listItems[item][paymentMethod] * total) - user[paymentMethod]} ${paymentMethod}* untuk dapat membeli.`)
user[paymentMethod] -= listItems[item][paymentMethod] * total
user[item] += total
return m.reply(`Membeli *${total} ${item}* seharga *${listItems[item][paymentMethod] * total} ${paymentMethod}*`)
}
} else {
if (func.somematch(['horse', 'cat', 'fox', 'dog', 'wolf', 'centaur', 'phoenix', 'dragon', 'rumahsakit', 'restoran', 'pabrik', 'tambang', 'pelabuhan'], m.args[0].toLowerCase())) {
let itemlvl = user[`${item}lvl`];
let harga = listItems[item][paymentMethod] * total * itemlvl
if (user[item] == 0) return m.reply(`Kamu tidak memiliki *${item}* untuk dijual.`)
if (user[item] < total) return m.reply(`Kamu hanya memiliki *${user[item]} ${item}* untuk dijual.`)
user[item] -= total
user.money += harga
let meh = user[`${item}lvl`]
if (user[item] == 0) user[`${item}lvl`] = 0
return m.reply(`Menjual *${total} ${item} Level ${meh}* dengan harga *${harga} ${paymentMethod}*`)
} else {
if (user[item] == 0) return m.reply(`Kamu tidak memiliki *${item}* untuk dijual.`)
if (user[item] < total) return m.reply(`Kamu hanya memiliki *${user[item]} ${item}* untuk dijual.`)
user[item] -= total
user.money += listItems[item].money * total
return m.reply(`Menjual *${total} ${item}* dengan harga *${listItems[item].money * total} ${paymentMethod}*`)
}
}
},
register: true
}