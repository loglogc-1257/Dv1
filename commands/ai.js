const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interagis avec GPT-4o',
  usage: 'ai [votre question]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, { 
        text: "❌ **Utilisation Incorrecte**\n\n📌 **Exemple :** `ai Quel est le sens de la vie ?`" 
      }, pageAccessToken);
    }

    try {
      // Indiquer que l'IA réfléchit
      await sendMessage(senderId, { 
        text: "🤖 **Stanley** est en train de réfléchir...\n⌛ **Patiente quelques instants...**" 
      }, pageAccessToken);

      // URL de l'API GPT-4o
      const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(prompt)}&uid=${senderId}&webSearch=on`;

      // Appel de l'API
      const { data } = await axios.get(apiUrl);

      // Vérification de la réponse
      if (!data || !data.response) {
        throw new Error("Réponse invalide reçue depuis l'API");
      }

      // Formatage de la réponse
      const formattedResponse = `🤖 **Stanley**\n\n💬 **Question :**\n❝ _${prompt}_ ❞\n\n💡 **Réponse :**\n${data.response}\n\n✨ _Propulsé par GPT-4o_`;

      // Envoi de la réponse à l'utilisateur
      await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);

    } catch (error) {
      console.error("Erreur API GPT-4o :", error.message || error);
      await sendMessage(senderId, { 
        text: "❌ **Une erreur est survenue !**\n\n📌 Vérifie ta connexion Internet et réessaie plus tard.\n💡 *Si le problème persiste, contacte le support.*" 
      }, pageAccessToken);
    }
  }
};
