const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with You-AI',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, {
        text: "Veuillez poser votre question ou tapez 'help' pour voir les autres commandes disponibles."
      }, pageAccessToken);
    }

    try {
      const { data } = await axios.get(`https://kaiz-apis.gleeze.com/api/you-ai?ask=${encodeURIComponent(prompt)}&uid=${senderId}`);
      const response = data.response;

      const parts = [];
      for (let i = 0; i < response.length; i += 1800) {
        parts.push(response.substring(i, i + 1800));
      }

      for (const part of parts) {
        await sendMessage(senderId, { text: part }, pageAccessToken);
      }
    } catch {
      sendMessage(senderId, {
        text: "🤖 Oups ! Une petite erreur est survenue.\n\n" +
              "❓ Veuillez poser votre question ou tapez 'help' pour voir les autres commandes disponibles."
      }, pageAccessToken);
    }
  }
};
