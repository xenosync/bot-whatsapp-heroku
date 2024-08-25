const yts = require('yt-search');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const API_KEY = '6nY0bL';

async function fetchVideoData(url) {
    try {
        const response = await fetch(`https://api.alyachan.dev/api/aio?url=${url}&apikey=${API_KEY}`);
        const result = await response.json();
        return result;
    } catch (err) {
        return {
            status: false,
            developer: 'AlyaChan API',
            message: err.message
        };
    }
}

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

exports.run = {
    usage: ['play'],
    use: 'judul lagu',
    category: 'downloader',
    async: async (m, { func, mecha }) => {
        mecha.play = mecha.play || {};
        if (!m.text) return m.reply(func.example(m.cmd, 'melukis senja'));
        mecha.sendReact(m.chat, '🕒', m.key);
        const search = await yts(m.text);
        const video = search.videos[0];
        if (!video) return m.reply('Video/Audio tidak ditemukan.');
        if (video.seconds >= 3600) return m.reply('Video lebih dari 1 jam!');
        const caption = `
∘ ID : ${video.videoId}
∘ Title : ${video.title}
∘ Duration : ${formatDuration(video.seconds)}
∘ Views : ${formatNumber(video.views)}
∘ Upload : ${video.ago}
∘ Author : ${video.author.name}
∘ Description : ${video.description}

_reply with number *1* to get audio_
_reply with number *2* to get video_
_reply with number *3* to get document_
        `.trim();
        const data = await fetchVideoData(video.url);
        if (!data.status) return m.reply('Terjadi kesalahan saat mengambil data downloader:\n' + data.message);
        const videoUrl = data.medias.find(media => media.extension === 'mp4')?.url;
        const audioUrl = data.medias.find(media => media.extension === 'mp3')?.url;
        if (!videoUrl || !audioUrl) return m.reply('Format video atau audio tidak tersedia.');
        const videoBuffer = await func.fetchBuffer(videoUrl);
        const videoPath = `./media/${func.filename('mp4')}`;
        await fs.writeFileSync(videoPath, videoBuffer);
        const audioPath = path.join(process.cwd(), 'media', func.filename('mp3'));
        exec(`ffmpeg -i ${videoPath} ${audioPath}`, async (err) => {
            if (err) return m.reply('Error: ' + err.message);
            mecha.play[m.sender] = {
                data: {
                    url: video.url,
                    thumbnail: video.image,
                    duration: formatDuration(video.seconds),
                    title: video.title,
                    audio: fs.readFileSync(audioPath),
                    video: videoBuffer
                },
                audio: true,
                video: true,
                document: true,
                timeout: setTimeout(() => {
                    delete mecha.play[m.sender];
                }, 1000 * 60 * 10)
            };
            const messageId = 'MECHA' + func.makeid(22).toUpperCase() + 'PLAY';
            await mecha.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: caption,
                    contextInfo: {
                        externalAdReply: {
                            title: video.title,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            thumbnailUrl: video.image,
                            sourceUrl: video.url
                        }
                    },
                    mentions: [m.sender]
                }
            }, {quoted: m, ephemeralExpiration: m.expiration, messageId}).then(() => {
                fs.unlinkSync(videoPath);
                fs.unlinkSync(audioPath);
            });
        });
    },
    main: async (m, { func, mecha }) => {
        mecha.play = mecha.play || {};
        if (mecha.play[m.sender] && m.budy && m.quoted && m.quoted.fromMe && m.quoted.id.endsWith('PLAY') && !m.isPrefix) {
            if (!isNaN(m.budy) && ['1', '2', '3'].includes(m.budy)) {
                mecha.sendReact(m.chat, '🕒', m.key);
                const result = mecha.play[m.sender];
                const typefile = m.budy === '1' ? 'audio' : m.budy === '2' ? 'video' : 'document';
                const ext = m.budy === '1' ? '.mp3' : m.budy === '2' ? '.mp4' : '.mp3';
                const mimetype = m.budy === '1' ? 'audio/mpeg' : m.budy === '2' ? 'video/mp4' : 'audio/mpeg';
                await mecha.sendMessage(m.chat, {
                    [typefile]: m.budy === '1' ? result.data.audio : m.budy === '2' ? result.data.video : result.data.audio,
                    caption: result.data.title,
                    mimetype: mimetype,
                    fileName: result.data.title + ext,
                    contextInfo: {
                        externalAdReply: {
                            title: result.data.title,
                            body: `${result.data.duration}`,
                            thumbnail: await mecha.resize(result.data.thumbnail, 300, 175),
                            thumbnailUrl: result.data.thumbnail,
                            mediaType: 2,
                            mediaUrl: result.data.url,
                            sourceUrl: result.data.url
                        }
                    }
                }, {quoted: m, ephemeralExpiration: m.expiration}).then(() => {
                    result[typefile] = false;
                    if (!result.audio && !result.video && !result.document) delete mecha.play[m.sender];
                });
            }
        }
    },
    restrict: true,
    limit: 3
};
