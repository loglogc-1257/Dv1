const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'gojo',
  description: 'Discutez avec Gojo Satoru, le plus fort !',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://kaiz-apis.gleeze.com/api/gojo');
      const gojoMessage = data.reply || "Je suis Gojo Satoru, le plus fort !";

      await sendMessage(senderId, { text: `💙 **Gojo dit :**\n${gojoMessage}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Gojo est occupé en ce moment !' }, token);
    }
  }
};
