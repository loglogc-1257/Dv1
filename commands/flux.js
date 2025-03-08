const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'flux',
  description: "Génère une image avec Flux AI.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !flux [description de l'image]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/flux?prompt=${encodeURIComponent(prompt)}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `📷 Image générée : ${data.image}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Flux:', error.message);
      await sendMessage(senderId, { text: "⚠️ Erreur avec Flux." }, pageAccessToken);
    }
  },
};
