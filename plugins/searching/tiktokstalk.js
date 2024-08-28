const axios = require('axios');
async function ttStalk(username) {
    try {
        const { data } = await axios.get(`https://api.alyachan.dev/api/tiktok-stalk?username=${username}&apikey=6nY0bL`);
        if (!data.status) {
            throw new Error('Failed to retrieve data');
        }
        const userInfo = data.data;
        const result = {
            username: userInfo.username,
            fullName: userInfo.name,
            followers: userInfo.followers,
            following: userInfo.following,
            likes: userInfo.likes,
            totalPosts: userInfo.posts,
            bio: userInfo.bio,
            profilePic: userInfo.photo,
        };
        return result;
    } catch (err) {
        throw err;
    }
}
exports.run = {
    usage: ['ttstalk'],
    use: 'username',
    category: 'searching',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            m.reply('Mohon input username TikTok yang akan di-stalk.');
            return;
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const result = await ttStalk(m.text);
            const stalkMessage = `*TIKTOK STALK*\n\n` +
                `*Username:* ${result.username}\n` +
                `*Full Name:* ${result.fullName}\n` +
                `*Followers:* ${result.followers.toLocaleString()}\n` +
                `*Following:* ${result.following.toLocaleString()}\n` +
                `*Likes:* ${result.likes.toLocaleString()}\n` +
                `*Total Posts:* ${result.totalPosts.toLocaleString()}\n` +
                `*Bio:* ${result.bio || 'No bio available'}`;
            mecha.sendMessage(m.chat, { image: { url: result.profilePic }, caption: stalkMessage }, { quoted: m, ephemeralExpiration: m.expiration });
        } catch (error) {
            console.error('Error stalking TikTok profile:', error);
            mecha.reply(m.chat, 'Terjadi kesalahan saat menyelidiki profil TikTok. Pastikan username yang dimasukkan benar dan coba lagi.', m);
        }
    }
}
