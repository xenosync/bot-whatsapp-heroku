const fetch = require('node-fetch');

async function uploadPaste(content) {
  const response = await fetch("https://paste.fascinated.cc/api/upload", {
    method: "POST",
    body: content,
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message);
  return { ...json, url: `https://paste.fascinated.cc/raw/${json.key}` };
}

async function processMessage(m, { func, mecha }) {
  const teks = m.quoted ? m.quoted.text : m.text;
  if (!teks) return mecha.reply(m.chat, 'No text found');
  await mecha.sendReact(m.chat, '🕒', m.key);
  try {
    const response = await uploadPaste(teks);
    await mecha.reply(m.chat, formatResponse(response), m);
  } catch (error) {
    await mecha.reply(m.chat, formatResponse({ error: error.message }), m);
  }
}

function formatResponse(response) {
  return response.url ? `${response.url}` : `*Error:* ${response.error}`;
}

exports.run = {
  usage: ['paste2'],
  hidden: [],
  category: 'tools',
  async: async (m, { func, mecha }) => {
    console.time("processMessage");
    await processMessage(m, { func, mecha });
    console.timeEnd("processMessage");
  }
};
