const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'giz-flux1',
  description: "Génère une image avec Giz-Flux1",
  usage: 'giz-flux1 [prompt]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: giz-flux1 une voiture de sport rouge.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://kaiz-apis.gleeze.com/api/giz-flux1?prompt=${encodeURIComponent(prompt)}`;

    await sendMessage(senderId, { text: '♻️ Génération en cours...' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: { type: 'image', payload: { url: apiUrl } }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API Giz-Flux1:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};
