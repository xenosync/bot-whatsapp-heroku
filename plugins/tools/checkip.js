const fetch = require('node-fetch');

async function checkIP(ip) {
    let anu;
    try {
        anu = await fetch(`https://api.alyachan.dev/api/ip?ip=${ip}&apikey=6nY0bL`)
            .then(v => v.json());
        if (anu.status) {
            return JSON.stringify(anu.data, null, 4);
        } else {
            return 'Failed to retrieve IP information. Please check the IP and try again.';
        }
    } catch (e) {
        console.log(e);
        return 'An error occurred while fetching IP information.';
    }
}

exports.run = {
    usage: ['checkip'],
    hidden: ['ip'],
    use: 'IP Address',
    category: 'tools',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(`Masukkan IP Address!\n\n*Contoh:* ${m.cmd} 64.227.103.212`);
        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(m.text)) return m.reply('Invalid IP Address format.');
        mecha.sendReact(m.chat, '🕒', m.key);
        let anu = await checkIP(m.text.trim());
        m.reply(`${anu}`);
    },
    limit: true
}
