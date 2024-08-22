exports.run = {
usage: ['tanggal', 'date'],
category: 'group',
async: async (m, { func, mecha }) => {
const today = new Date();
const date = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const dayOfWeek = today.toLocaleDateString("id-ID", { weekday: "long" });
const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
const getTodayDate = `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year} pukul ${timeNow} WIB`;
mecha.reply(m.chat, getTodayDate, m, {
expiration: m.expiration
});
},
limit: true
}