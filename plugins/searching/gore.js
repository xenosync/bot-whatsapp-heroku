const axios = require('axios'),
cheerio = require('cheerio')

async function gore() {
return new Promise((resolve, reject) => {
const page = Math.floor(Math.random() * 228);
axios.get("https://seegore.com/gore/page/" + page).then((res) => {
const $ = cheerio.load(res.data);
const link = [];
$("ul > li > article").each(function (a, b) {
link.push({
title: $(b).find("div.content > header > h2").text(),
link: $(b).find("div.post-thumbnail > a").attr("href"),
thumb: $(b).find("div.post-thumbnail > a > div > img").attr("src"),
view: $(b).find("div.post-thumbnail > div.post-meta.bb-post-meta.post-meta-bg > span.post-meta-item.post-views").text(),
vote: $(b).find("div.post-thumbnail > div.post-meta.bb-post-meta.post-meta-bg > span.post-meta-item.post-votes").text(),
tag: $(b).find("div.content > header > div > div.bb-cat-links").text(),
comment: $(b).find("div.content > header > div > div.post-meta.bb-post-meta > a").text(),
});
});
const random = link[Math.floor(Math.random() * link.length)];
axios.get(random.link).then((resu) => {
const $$ = cheerio.load(resu.data);
const hasel = {};
hasel.title = random.title;
hasel.source = random.link;
hasel.thumb = random.thumb;
hasel.tag = $$("div.site-main > div > header > div > div > p").text();
hasel.upload = $$("div.site-main").find("span.auth-posted-on > time:nth-child(2)").text();
hasel.author = $$("div.site-main").find("span.auth-name.mf-hide > a").text();
hasel.comment = random.comment;
hasel.vote = random.vote;
hasel.view = $$("div.site-main").find("span.post-meta-item.post-views.s-post-views.size-lg > span.count").text();
hasel.video1 = $$("div.site-main").find("video > source").attr("src");
hasel.video2 = $$("div.site-main").find("video > a").attr("href");
resolve(hasel);
});
});
});
}

exports.run = {
usage: ['gore'],
category: 'searching',
async: async (m, { func, mecha }) => {
mecha.sendReact(m.chat, '🕒', m.key)
if (m.text && m.text.includes('--video2')) {
let button = [
['button', 'Next Video', `${m.prefix}gore`],
['button', 'Delete Video', `${m.prefix}delete`],
]
mecha.sendButton(m.chat, '', 'Nih Video Gore V2 nya..', 'click the button for the next video', button, m, {
media: m.args[1],
userJid: m.sender,
expiration: m.expiration
})
} else {
let result = await gore()
let txt = `Title : ${result.title}
Source : ${result.source}
Tag : ${result.tag}
upload : ${result.upload}
author : ${result.author}
comment : ${result.comment}
vote : ${result.vote}
view : ${result.view}`

let button = [
['button', 'Video V2', `${m.prefix}gore --video2 ${result.video2}`],
['button', 'Delete Video', `${m.prefix}delete`],
]
mecha.sendButton(m.chat, '', 'Nih Video Gore nya..', 'click the button for the next video', button, m, {
media: result.video1,
userJid: m.sender,
expiration: m.expiration
})
}
},
limit: 3
}