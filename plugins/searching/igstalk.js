const axios = require('axios');
async function igStalk(username) {
    try {
        const { data } = await axios.get(`https://api.alyachan.dev/api/igstalk?username=${username}&apikey=6nY0bL`);
        if (!data.status) {
            throw new Error('Failed to retrieve data');
        }
        const userInfo = data.data.user_info;
        const result = {
            username: userInfo.username,
            fullName: userInfo.full_name,
            followers: userInfo.followers,
            following: userInfo.following,
            verified: userInfo.is_verified,
            private: userInfo.is_private,
            totalPosts: userInfo.posts,
            bio: userInfo.biography,
            externalUrl: userInfo.external_url,
            urlAcc: `https://instagram.com/${userInfo.username}`,
            profilePic: userInfo.profile_pic_url,
            pkId: userInfo.id,
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
        if (!m.text) {
            m.reply('Mohon input username Instagram yang akan di-stalk.');
            return;
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const result = await igStalk(m.text);
            const stalkMessage = `*INSTAGRAM STALK*\n\n` +
                `*Username:* ${result.username}\n` +
                `*Full Name:* ${result.fullName}\n` +
                `*Followers:* ${result.followers.toLocaleString()}\n` +
                `*Following:* ${result.following.toLocaleString()}\n` +
                `*Verified:* ${result.verified ? 'Yes' : 'No'}\n` +
                `*Private Account:* ${result.private ? 'Yes' : 'No'}\n` +
                `*Total Posts:* ${result.totalPosts.toLocaleString()}\n` +
                `*Bio:* ${result.bio || 'No bio available'}\n` +
                `*PK ID:* ${result.pkId}`;
            mecha.sendMessage(m.chat, { image: { url: result.profilePic }, caption: stalkMessage }, { quoted: m, ephemeralExpiration: m.expiration });
        } catch (error) {
            console.error('Error stalking Instagram profile:', error);
            mecha.reply(m.chat, 'Terjadi kesalahan saat menyelidiki profil Instagram. Pastikan username yang dimasukkan benar dan coba lagi.', m);
        }
    }
}
