const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'scrape',
  description: "Extrait le contenu d'une page web.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const pageUrl = args[0];

    if (!pageUrl) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !scrape [URL de la page]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/scrape?url=${encodeURIComponent(pageUrl)}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `📰 Contenu extrait : ${data.content}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Scrape:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec Scrape." }, pageAccessToken);
    }
  },
};