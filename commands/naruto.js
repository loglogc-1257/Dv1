const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'naruto',
  description: "Pose une question à Naruto Uzumaki.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const question = args.join(" ").trim();

    if (!question) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !naruto [Votre question]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/naruto?ask=${encodeURIComponent(question)}&uid=${senderId}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🍜 Naruto dit : ${data.response}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Naruto:', error.message);
      await sendMessage(senderId, { text: "⚠️ Erreur avec Naruto, réessayez plus tard." }, pageAccessToken);
    }
  },
};
