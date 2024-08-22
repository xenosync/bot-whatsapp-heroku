const axios = require('axios');

/*
Created by : KiiCode
Source : https://api.elxyz.me/shorturl/1f1f7e6f
Note : Hapus cr yatim
*/

const tiktokStalk = async (username) => {
const url = 'https://tools.revesery.com/stalktk/revesery.php';
try {
const response = await axios.post(url, null, { params: { username } });
if (response.status !== 200) {
throw new Error('Network response was not ok');
}
const data = response.data;

const result = {
photo: data.photo,
username,
name: data.name,
bio: data.bio,
followers: data.followers,
following: data.following,
likes: data.likes,
posts: data.posts
};

return result;
} catch (error) {
throw new Error('Failed to scrape data:', error);
}
};

exports.run = {
usage: ['tiktokstalk'],
hidden: ['ttstalk'],
use: 'username',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'suryaskylark05'));
mecha.sendReact(m.chat, '🕒', m.key);
try {
const res = await tiktokStalk(m.text);
let txt = `乂  *TIKTOK STALKER*\n`;
txt += `\n◦  Name: ${res.name}`;
txt += `\n◦  Username: ${res.username}`;
txt += `\n◦  Followers: ${res.followers}`;
txt += `\n◦  Following: ${res.following}`;
txt += `\n◦  Bio: ${res.bio}`;
txt += `\n◦  Likes: ${res.likes}`;
txt += `\n◦  Posts: ${res.posts}`;
mecha.sendMessageModify(m.chat, txt, m, {
title: 'TIKTOK STALKER',
body: global.header,
thumbnail: await mecha.resize(res.photo, 300, 175),
largeThumb: true,
expiration: m.expiration
});
} catch (err) {
m.reply('Username tidak ditemukan!');
}
},
limit: 2
}