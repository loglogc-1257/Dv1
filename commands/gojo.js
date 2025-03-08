const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'gojo',
  description: "Pose une question à Gojo Satoru.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const question = args.join(" ").trim();

    if (!question) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !gojo [Votre question]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/gojo?ask=${encodeURIComponent(question)}&uid=${senderId}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🕶️ Gojo dit : ${data.response}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Gojo:', error.message);
      await sendMessage(senderId, { text: "⚠️ Erreur avec Gojo, réessayez plus tard." }, pageAccessToken);
    }
  },
};
