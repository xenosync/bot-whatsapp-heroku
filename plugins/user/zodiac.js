exports.run = {
usage: ['zodiac'],
hidden: ['zodiak'],
use: 'year month date',
category: 'user',
async: async (m, { func, mecha, users, comand }) => {
if (!m.text) return m.reply(func.example(comand, '2005 5 21'))
let zodiak = [
["Capricorn", new Date(1970, 0, 1)],
["Aquarius", new Date(1970, 0, 20)],
["Pisces", new Date(1970, 1, 19)],
["Aries", new Date(1970, 2, 21)],
["Taurus", new Date(1970, 3, 21)],
["Gemini", new Date(1970, 4, 21)],
["Cancer", new Date(1970, 5, 22)],
["Leo", new Date(1970, 6, 23)],
["Virgo", new Date(1970, 7, 23)],
["Libra", new Date(1970, 8, 23)],
["Scorpio", new Date(1970, 9, 23)],
["Sagittarius",  new Date(1970, 10, 22)],
["Capricorn", new Date(1970, 11, 22)]
].reverse()

function getZodiac(month, day) {
let d = new Date(1970, month - 1, day)
return zodiak.find(([_,_d]) => d >= _d)[0]
}
let date =  new Date(m.text)
if (date == 'Invalid Date') return m.reply(date.toString())
let d = new Date
let [tahun, bulan, tanggal] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
let birth = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
let zodiac = getZodiac(birth[1], birth[2])
let ageD = new Date(d - date)
let age = ageD.getFullYear() - new Date(1970, 0, 1).getFullYear()
let birthday = [tahun + (birth[1] < bulan), ...birth.slice(1)]
let cekusia = bulan === birth[1] && tanggal === birth[2] ? `Happy ${age}th Birthday 🥳🎉` : age
m.reply(`乂  *Z O D I A C*

◦  *Nama :* ${users.name ? users.name : '@' + m.sender.split('@')[0]}
◦  *Tanggal lahir :* ${birth.join('-')}
◦  *Ultah mendatang :* ${birthday.join('-')}
◦  *Umur :* ${cekusia}
◦  *Zodiak :* ${zodiac}`)
},
limit: true
}