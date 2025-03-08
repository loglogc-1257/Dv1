const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'tempmail',
  description: "Génère un email temporaire.",
  author: 'Arn & coffee',

  async execute(senderId) {
    const pageAccessToken = token;
    const apiUrl = "https://kaiz-apis.gleeze.com/api/tempmail-create";

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `📧 Email temporaire : ${data.email}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API TempMail:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec TempMail." }, pageAccessToken);
    }
  },
};