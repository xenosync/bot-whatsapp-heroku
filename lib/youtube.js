const axios = require('axios');
const yts = require('yt-search');
const decode = require('html-entities').decode;

module.exports = class Youtube {
postdata = async (endpoint, params) => {
try {
const { data } = await axios.post(`https://id-y2mate.com${endpoint}`, new URLSearchParams(params), {
headers: {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Accept': '*/*',
'X-Requested-With': 'XMLHttpRequest'
}
});
return data;
} catch (error) {
console.error(error.response ? `HTTP error! status: ${error.response.status}` : `Axios error: ${error.message}`);
}
}

getmp3 = (url) => new Promise(async (resolve, reject) => {
try {
const { links, vid, title } = await this.postdata('/mates/analyzeV2/ajax', {
k_query: url,
k_page: 'home',
hl: '',
q_auto: '0'
});
const results = {};
for (let i in links.mp3) {
const input = links.mp3[i];
const { fquality, dlink } = await this.postdata('/mates/convertV2/index', {
vid: vid,
k: input.k
});
results[fquality] = {
size: input.q,
url: dlink
};
}
resolve({
developer: 'SuryaDev',
status: true,
videoid: vid,
url: `https://youtube.com/watch?v=${vid}`,
title: title,
thumb: `https://i.ytimg.com/vi/${vid}/hq720.jpg`,
audio: results["128"].url
});
} catch (error) {
console.error(`Failed to process URL: ${url}`, error);
resolve({
developer: 'SuryaDev',
status: false,
message: error.message
});
}
})

getmp4 = (url) => new Promise(async (resolve, reject) => {
try {
const { links, vid, title } = await this.postdata('/mates/analyzeV2/ajax', {
k_query: url,
k_page: 'home',
hl: '',
q_auto: '0'
});
const results = {};
for (let i in links.mp4) {
const input = links.mp4[i];
const { fquality, dlink } = await this.postdata('/mates/convertV2/index', {
vid: vid,
k: input.k
});
results[fquality] = {
size: input.q,
url: dlink
};
}
resolve({
developer: 'SuryaDev',
status: true,
videoid: vid,
url: `https://youtube.com/watch?v=${vid}`,
title: title,
thumb: `https://i.ytimg.com/vi/${vid}/hq720.jpg`,
video: results["360"].url
});
} catch (error) {
console.error(`Failed to process URL: ${url}`, error);
resolve({
developer: 'SuryaDev',
status: false,
message: error.message
});
}
})

audio = query => {
return new Promise(async (resolve, reject) => {
try {
let res = await yts(query);
let url = res.all;
let result = url[Math.floor(Math.random() * url.length)];
const { links, vid, title } = await this.postdata('/mates/analyzeV2/ajax', {
k_query: result.url,
k_page: 'home',
hl: '',
q_auto: '0'
});
const results = {};
for (let i in links.mp3) {
const input = links.mp3[i];
const { fquality, dlink } = await this.postdata('/mates/convertV2/index', {
vid: vid,
k: input.k
});
results[fquality] = {
size: input.q,
url: dlink
};
}
resolve({
developer: 'SuryaDev',
status: true,
videoid: vid,
url: result.url,
title: result.title,
thumb: result.image,
audio: results["128"].url
});
} catch (error) {
console.error(`Failed to process URL: ${url}`, error);
resolve({
developer: 'SuryaDev',
status: false,
message: error.message
});
}
})
}

video = query => {
return new Promise(async (resolve, reject) => {
try {
let res = await yts(query);
let url = res.all;
let result = url[Math.floor(Math.random() * url.length)];
const { links, vid, title } = await this.postdata('/mates/analyzeV2/ajax', {
k_query: result.url,
k_page: 'home',
hl: '',
q_auto: '0'
});
const results = {};
for (let i in links.mp4) {
const input = links.mp4[i];
const { fquality, dlink } = await this.postdata('/mates/convertV2/index', {
vid: vid,
k: input.k
});
results[fquality] = {
size: input.q,
url: dlink
};
}
resolve({
developer: 'SuryaDev',
status: true,
videoid: vid,
url: result.url,
title: result.title,
thumb: result.image,
video: results["360"].url
});
} catch (error) {
console.error(`Failed to process URL: ${url}`, error);
resolve({
developer: 'SuryaDev',
status: false,
message: error.message
});
}
})
}

play = query => {
return new Promise(async (resolve, reject) => {
try {
let res = await yts(query);
let url = res.all;
let data = url[Math.floor(Math.random() * url.length)];
const { links, vid, title } = await this.postdata('/mates/analyzeV2/ajax', {
k_query: data.url,
k_page: 'home',
hl: '',
q_auto: '0'
});
const audio = {};
const video = {};
for (let i in links.mp4) {
const input = links.mp4[i];
const { fquality, dlink } = await this.postdata('/mates/convertV2/index', {
vid: vid,
k: input.k
});
video[fquality] = {
size: input.q,
url: dlink
};
}
for (let i in links.mp3) {
const input = links.mp3[i];
const { fquality, dlink } = await this.postdata('/mates/convertV2/index', {
vid: vid,
k: input.k
});
audio[fquality] = {
size: input.q,
url: dlink
};
}
resolve({
developer: 'SuryaDev',
status: true,
videoId: data.videoId,
url: data.url,
title: decode(data.title),
thumbnail: data.thumbnail,
duration: data.seconds + ' (' + data.timestamp + ')',
channel: data.author.name,
source: data.author.url,
views: Number(data.views).toLocaleString().replace(/,/g, '.'),
publish: data.ago,
description: decode(data.description),
video: video["360"].url,
audio: audio["128"].url
});
} catch (error) {
console.error(error);
resolve({
developer: 'SuryaDev',
status: false,
message: error.message
});
}
})
}
}