let database = new Map();

// Message filter
const usedCommandRecently = new Set();

/**
 * Check if number is filtered.
 * @param {String} from 
 * @returns {Boolean}
 */
const isFiltered = (from) => {
return usedCommandRecently.has(from);
};

/**
 * Add number to filter.
 * @param {String} from 
 */
const addFilter = (from) => {
usedCommandRecently.add(from);
setTimeout(() => {
usedCommandRecently.delete(from);
}, global.cooldown * 1000); // 5 seconds delay, I don't recommend below that.
};

const addSpam = (jid) => {
if (database.has(jid)) {
let user = database.get(jid);
user.spam += 1;
} else {
database.set(jid, {
id: jid,
spam: 1,
expired: Date.now() + 300000 // 5 minutes
});
}
};

exports.run = {
main: async (m, { mecha, setting, isPrem }) => {
/* Function Anti Spam Command By SuryaDev */
setInterval(() => {
let expiredUsers = [];
database.forEach((user, jid) => {
if (Date.now() >= user.expired) {
expiredUsers.push(jid);
}
});
expiredUsers.forEach(jid => {
mecha.sendMessage(global.owner, {
text: `Spam command expired: @${jid.split('@')[0]}`,
mentions: [jid]
}, {
quoted: m,
ephemeralExpiration: m.expiration
});
database.delete(jid);
});
}, 5000); // Run every 5 seconds

async function spamming() {
if (!database.has(m.sender)) await addSpam(m.sender);
let user = database.get(m.sender);
if (user.spam < 5) {
user.spam += 1;
mecha.sendMessage(m.chat, {
text: `System detects you are spamming, please cooldown for *${global.cooldown} seconds*.`
}, {
quoted: m,
ephemeralExpiration: m.expiration
});
} else {
database.delete(m.sender);
return mecha.sendMessage(m.chat, {
text: `You were temporarily banned for ${((setting.timer / 1000) / 60)} minutes cause you over spam.`
}, {
quoted: m,
ephemeralExpiration: m.expiration
}).then(() => {
global.db.users[m.sender].banned = true;
global.db.users[m.sender].expired.banned = Date.now() + setting.timer;
});
}
}

if (setting.antispam && m.budy && m.isPrefix && isFiltered(m.sender)) return spamming();
if (setting.antispam && m.budy && m.isPrefix && !m.isOwner && !isPrem) addFilter(m.sender);
}
}