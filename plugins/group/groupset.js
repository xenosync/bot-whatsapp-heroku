exports.run = {
    usage: ['groupset'],
    hidden: ['grup', 'gc'],
    use: 'open / close [duration in minutes]',
    category: 'group',
    async: async (m, { func, mecha }) => {
        if (m.args[0] === 'close') {
            let duration = parseInt(m.args[1]) || 0;
            await mecha.groupSettingUpdate(m.chat, 'announcement')
                .then((res) => mecha.sendMessage(m.chat, { react: { text: '✅', key: m.key } }))
                .catch((err) => mecha.sendReact(m.chat, '❌', m.key));
            
            if (duration > 0) {
                setTimeout(async () => {
                    await mecha.groupSettingUpdate(m.chat, 'not_announcement')
                        .then((res) => mecha.sendMessage(m.chat, { react: { text: '⏰ Group is now open again', key: m.key } }))
                        .catch((err) => mecha.sendReact(m.chat, '❌', m.key));
                }, duration * 60 * 1000);
            }
        } else if (m.args[0] === 'open') {
            await mecha.groupSettingUpdate(m.chat, 'not_announcement')
                .then((res) => mecha.sendMessage(m.chat, { react: { text: '✅', key: m.key } }))
                .catch((err) => mecha.sendReact(m.chat, '❌', m.key));
        } else {
            m.reply(func.example(m.cmd, 'open / close [duration in minutes]'));
        }
    },
    group: true,
    admin: true,
    botAdmin: true
};