const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const chatHistory = {}; // Stocke l'historique des conversations par utilisateur

module.exports = {
  name: 'ai',
  description: 'Interagissez avec Orochi AI propulsé par GPT-4o.',
  author: 'Stanley Stawa',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(" ").trim();

    if (!query) {
      const defaultMessage = 
        "✨ **Bienvenue !**\n" +
        "Pose-moi tes questions et je ferai de mon mieux pour y répondre 🤖\n\n" +
        "🔹 Exemples :\n" +
        "• `ai Qui est Gojo Satoru ?`\n" +
        "• `ai Raconte-moi une blague !`\n" +
        "• `ai Quel est le sens de la vie ?`\n\n" +
        "_Édité par Stanley Stawa_";

      return await sendMessage(senderId, { text: defaultMessage }, pageAccessToken);
    }

    if (["sino creator mo?", "qui t'a créé ?"].includes(query.toLowerCase())) {
      return await sendMessage(senderId, { text: "Je suis créé par Stanley Stawa !" }, pageAccessToken);
    }

    await handleChatResponse(senderId, query, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://haji-mix.up.railway.app/api/gpt4o";

  // Initialiser l'historique si l'utilisateur est nouveau
  if (!chatHistory[senderId]) {
    chatHistory[senderId] = [];
  }

  // Ajouter la question à l'historique
  chatHistory[senderId].push({ role: "user", message: input });

  try {
    // Envoyer la requête à l'API GPT-4o
    const { data } = await axios.get(apiUrl, { 
      params: { 
        ask: input, 
        uid: senderId 
      } 
    });

    const response = data.response;

    // Ajouter la réponse de l'IA à l'historique
    chatHistory[senderId].push({ role: "ai", message: response });

    await sendLongMessage(senderId, response, pageAccessToken);
  } catch (error) {
    console.error('❌ Erreur API GPT-4o:', error.message);
    await sendMessage(senderId, { text: "⚠️ **Erreur !** Veuillez réessayer plus tard." }, pageAccessToken);
  }
};

// Fonction pour gérer les messages longs
const sendLongMessage = async (senderId, message, pageAccessToken) => {
  const maxLength = 9000; // Longueur maximale par message
  let parts = [];

  for (let i = 0; i < message.length; i += maxLength) {
    parts.push(message.substring(i, i + maxLength));
  }

  for (let i = 0; i < parts.length; i++) {
    await sendMessage(senderId, { text: parts[i] }, pageAccessToken);
    await new Promise(resolve => setTimeout(resolve, 500)); // Pause de 500ms entre chaque envoi
  }
};
