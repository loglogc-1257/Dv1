const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'rp',
  description: 'Joue un rôle avec Naruto ou Gojo et interagis avec eux.',
  usage: 'rp [naruto/gojo] [message]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length < 2) {
      await sendMessage(senderId, { 
        text: '❌ **Utilisation incorrecte !**\n\n📌 Exemples :\n- `rp naruto Bonjour !`\n- `rp gojo Salut !`' 
      }, pageAccessToken);
      return;
    }

    const character = args[0].toLowerCase();
    const userMessage = args.slice(1).join(' '); // Récupère tout le message après le nom du personnage

    let apiUrl = "";
    
    // Vérifier quel personnage a été sélectionné
    if (character === "naruto") {
      apiUrl = `https://kaiz-apis.gleeze.com/api/naruto?ask=${encodeURIComponent(userMessage)}&uid=${senderId}`;
    } else if (character === "gojo") {
      apiUrl = `https://kaiz-apis.gleeze.com/api/gojo?ask=${encodeURIComponent(userMessage)}&uid=${senderId}`;
    } else {
      await sendMessage(senderId, { 
        text: '❌ **Personnage inconnu !**\nTu peux choisir entre : `naruto` ou `gojo`' 
      }, pageAccessToken);
      return;
    }

    try {
      const response = await axios.get(apiUrl);
      const rpResponse = response.data.response; // Récupération de la réponse de l'API

      await sendMessage(senderId, { 
        text: `🎭 **${character.toUpperCase()} - Roleplay** 🎭\n\n🗨️ **Toi :** ${userMessage}\n📜 **${character} :** ${rpResponse}\n\n🔹 Réponds pour continuer l’histoire !` 
      }, pageAccessToken);

    } catch (error) {
      console.error("Erreur RP :", error);
      await sendMessage(senderId, { text: '❌ Impossible de générer le RP. Réessaie plus tard !' }, pageAccessToken);
    }
  }
};
