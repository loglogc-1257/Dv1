const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'imgur',
  description: "Télécharge une image sur Imgur.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const imageUrl = args[0];

    if (!imageUrl) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !imgur [URL de l'image]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/imgur?url=${encodeURIComponent(imageUrl)}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🖼️ Image uploadée : ${data.link}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Imgur:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec Imgur." }, pageAccessToken);
    }
  },
};