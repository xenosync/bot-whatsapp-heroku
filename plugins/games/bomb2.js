exports.run = {
usage: ['bomb2'],
hidden: ['tebakbom2'],
use: 'enter number',
category: 'games',
async: async (m, { func, mecha }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
mecha.bomb2 = mecha.bomb2 ? mecha.bomb2 : {};
let id = m.sender,
timeout = 180000;
if (id in mecha.bomb2) return mecha.reply(m.chat, '*^ sesi ini belum selesai!*', mecha.bomb2[id].msg);
const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const array = bom.map((v, i) => ({
emot: v,
number: number[i],
position: i + 1,
state: false
}));
let txt = `乂  *B O M B*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
for (let i = 0; i < array.length; i += 3) txt += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += `\nTimeout : *${((timeout / 1000) / 60)} menit*\nApabila mendapat kotak yang berisi bom maka point akan di kurangi.`;
let msg = await mecha.reply(m.chat, txt, m);

let v;
mecha.bomb2[id] = {
msg: msg,
array: array,
time: setTimeout(() => {
v = array.find(v => v.emot == '💥');
if (mecha.bomb2[id]) mecha.reply(m.chat, `*Waktu habis!*, Bom berada di kotak nomor ${v.number}.`, mecha.bomb2[id].msg);
delete mecha.bomb2[id];
}, timeout)
};

},
main: async (m, { func, mecha, setting }) => {
try {
let id = m.sender;
let timeout = 180000;
let hadiah = func.hadiah(setting.hadiah);
let users = global.db.users[m.sender];
mecha.bomb2 = mecha.bomb2 ? mecha.bomb2 : {};

let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.budy);
if (mecha.bomb2[id] && isSurrender) {
await mecha.reply(m.chat, 'Menyerah', m);
clearTimeout(mecha.bomb2[id].time);
delete mecha.bomb2[id];
}

if ((id in mecha.bomb2) && !isNaN(m.budy)) {
let json = mecha.bomb2[id].array.find(v => v.position == m.budy);
if (!json) return mecha.reply(m.chat, `Untuk membuka kotak Kirim angka 1 - 9`, m);

if (json.emot == '💥') {
json.state = true;
let bomb = mecha.bomb2[id].array;
let txt = `乂  *B O M B*\n\n`;
txt += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
txt += `Timeout : *${((timeout / 1000) / 60)} menit*\n`;
txt += `*Permainan selesai!*, kotak berisi bom terbuka: (- *$${func.formatNumber(hadiah)}* balance)`;

mecha.reply(m.chat, txt.trim(), m).then(() => {
users.balance < hadiah ? users.balance = 0 : users.balance -= hadiah;
clearTimeout(mecha.bomb2[id].time);
delete mecha.bomb2[id];
});
} else if (json.state) {
return mecha.reply(m.chat, `Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, m);
} else {
json.state = true;
let changes = mecha.bomb2[id].array;
let open = changes.filter(v => v.state && v.emot != '💥').length;

if (open >= 8) {
let txt = `乂  *B O M B*\n\n`;
txt += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
txt += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
txt += `Timeout : *${((timeout / 1000) / 60)} menit*\n`;
txt += `*Permainan selesai!* kotak berisi bom tidak terbuka: (+ *$${func.formatNumber(hadiah)}* balance)`;
mecha.reply(m.chat, txt.trim(), m).then(() => {
users.balance += hadiah;
clearTimeout(mecha.bomb2[id].time);
delete mecha.bomb2[id];
});
} else {
let txt = `乂  *B O M B*\n\n`;
txt += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
txt += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
txt += `Timeout : *${((timeout / 1000) / 60)} menit*\n`;
txt += `Kotak berisi bom tidak terbuka : (+ *$${func.formatNumber(hadiah)}* balance)`;
mecha.reply(m.chat, txt.trim(), m).then(() => {
users.balance += hadiah;
});
}
}
}
} catch (e) {
return mecha.reply(m.chat, func.jsonFormat(e), m);
}
return !0;
}
}