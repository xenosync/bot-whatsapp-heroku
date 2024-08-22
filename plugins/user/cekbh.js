exports.run = {
usage: ['cekbh'],
category: 'user',
async: async (m, { func, mecha, froms }) => {
if (!froms) return m.reply('Mention or Reply chat target.')
const sizes = ['30A', '32B', '32C', '32D', '34A', '34B', '34C', '36A', '36B', '36C', '38A', '38B', '38C', '40A', '40B', '40C', '42A', '42B', '42C', '42D'];
const colors = ['Merah', 'Biru', 'Hijau', 'Kuning', 'Hitam', 'Putih', 'Oranye', 'Ungu', 'Coklat', 'Abu-abu', 'Merah Muda', 'Biru Muda', 'Hijau Muda', 'Krem', 'Biru Tua', 'Hijau Tua', 'Biru Langit', 'Toska', 'Salmon', 'Emas', 'Perak', 'Magenta', 'Cyan', 'Olive', 'Navy'];
const shapes = ['Boxer', 'Brief', 'Trunk', 'Thong', 'Jockstrap', 'Bikini', 'Hipster', 'Tanga', 'G-string', 'T-brief', 'Mini Boxer', 'Shorty', 'Midi', 'Maxi', 'Slip', 'High-leg', 'Cheeky', 'Brazilian', 'Cutaway', 'Sport Brief'];
const randomSize = await getRandomItem(sizes);
const randomColor = await getRandomItem(colors);
const randomShape = await getRandomItem(shapes);
mecha.reply(m.chat, `Bra @${froms.split('@')[0]} adalah:\nUkuran: ${randomSize}\nWarna: ${randomColor}\nBentuk: ${randomShape}`, m, {
expiration: m.expiration
});
},
limit: true
}

function getRandomItem(array) {
const randomIndex = Math.floor(Math.random() * array.length);
return array[randomIndex];
}