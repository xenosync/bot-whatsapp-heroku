const axios = require('axios');

exports.run = {
usage: ['search3d'],
hidden: ['search3DAssets'],
use: 'text',
category: 'ai',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'cat'));
mecha.sendReact(m.chat, '🕒', m.key);
let response;
try {
response = await search3DAssets(m.text);
} catch (error) {
return m.reply('Error fetching the 3D assets:', error.message);
}

const formattedResponse = formatResponse(response.data);
mecha.sendMessage(m.chat, {text: formattedResponse}, {quoted: m, ephemeralExpiration: m.expiration});
},
premium: true
};

const search3DAssets = async (searchText, limit = 20, adminDemo = true) => {
const url = 'https://api.csm.ai/image-to-3d-sessions/session-search/vector-search';

const headers = {
'Accept': '*/*',
'Accept-Encoding': 'gzip, deflate, br, zstd',
'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,af;q=0.6',
'Connection': 'keep-alive',
'Content-Length': '50',
'Content-Type': 'application/json',
'Host': 'api.csm.ai',
'Origin': 'https://3d.csm.ai',
'Referer': 'https://3d.csm.ai/',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
'X-Platform': 'web',
'X_csm_client_id': 'a757f793-6926-4751-8e54-105066c651c0',
'X_csm_client_secret': '587a62759f1b4d57aa7d051602b06b0f899fafeb6c044ea9ad0fab1065ec236e'
};

const params = {
limit,
search_text: searchText,
admin_demo: adminDemo
};

try {
const response = await axios.post(url, params, { headers });
return response.data;
} catch (error) {
throw new Error('Error fetching the 3D assets: ' + error.message);
}
};

const formatResponse = (data) => {
return data.map(item => {
return `
ID: ${item._id}
User: ${item.user_id ? item.user_id.name : 'N/A'} (${item.user_id ? item.user_id.tier : 'N/A'})
Session Code: ${item.session_code}
Image URL: ${item.image_url}
Input Image: ${item.input_image}
Mesh URL (GLB): ${item.mesh_url_glb}
Session GIF: ${item.session_gif}
Status: ${item.status}
`.trim();
}).join('\n\n');
};