const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'senku',
  description: "Pose une question à Senku Ishigami.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const question = args.join(" ").trim();

    if (!question) {
      return await sendMessage(senderId, { text: "❌ Utilisation : !senku [Votre question]" }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/senku?ask=${encodeURIComponent(question)}&uid=${senderId}`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🔬 Senku dit : ${data.response}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Senku:', error.message);
      await sendMessage(senderId, { text: "⚠️ Erreur avec Senku, réessayez plus tard." }, pageAccessToken);
    }
  },
};
