const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interagis avec GPT-4o pour obtenir des réponses intelligentes et précises.',
  usage: 'ai [votre question] (--no-web)',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    // Extraire la question et les options
    const hasWebSearch = !args.includes('--no-web'); // Recherche web activée par défaut, sauf si --no-web est présent
    const prompt = args.filter(arg => arg !== '--no-web').join(' ');

    // Vérifier si la question est vide
    if (!prompt) {
      return sendMessage(senderId, { 
        text: "❌ **Utilisation Incorrecte**\n\n📌 **Exemple :** `ai Quel est le sens de la vie ?`\n💡 **Option :** Ajoute `--no-web` pour désactiver la recherche web."
      }, pageAccessToken);
    }

    try {
      // URL de l'API GPT-4o
      const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o`;
      const payload = {
        ask: prompt,
        uid: senderId,
        webSearch: hasWebSearch ? 'on' : 'off' // Recherche web activée par défaut
      };

      // Appel de l'API avec POST
      const { data } = await axios.post(apiUrl, payload, {
        timeout: 10000 // Timeout de 10 secondes pour éviter les attentes infinies
      });

      // Vérification de la réponse
      if (!data || !data.response) {
        throw new Error("Réponse invalide reçue depuis l'API");
      }

      // Envoyer la réponse brute à l'utilisateur
      await sendMessage(senderId, { text: data.response }, pageAccessToken);

    } catch (error) {
      console.error("Erreur API GPT-4o :", error.message || error);

      // Gestion des erreurs spécifiques
      let errorMessage = "❌ **Une erreur est survenue !**\n\n📌 Vérifie ta connexion Internet et réessaie plus tard.";
      if (error.response) {
        if (error.response.status === 429) {
          errorMessage = "❌ **Trop de requêtes !**\n\n📌 Tu as dépassé la limite de requêtes. Réessaie dans quelques minutes.";
        } else if (error.response.status >= 500) {
          errorMessage = "❌ **Problème serveur !**\n\n📌 L'API est temporairement indisponible. Réessaie plus tard.";
        }
      }

      await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
    }
  }
};
