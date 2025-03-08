const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const activeUsers = {};

module.exports = {
  name: 'senku',
  description: "Active ou désactive les réponses de Senku.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const command = args.join(" ").toLowerCase().trim();

    if (command === "senku on") {
      activeUsers[senderId] = true;
      return await sendMessage(senderId, { text: "🧪 Senku est maintenant activé ! Posez-moi vos questions." }, pageAccessToken);
    }

    if (command === "senku off") {
      delete activeUsers[senderId];
      return await sendMessage(senderId, { text: "🛑 Senku est maintenant désactivé." }, pageAccessToken);
    }

    if (!activeUsers[senderId]) return;

    const apiUrl = `https://kaiz-apis.gleeze.com/api/senku?ask=${encodeURIComponent(command)}&uid=${senderId}&lang=fr`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🔬 Senku : ${data.response}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Senku:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec Senku." }, pageAccessToken);
    }
  },
};