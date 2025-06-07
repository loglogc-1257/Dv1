const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with Pollinations Text API (GET prompt in URL)',
  usage: 'gpt4 [votre message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, {
        text: "❓ Veuillez poser une question ou tapez 'help' pour voir les commandes."
      }, pageAccessToken);
    }

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://text.pollinations.ai/${encodedPrompt}`;

      const { data } = await axios.get(url, {
        responseType: 'text' // la réponse est du texte brut
      });

      const responseText = typeof data === 'string' ? data.trim() : 'Réponse vide.';

      // Découpe en morceaux de 1800 caractères (Messenger)
      const parts = [];
      for (let i = 0; i < responseText.length; i += 1800) {
        parts.push(responseText.substring(i, i + 1800));
      }

      for (const part of parts) {
        await sendMessage(senderId, { text: part }, pageAccessToken);
      }
    } catch (error) {
      console.error('Erreur avec Pollinations Text API :', error.message);
      sendMessage(senderId, {
        text: "🤖 Une erreur est survenue avec Pollinations AI.\nRéessayez plus tard ou posez une autre question."
      }, pageAccessToken);
    }
  }
};
