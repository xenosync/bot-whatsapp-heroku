exports.run = {
usage: ['bomb'],
hidden: ['tebakbom'],
category: 'games',
async: async (m, { func, mecha }) => {
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
mecha.bomb = mecha.bomb ? mecha.bomb : {};
let id = m.chat,
timeout = 180000;
if (id in mecha.bomb) return mecha.reply(m.chat, '*^ sesi ini belum selesai!*', mecha.bomb[id].msg);
const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const array = bom.map((v, i) => ({
emot: v,
number: number[i],
position: i + 1,
state: false
}));
let txt = `乂  *B O M B*\n\nReply pesan ini dengan angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
for (let i = 0; i < array.length; i += 3) txt += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += `\nTimeout : *${((timeout / 1000) / 60)} menit*\nApabila mendapat kotak yang berisi bom maka balance akan di kurangi.`;
let msg = await mecha.reply(m.chat, txt, mecha.bomb[id] ? mecha.bomb[id].msg : m);

let v;
mecha.bomb[id] = {
msg: msg,
array: array,
time: setTimeout(() => {
v = array.find(v => v.emot == '💥');
if (mecha.bomb[id]) mecha.reply(m.chat, `*Waktu habis!*, Bom berada di kotak nomor ${v.number}.`, mecha.bomb[id].msg);
delete mecha.bomb[id];
}, timeout),
};

},
main: async (m, { func, mecha, setting }) => {
try {
let id = m.chat;
let timeout = 180000;
let hadiah = func.hadiah(setting.hadiah);
let users = global.db.users[m.sender];
mecha.bomb = mecha.bomb ? mecha.bomb : {};

let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.budy);
if (mecha.bomb[id] && isSurrender) {
await mecha.reply(m.chat, 'Menyerah', m);
clearTimeout(mecha.bomb[id].time);
delete mecha.bomb[id];
}

if (mecha.bomb[id] && m.quoted && m.quoted.id == mecha.bomb[id].msg.key.id && !isNaN(m.budy)) {
let json = mecha.bomb[id].array.find(v => v.position == m.budy);
if (!json) return mecha.reply(m.chat, `Untuk membuka kotak reply pesan ini dengan angka 1 - 9`, mecha.bomb[id] ? mecha.bomb[id].msg : m);

if (json.emot == '💥') {
json.state = true;
let bomb = mecha.bomb[id].array;
let txt = `乂  *B O M B*\n\n`;
txt += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
txt += `Timeout : *${((timeout / 1000) / 60)} menit*\n`;
txt += `*Permainan selesai!*, kotak berisi bom terbuka: (- *$${func.formatNumber(hadiah)}* balance)`;

mecha.reply(m.chat, txt, m).then(() => {
users.balance < hadiah ? users.balance = 0 : users.balance -= hadiah;
clearTimeout(mecha.bomb[id].time);
delete mecha.bomb[id];
});
} else if (json.state) {
return mecha.reply(m.chat, `Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, m);
} else {
json.state = true;
let changes = mecha.bomb[id].array;
let open = changes.filter(v => v.state && v.emot != '💥').length;

if (open >= 8) {
let txt = `乂  *B O M B*\n\n`;
txt += `Reply pesan ini dengan angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
txt += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
txt += `Timeout : *${((timeout / 1000) / 60)} menit*\n`;
txt += `*Permainan selesai!* kotak berisi bom tidak terbuka: (+ *$${func.formatNumber(hadiah)}* balance)`;

mecha.reply(m.chat, txt, m).then(() => {
users.balance += hadiah;
clearTimeout(mecha.bomb[id].time);
delete mecha.bomb[id];
});
} else {
let txt = `乂  *B O M B*\n\n`;
txt += `Reply pesan ini dengan angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
txt += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
txt += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
txt += `Timeout : *${((timeout / 1000) / 60)} menit*\n`;
txt += `Kotak berisi bom tidak terbuka : (+ *$${func.formatNumber(hadiah)}* balance)`;

mecha.relayMessage(m.chat, {
protocolMessage: {
key: mecha.bomb[id].msg.key,
type: 14,
editedMessage: {
conversation: txt
}
}
}, {}).then(() => {
users.balance += hadiah;
});
}
}
}
} catch (e) {
return mecha.reply(m.chat, e.toString(), m);
}
return !0;
}
}