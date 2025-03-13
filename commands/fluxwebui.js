const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'fluxwebui',
  description: "Génère une image avec Flux WebUI",
  usage: 'fluxwebui [prompt] [ratio]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length < 2) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description et un ratio.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: fluxwebui un paysage futuriste 16:9'
      }, pageAccessToken);
      return;
    }

    const prompt = args.slice(0, -1).join(" ");
    const ratio = args[args.length - 1];
    const apiUrl = `https://kaiz-apis.gleeze.com/api/fluxwebui?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`;

    await sendMessage(senderId, { text: '♻️ Génération en cours...' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: { type: 'image', payload: { url: apiUrl } }
      }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API Flux WebUI:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la génération de l’image." }, pageAccessToken);
    }
  }
};
