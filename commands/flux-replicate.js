const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'flux-replicate',
  description: "Génère une image avec Flux Replicate",
  usage: 'flux-replicate [prompt]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: flux-replicate un château médiéval.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    const apiUrl = `https://kaiz-apis.gleeze.com/api/flux-replicate?prompt=${encodeURIComponent(prompt)}`;

    await sendMessage(senderId, { text: '♻️ Génération en cours...' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: { type: 'image', payload: { url: apiUrl } }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API Flux Replicate:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};
