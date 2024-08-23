const toMs = require('ms');

exports.run = {
main: async (m, { func, mecha, setting, users, groups }) => {
/* Function Restarting Expired Users & Groups By SuryaDev */
let now = Date.now();
if (m.isGc && groups) groups.expired = now + toMs('30d');
if (users) users.expired.user = (users.premium ? now + toMs('90d') : now + toMs('30d'));

/* Function Anti Error By SuryaDev */
if (/limit|ceklimit|balance|toplevel|topbalance||profile|profil|me|listsewa|listpremium|listprem/i.test(m.command)) {
const users = Object.values(global.db.users);
const groups = Object.values(global.db.groups);

users.forEach(user => {
if (user.balance > 999999999999999999) user.balance = 999999999999999999;
if (user.limit > 1000000000000000) user.limit = 1000000000000000;
if (user.balance < 0) user.balance = 0;
if (user.limit < 0) user.limit = 0;
if (user.balance == null) user.balance = 0;
if (user.limit == null) user.limit = 0;
if (user.balance > 100000000 && !user.premium) user.balance = 100000000;
if (user.limit > 1000 && !user.premium) user.limit = 1000;
if (isNaN(user.balance)) user.balance = 0;
if (isNaN(user.limit)) user.limit = setting.limit;
});

if (m.isGc && groups) groups.forEach(group => {
if (group.sewa && isNaN(group.sewa.expired)) group.sewa.expired = 0;
});

const roles = {
'Bronze V': 0, 'Bronze IV': 5, 'Bronze III': 10, 'Bronze II': 15, 'Bronze I': 20,
'Silver V': 25, 'Silver IV': 30, 'Silver III': 35, 'Silver II': 40, 'Silver I': 45,
'Elite V': 50, 'Elite IV': 55, 'Elite III': 60, 'Elite II': 65, 'Elite I': 70,
'Master V': 75, 'Master IV': 80, 'Master III': 85, 'Master II': 90, 'Master I': 95,
'Grand Master V': 100, 'Grand Master IV': 110, 'Grand Master III': 120, 'Grand Master II': 130, 'Grand Master I': 140,
'Epic V': 150, 'Epic IV': 160, 'Epic III': 170, 'Epic II': 180, 'Epic I': 190,
'Legend V': 200, 'Legend IV': 250, 'Legend III': 300, 'Legend II': 350, 'Legend I': 400,
'Mythic V': 450, 'Mythic IV': 500, 'Mythic III': 550, 'Mythic II': 600, 'Mythic I': 650,
'Mythical Honor': 700, 'Mythical Honor': 800, 'Mythical Immortal': 1000
};

users.forEach(user => {
let role = Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([_, minLevel]) => user.level >= minLevel) || Object.entries(roles)[0];
user.role = role[0];
});
}
}
}
