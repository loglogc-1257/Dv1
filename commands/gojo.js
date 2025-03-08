const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const activeUsers = {};

module.exports = {
  name: 'gojo',
  description: "Active ou désactive les réponses de Gojo.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const command = args.join(" ").toLowerCase().trim();

    if (command === "gojo on") {
      activeUsers[senderId] = true;
      return await sendMessage(senderId, { text: "🌀 Gojo est maintenant activé ! Posez-moi vos questions." }, pageAccessToken);
    }

    if (command === "gojo off") {
      delete activeUsers[senderId];
      return await sendMessage(senderId, { text: "🛑 Gojo est maintenant désactivé." }, pageAccessToken);
    }

    if (!activeUsers[senderId]) return;

    const apiUrl = `https://kaiz-apis.gleeze.com/api/gojo?ask=${encodeURIComponent(command)}&uid=${senderId}&lang=fr`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🔵 Gojo : ${data.response}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Gojo:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec Gojo." }, pageAccessToken);
    }
  },
};