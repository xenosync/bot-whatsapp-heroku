const axios = require('axios');
async function twitterStalk(username) {
    try {
        const { data } = await axios.get(`https://api.alyachan.dev/api/twitter-stalk?username=${username}&apikey=6nY0bL`);  
        if (!data.status) {
            throw new Error('Failed to retrieve data');
        }
        const userInfo = data.data;
        const result = {
            username: userInfo.username,
            nickname: userInfo.nickname,
            profilePic: userInfo.profile,
            bio: userInfo.biography,
            joinDate: userInfo.join_at,
            location: userInfo.location,
            tweetsCount: userInfo.tweets_count,
            followers: userInfo.followers,
            following: userInfo.following,
        };
        return result;
    } catch (err) {
        throw err;
    }
}
exports.run = {
    usage: ['twitterstalk'],
    use: 'username',
    category: 'searching',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            m.reply('Mohon input username Twitter yang akan di-stalk.');
            return;
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const result = await twitterStalk(m.text);
            const stalkMessage = `*TWITTER STALK*\n\n` +
                `*Username:* ${result.username}\n` +
                `*Nickname:* ${result.nickname}\n` +
                `*Location:* ${result.location || 'No location available'}\n` +
                `*Bio:* ${result.bio || 'No bio available'}\n` +
                `*Join Date:* ${result.joinDate || 'No join date available'}\n` +
                `*Tweets Count:* ${result.tweetsCount.toLocaleString()}\n` +
                `*Followers:* ${result.followers.toLocaleString()}\n` +
                `*Following:* ${result.following.toLocaleString()}`;
            mecha.sendMessage(m.chat, { image: { url: result.profilePic }, caption: stalkMessage }, { quoted: m, ephemeralExpiration: m.expiration });
        } catch (error) {
            console.error('Error stalking Twitter profile:', error);
            mecha.reply(m.chat, 'Terjadi kesalahan saat menyelidiki profil Twitter. Pastikan username yang dimasukkan benar dan coba lagi.', m);
        }
    }
}
