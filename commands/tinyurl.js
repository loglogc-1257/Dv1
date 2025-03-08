const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'tinyurl',
  description: "Raccourcit une URL avec TinyURL.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const longUrl = args[0];

    if (!longUrl) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !tinyurl [URL longue]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/tinyurl?upload=${encodeURIComponent(longUrl)}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🔗 URL raccourcie : ${data.shortUrl}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API TinyURL:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec TinyURL." }, pageAccessToken);
    }
  },
};