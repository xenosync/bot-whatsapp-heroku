const cron = require('node-cron');
const func = require('./functions.js');
const fs = require('fs');

module.exports = async (mecha) => {
    const groups = Object.values(global.db.groups).filter(v => v.automatically).map(x => x.jid);
    const bot = mecha.user.id ? mecha.user.id.split(':')[0] + '@s.whatsapp.net' : mecha.user.jid;
    const setting = global.db.setting[bot];
    const isBotAdmin = (members) => members.some(v => v.admin && v.id === bot);
    const sendError = async (message) => {
        await mecha.sendMessage('6285651915144@s.whatsapp.net', { text: message }, { quoted: func.fstatus('Error Notification'), ephemeralExpiration: 86400 });
    };
    const handleCronError = async (task, error) => {
        await sendError(`Task ${task} Error: ${error.message}`);
    };
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const processGroupsInBatch = async (groups, task) => {
        const batchSize = 3;
        for (let i = 0; i < groups.length; i += batchSize) {
            const batch = groups.slice(i, i + batchSize);
            await Promise.all(batch.map(task));
            await delay(10000);
        }
    };

    const scheduleTask = (cronTime, startingTask, announce) => {
        cron.schedule(cronTime, async () => {
            for (const groupId of groups) {
                try {
                    let groupData = await mecha.groupMetadata(groupId);
                    if (groupData.announce !== announce && isBotAdmin(groupData.participants)) {
                        await startingTask(groupData);
                    }
                } catch (error) {
                    if (error.status === 429) {
                        await delay(60000);
                    } else {
                        await handleCronError('Schedule Task', error);
                    }
                }
            }
        }, { scheduled: true, timezone: 'Asia/Jakarta' });
    };

    scheduleTask('0 0 0 * * *', async (data) => {
        try {
            await mecha.groupSettingUpdate(data.id, 'announcement');
            await delay(1000);
            await mecha.sendMessage(data.id, { text: 'System automatically closing this group because sleeping time.' }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
        } catch (error) {
            await handleCronError('Group Closure', error);
        }
    }, false);

    scheduleTask('0 45 17 * * *', async (data) => {
        try {
            await mecha.groupSettingUpdate(data.id, 'announcement');
            await delay(1000);
            await mecha.sendMessage(data.id, { text: 'System automatically closing this group because maghrib time and will be open 20 minutes from now.' }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
        } catch (error) {
            await handleCronError('Group Closure', error);
        }
    }, false);

    scheduleTask('0 5 18 * * *', async (data) => {
        try {
            await mecha.groupSettingUpdate(data.id, 'not_announcement');
            await delay(1000);
            await mecha.sendMessage(data.id, { text: 'System automatically opening this group because maghrib time is over.' }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
        } catch (error) {
            await handleCronError('Group Opening', error);
        }
    }, true);

    scheduleTask('0 30 23 * * *', async (data) => {
        try {
            await mecha.sendMessage(data.id, { text: 'System will automatically close this group within 30 minutes starting from now.' }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
        } catch (error) {
            await handleCronError('Group Close Notification', error);
        }
    }, false);

    scheduleTask('0 0 5 * * *', async (data) => {
        try {
            await mecha.groupSettingUpdate(data.id, 'not_announcement');
            await delay(1000);
            await mecha.sendMessage(data.id, { text: 'System automatically opening this group because morning time.' }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
        } catch (error) {
            await handleCronError('Group Opening', error);
        }
    }, true);

    const checkExpired = async (condition, message) => {
        let now = Date.now();
        for (let [id, user] of Object.entries(global.db.users)) {
            if (condition(user, now)) {
                await mecha.sendMessage(id, { text: message }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
            }
        }
    };

    const checkExpiredGroups = () => {
        let now = Date.now();
        for (let [id, group] of Object.entries(global.db.groups)) {
            if (group.expired && now >= group.expired) {
                console.log(`Expired Group: ${group.name}`);
                delete global.db.groups[id];
            }
        }
    };

    const checkExpiredSewa = async () => {
        let now = Date.now();
        for (let [id, group] of Object.entries(global.db.groups)) {
            if (group.sewa.status && group.sewa.expired && now >= group.sewa.expired && mecha.isgroup(id)) {
                await mecha.sendMessage(id, { text: 'Bot time has expired and will leave from this group, thank you.', mentions: group.member.map(v => v.jid) }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
                await mecha.groupLeave(id);
                group.sewa.expired = 0;
                group.sewa.status = false;
            }
        }
    };

    const checkExpiredSewaNotice = async () => {
        let now = Date.now();
        for (let [id, group] of Object.entries(global.db.groups)) {
            if (group.sewa.status && group.sewa.notice && group.sewa.expired && (now + 345600000) >= group.sewa.expired && mecha.isgroup(id)) {
                await mecha.sendMessage(id, { text: 'Masa sewa grup ini tersisa 4 hari, perpanjangan hanya berlaku jika masa aktif tersisa kurang dari 3 hari terimakasih.', mentions: Object.values(group.member).map(v => v.jid) }, { quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400 });
                group.sewa.notice = false;
            }
        }
    };

    setInterval(() => checkExpired((user, now) => !user.banned && user.expired.user && now >= user.expired.user, 'Your account has expired'), 5000);
    setInterval(checkExpiredGroups, 5000);
    setInterval(() => checkExpired((user, now) => user.premium && user.expired.premium && now >= user.expired.premium, 'Your premium package has expired'), 5000);
    setInterval(() => checkExpired((user, now) => user.jadibot && user.expired.jadibot && now >= user.expired.jadibot, 'Your jadibot package has expired'), 5000);
    setInterval(() => checkExpired((user, now) => user.banned && user.expired.banned && now >= user.expired.banned, 'Banned berakhir, Jangan melanggar rules agar tidak dibanned lagi.'), 5000);
    setInterval(checkExpiredSewaNotice, 5000);
    setInterval(checkExpiredSewa, 5000);
}

func.reloadFile(__filename);
