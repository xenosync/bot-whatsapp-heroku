exports.run = {
    usage: ['ytsearch2'],
    hidden: ['yts2'],
    use: 'judul lagu',
    category: 'downloader',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'legends never die'));
        mecha.sendReact(m.chat, '🕒', m.key);
        let data = await func.fetchJson(`https://api.botcahx.eu.org/api/search/yts?query=${encodeURI(m.text)}&apikey=nvsya`);
        if (!data.status) return m.reply(data.message);
        if (data.result.length === 0) return m.reply('Data empty.');
        let listSearch = data.result.map(i => ({
            title: i.title || 'N/A',
            highlight_label: i.author.name || 'N/A',
            rows: [
                {
                    header: 'Audio',
                    title: `${i.published_at} • ${i.duration} • ${func.formatNumber(i.views)} views`,
                    id: `${m.prefix}yta ${i.url}`,
                    description: i.description
                },
                {
                    header: 'Video',
                    title: `${i.published_at} • ${i.duration} • ${func.formatNumber(i.views)} views`,
                    id: `${m.prefix}ytv ${i.url}`,
                    description: i.description
                }
            ]
        }));
        mecha.sendButton(m.chat, `Y O U T U B E - S E A R C H`, `Result From: ${m.text}\n\nSelect the list button below.`, global.footer, [['list', 'Click Here ⎙', listSearch]], m, { expiration: m.expiration });
    },
    limit: true
};
