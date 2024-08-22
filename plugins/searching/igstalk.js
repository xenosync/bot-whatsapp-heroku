const axios = require('axios');

async function igStalk(username) {
try {
const { data, status } = await axios.get(`https://instasupersave.com/api/ig/userInfoByUsername/${username}`, { headers: { "user-agent": "WhatsApp/1.2.3" }});
if (data.result.user.pronouns.length === 0) {
var pronoun = '-';
} else {
const splPron = data.result.user.pronouns;
const addSlash = splPron.join("/");
var pronoun = addSlash;
}
const res = data.result.user;
const result = {
username: res.username,
fullName: res.full_name,
followers: res.follower_count,
following: res.following_count,
pronouns: pronoun,
verified: res.is_verified,
private: res.is_private,
totalPosts: res.media_count,
bio: res.biography,
externalUrl: res.external_url,
urlAcc: `https://instagram.com/${username}`,
profilePic: res.hd_profile_pic_url_info.url,
pkId: res.pk_id,
};
return result;
} catch (err) {
throw err;
}
}

exports.run = {
usage: ['igstalk'],
use: 'username',
category: 'searching',
async: async (m, { func, mecha }) => {
// instagram stalk by SuryaDev
if (!m.text) {
m.reply('Mohon input username Instagram yang akan di-stalk.');
return;
}
mecha.sendReact(m.chat, '🕒', m.key);
try {
// stalking profil Instagram
const result = await igStalk(m.text);
// menyusun dan mengirim informasi profil
const stalkMessage = `*INSTAGRAM STALK*\n
    - *Username:* ${result.username}
    - *Full Name:* ${result.fullName}
    - *Followers:* ${result.followers}
    - *Following:* ${result.following}
    - *Pronouns:* ${result.pronouns}
    - *Verified:* ${result.verified ? 'Yes' : 'No'}
    - *Private:* ${result.private ? 'Yes' : 'No'}
    - *Total Posts:* ${result.totalPosts}
    - *Bio:* ${result.bio}
    - *External URL:* ${result.externalUrl}
    - *Instagram URL:* [${m.text}](${result.urlAcc})
    - *Profile Picture:* [Link](${result.profilePic})
    - *PK ID:* ${result.pkId}`;
// mengirim gambar profil bersama dengan pesan teks
mecha.sendMessage(m.chat, {image: {url: result.profilePic}, caption: stalkMessage}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (error) {
console.error('Error stalking Instagram profile:', error);
mecha.reply(m.chat, 'Terjadi kesalahan saat menyelidiki profil Instagram. Pastikan username yang dimasukkan benar dan coba lagi.', m);
}
}
}