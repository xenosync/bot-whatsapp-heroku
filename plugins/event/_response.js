exports.run = {
    main: async (m, { func, mecha, users, groups, setting }) => {
        /* Anti Toxic Kepada Bot By SuryaDev */
        if (users && !users.banned && !users.premium && !m.isOwner) {
            function warning () {
                users.warning += 1;
                let warning = users.warning;
                if (warning >= 3) return m.reply(`Anda melanggar *Syarat & Ketentuan* penggunaan bot dengan menggunakan kata kunci yang masuk daftar hitam, sebagai hukuman atas pelanggaran Anda diblokir dan dibanned. Untuk membuka blokir dan unbanned Anda harus membayar *Rp. 10.000,-*`).then(() => {
                    users.banned = true;
                    users.expired.banned = 'PERMANENT';
                    mecha.updateBlockStatus(m.sender, 'block');
                });
                return m.reply(`乂  *W A R N I N G* \n\nAnda Mendapat Peringatan : [ ${warning} / 3 ]\n\nJika Anda mendapatkan 3 peringatan, Anda akan otomatis diblokir dan dibanned oleh system.`);
            }
            if (m.isGc && m.budy && (new RegExp('\\b' + setting.toxic.map(v => 'bot ' + v).join('\\b|\\b') + '\\b')).test(m.budy?.toLowerCase())) return warning();
            if (m.isPc) {
                let array = m.budy.toLowerCase().split(' ');
                let status = removeDuplicateLetters(array).map(words => setting.toxic.some(badword => badword == words)).filter(state => state);
                if (status.length > 0) return warning();
            }
        }

        /* respon ketika ada yang ketik bot */
        if (m.budy && m.budy.toLowerCase() === 'bot') {
            // Nonaktifkan fitur ini
            /*
            if (m.isGc && groups.mute && !m.isOwner) return;
            if (users && users.banned && !m.isOwner) return;
            let old = new Date();
            let messageId = 'MECHA' + func.makeid(8).toUpperCase() + 'GPT';
            let { key } = await mecha.sendMessage(m.chat, {text: '⬢⬡⬡⬡⬡⬡⬡⬡⬡⬡ 10%'}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
            let prefix = (setting.multiprefix ? 'multi prefix' : `( ${func.texted('monospace', m.prefix)} )`);
            let runtime = func.runtime(process.uptime());
            let speed = ((new Date - old) * 1);
            let array = [
                { text: '⬢⬢⬢⬡⬡⬡⬡⬡⬡⬡ 30%', timeout: 100 },
                { text: '⬢⬢⬢⬢⬢⬡⬡⬡⬡⬡ 50%', timeout: 100 },
                { text: '⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢ 100%', timeout: 100 },
                { text: `◦ *Prefix :* ${prefix}\n◦ *Runtime :* ${runtime}\n◦ *Response Speed :* ${speed}ms`, timeout: 100 },
            ];
            for (let i = 0; i < array.length; i++) {
                await new Promise(resolve => setTimeout(resolve, array[i].timeout));
                await mecha.relayMessage(m.chat, {
                    protocolMessage: {
                        key: key,
                        type: 14,
                        editedMessage: {
                            conversation: array[i].text
                        }
                    }
                }, {quoted: m, ephemeralExpiration: m.expiration});
            }
            if (speed >= 1000) {
                await mecha.sendMessage(m.chat, {text: `Bot telah mengalami delay ${speed}ms, sistem me-restart bot secara otomatis.`}, {ephemeralExpiration: m.expiration}).then(async () => {
                    await global.database.save(global.db);
                    if (!process.send) return;
                    process.send('reset');
                });
            }
            */
        }

        setInterval(async () => {
            let seconds = Number(process.uptime());
            let menit = Math.floor(seconds / 60);
            if (menit >= 180) {
                await global.database.save(global.db);
                if (!process.send) return;
                process.send('reset');
            }
        }, 5 * 1000);

        /* respon ketika ada yang mengirim group invite */
        // Nonaktifkan fitur ini
        /*
        if ((m.mtype === 'groupInviteMessage' || ['Undangan untuk bergabung', 'Invitation to join', 'Buka tautan ini', 'chat.whatsapp.com'].includes(m.budy)) && !setting.link.includes(m.budy) && !m.isGc && !m.fromMe && !m.isOwner) {
            let invite = `Halo, sepertinya Anda ingin mengundang bot ke grup Anda.
            
            ◦ 15 day - Rp 10k
            ◦ 30 day - Rp 20k
            ◦ 60 day - Rp 35k
            ◦ 90 day - Rp 50k

            Jika berminat hubungi: wa.me/${global.owner.replace(/[^0-9]/g, '')} untuk order :)`;
            return mecha.sendMessageModify(m.chat, invite, m, {
                largeThumb: true,
                thumbnail: await mecha.resize('https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg', 300, 175),
                url: `https://wa.me/${global.owner.replace(/[^0-9]/g, '')}?text=sewa+bot`
            });
        }
        */
    }
}

function removeDuplicateLetters(array) {
    let newArray = array.map(word => {
        return word.replace(/(.)\1+/g, '$1');
    });
    return newArray;
}

function somematch(data, id) {
    let status = data.some((x) => x === id);
    return status ? true : false;
}
