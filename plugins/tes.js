const { obfuscate } = require('javascript-obfuscator');
const axios = require('axios');

async function createPaste(content) {
    const data = {
        key: "abFFSw5uEbwkh1APp0hRTbwXgU4B9DZZwf7rjRPZE",
        description: "Paste created via API",
        sections: [{ name: "Section 1", syntax: "text", contents: content }],
        expires: "1w"
    };
    try {
        const response = await axios.post("https://api.paste.ee/v1/pastes", data, {
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "abFFSw5uEbwkh1APp0hRTbwXgU4B9DZZwf7rjRPZE"
            }
        });
        const result = response.data;
        const rawUrl = result.link.replace('/p/', '/r/') + "/0";
        return result ? { status: 0, original: result.link, raw: rawUrl } : { status: 1, original: null, raw: null };
    } catch (error) {
        return logError(error);
    }
}

function logError(error) {
    console.error("[ERROR]", error);
    return {
        status: 1,
        original: null,
        raw: null,
        error: error.response ? error.response.data : error.message
    };
}

function formatResponse(response) {
    return response.status === 0 ? `${response.raw}` : `Error: ${response.error}`;
}

exports.run = {
    usage: ['enkrip'],
    category: 'owner',
    async: async (m, { mecha, quoted }) => {
        if (!quoted) return m.reply('Harap reply ke pesan yang ingin di-enkrip.');
        try {
            const data = quoted.mimetype === 'text/plain' || !quoted.mimetype ? quoted.text : null;
            if (!data) return m.reply('Harap reply ke pesan teks.');

            // Daftar 50 kata terlarang
            const forbiddenWords = [
                "/* drug */", "/* violence */", "/* adult content */", "/* hate speech */", "/* self-harm */",
                "/* suicide */", "/* illegal activities */", "/* terrorism */", "/* harassment */", "/* exploitation */",
                "/* abuse */", "/* racism */", "/* sexism */", "/* extremist content */", "/* phishing */",
                "/* malware */", "/* ransomware */", "/* spam */", "/* identity theft */", "/* hacking */",
                "/* adult material */", "/* drug trafficking */", "/* sexual violence */", "/* torture */", "/* gore */",
                "/* bomb making */", "/* bomb threats */", "/* cyberbullying */", "/* abusive language */", "/* predatory behavior */",
                "/* child exploitation */", "/* adult services */", "/* stalking */", "/* doxxing */", "/* dangerous organizations */",
                "/* insider trading */", "/* fraud */", "/* counterfeit */", "/* scam */", "/* illegal gambling */",
                "/* illegal drug sales */", "/* copyright infringement */", "/* illicit substances */", "/* unwanted contact */",
                "/* unauthorized access */", "/* human trafficking */", "/* illegal weapons */", "/* unethical practices */",
                "/* exploitative content */", "/* unethical behavior */", "/* harmful content */", "/* prohibited material */",
                "/* sensitive information */", "/* confidential data */", "/* illegal downloads */", "/* abusive conduct */",
                "/* exploitative practices */", "/* illicit activity */", "/* prohibited behavior */", "/* sensitive topics */"
            ];
            
            let enhancedData = data;
            forbiddenWords.forEach(word => {
                enhancedData += ` ${word}`;
            });

            const obfuscationOptions = {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1.0,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1.0,
                debugProtection: true,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'mangled',
                identifiersPrefix: 'prefix_',
                numbersToExpressions: true,
                renameGlobals: true,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: ['base64', 'rc4'],
                stringArrayThreshold: 1.0,
                unicodeEscapeSequence: true,
                simplify: false,
                splitStrings: true,
                splitStringsChunkLength: 5,
                transformObjectKeys: true,
                additionalContent: 'metadata{random}dummy{data}to{increase}complexity'
            };

            const obfuscatedCode = obfuscate(enhancedData, obfuscationOptions).getObfuscatedCode().replace(/\n/g, '');
            const response = await createPaste(obfuscatedCode);
            const encryptedInfo = formatResponse(response);

            await mecha.sendReact(m.chat, '✅', m.key);
            try {
                await m.reply(obfuscatedCode); // Kirim pesan hasil enkripsi secara langsung
            } catch (e) {
                console.error("Gagal mengirim pesan langsung, mengirim link sebagai gantinya.");
                await m.reply(encryptedInfo); // Kirim link jika pengiriman langsung gagal
            }
        } catch (e) {
            console.error(e);
            m.reply(`Terjadi kesalahan saat meng-enkrip pesan: ${e.message}`);
        }
    },
    devs: true
};