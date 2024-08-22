exports.run = {
usage: ['ceksempak'],
use: 'mention or reply',
category: 'user',
async: async (m, { func, mecha, froms }) => {
if (!froms) return m.reply('Mention or reply chat target.')
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL', '11XL', '12XL', '13XL', '14XL', '15XL', '16XL'];
const colors = ['Merah', 'Biru', 'Hijau', 'Kuning', 'Hitam', 'Putih', 'Oranye', 'Ungu', 'Coklat', 'Abu-abu', 'Merah Muda', 'Biru Muda', 'Hijau Muda', 'Krem', 'Biru Tua', 'Hijau Tua', 'Biru Langit', 'Toska', 'Salmon', 'Emas', 'Perak', 'Magenta', 'Cyan', 'Olive', 'Navy'];
const shapes = ['Boxer', 'Brief', 'Trunk', 'Thong', 'Jockstrap', 'Bikini', 'Hipster', 'Boyshort', 'Tanga', 'G-string', 'T-brief', 'Mini Boxer', 'Shorty', 'Midi', 'Maxi', 'Slip', 'High-leg', 'Cheeky', 'Brazilian', 'Cutaway', 'Sport Brief'];
const randomSize = await getRandomItem(sizes);
const randomColor = await getRandomItem(colors);
const randomShape = await getRandomItem(shapes);
await m.reply(`Sempak @${froms.split('@')[0]} adalah:\nUkuran: ${randomSize}\nWarna: ${randomColor}\nBentuk: ${randomShape}`)
},
limit: true
}

function getRandomItem(array) {
const randomIndex = Math.floor(Math.random() * array.length);
return array[randomIndex];
}