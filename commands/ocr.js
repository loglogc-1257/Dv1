const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'ocr',
  description: "Effectue une reconnaissance de texte sur une image.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const imageUrl = args[0];

    if (!imageUrl) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !ocr [URL de l'image]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/ocr?url=${encodeURIComponent(imageUrl)}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `📜 Texte extrait : ${data.text}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API OCR:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec OCR." }, pageAccessToken);
    }
  },
};