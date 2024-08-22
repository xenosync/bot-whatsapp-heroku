const axios = require('axios');

const stalkff = async (id) => {
try {
const response = await axios.get('https://allstars-apis.vercel.app/freefire?id=' + id);
const data = response.data;
return {
status: 200,
creator: 'Surya',
id: id,
nickname: data.infoBasic.accountName,
accountLevel: data.infoBasic.accountLevel,
accountRegion: data.infoBasic.accountRegion,
accountLikes: data.infoBasic.accountLikes,
accountXP: data.infoBasic.accountXP,
accountCreateTime: data.infoBasic.accountCreateTime,
accountLastLogin: data.infoBasic.accountLastLogin,
brRankPoints: data.infoBasic.brRankPoints,
csRankPoints: data.infoBasic.csRankPoints,
equippedPet: data.infoBasic.equippedPetInfo,
equippedTitle: data.infoBasic.equippedTitle,
guildInfo: data.infoBasic.guildInfo,
guildLeaderInfo: data.infoBasic.guildLeaderInfo
};
} catch (error) {
console.error(error);
return {
status: 404,
creator: 'Surya',
msg: 'User Id Not Found'
};
}
};

exports.run = {
usage: ['ffstalk'],
hidden: ['stalkff'],
use: 'id free fire',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, '382948365'));
await stalkff(Number(m.args[0])).then(data => {
if (data.status == 404) return m.reply('Error ID tidak ditemukan\nSilahkan kirim ID yang valid!');
let txt = '乂  *STALKER FREE FIRE*\n';
txt += `\n◦  *ID:* ${m.args[0]}`;
txt += `\n◦  *Username:* ${data.nickname}`;
txt += `\n◦  *Level:* ${data.accountLevel}`;
txt += `\n◦  *XP:* ${data.accountXP}`;
txt += `\n◦  *Region:* ${data.accountRegion}`;
txt += `\n◦  *Likes:* ${data.accountLikes}`;
txt += `\n◦  *Account Created:* ${data.accountCreateTime}`;
txt += `\n◦  *Last Login:* ${data.accountLastLogin}`;
txt += `\n◦  *Battle Royale Rank Points:* ${data.brRankPoints}`;
txt += `\n◦  *Clash Squad Rank Points:* ${data.csRankPoints}`;
txt += `\n◦  *Equipped Title:* ${data.equippedTitle}`;
txt += `\n◦  *Equipped Pet:*`
txt += `\n    ◦  *Name:* ${data.equippedPet.petName}`
txt += `\n    ◦  *Type:* ${data.equippedPet.petType}`
txt += `\n    ◦  *Level:* ${data.equippedPet.petLevel}`
txt += `\n    ◦  *XP:* ${data.equippedPet.petXP}\n`;
txt += `\n◦  *Guild Info:*`
txt += `\n    ◦  *Name:* ${data.guildInfo.guildName}`
txt += `\n    ◦  *ID:* ${data.guildInfo.guildID}`
txt += `\n    ◦  *Level:* ${data.guildInfo.guildLevel}`
txt += `\n    ◦  *Current Members:* ${data.guildInfo.guildCurrentMembers}/${data.guildInfo.guildCapacity}\n`;
txt += `\n◦  *Guild Leader Info:*`
txt += `\n    ◦  *Name:* ${data.guildLeaderInfo.leaderName}`
txt += `\n    ◦  *ID:* ${data.guildLeaderInfo.leaderUID}`
txt += `\n    ◦  *Level:* ${data.guildLeaderInfo.leaderLevel}`
txt += `\n    ◦  *XP:* ${data.guildLeaderInfo.leaderXP}`
txt += `\n    ◦  *Likes:* ${data.guildLeaderInfo.leaderLikes}`
txt += `\n    ◦  *Last Login:* ${data.guildLeaderInfo.leaderLastLogin}\n`;
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
});
},
limit: true
}