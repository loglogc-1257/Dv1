const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interagis avec GPT-4o pour poser des questions ou discuter.',
  usage: 'ai [message]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { 
        text: '❌ **Utilisation incorrecte !**\n\n📌 **Exemple :**\n`ai Quelle est la capitale du Japon ?`' 
      }, pageAccessToken);
      return;
    }

    const userMessage = args.join(' '); // Récupère le message complet de l'utilisateur
    const apiUrl = `https://haji-mix.up.railway.app/api/gpt4o?ask=${encodeURIComponent(userMessage)}&uid=${senderId}`;

    try {
      // Appel à l'API GPT-4o
      const response = await axios.get(apiUrl);
      const aiResponse = response.data.response; // Récupération de la réponse de l'API

      // Formater le message de réponse
      const formattedResponse = `🤖 **GPT-4o - Stanley AI** 🤖\n\n💬 **Toi :** ${userMessage}\n📜 **GPT-4o :** ${aiResponse}\n\n✍️ **Réponds pour continuer la conversation !**`;

      await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);

    } catch (error) {
      console.error("Erreur API GPT-4o :", error);
      await sendMessage(senderId, { text: '❌ Impossible de générer une réponse. Réessaie plus tard !' }, pageAccessToken);
    }
  }
};
