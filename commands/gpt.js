const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const chatHistory = {}; // Stocke l'historique des conversations par utilisateur

module.exports = {
  name: 'gpt',
  description: 'Posez vos questions à GPT-4o.',
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(" ").trim();

    if (!query) {
      return sendMessage(senderId, {
        text: "🤖 GPT-4o est prêt à répondre à toutes vos questions ! Posez-moi n'importe quoi et je vous répondrai immédiatement. 🚀"
      }, pageAccessToken);
    }

    // Envoyer la question à l'API GPT-4o
    handleGPTResponse(senderId, query, pageAccessToken);
  },
};

const handleGPTResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o";

  if (!chatHistory[senderId]) {
    chatHistory[senderId] = [
      { role: "system", content: "Tu es un assistant utile et intelligent." }
    ];
  }

  // Ajouter la question de l'utilisateur à l'historique
  chatHistory[senderId].push({ role: "user", content: input });

  try {
    const { data } = await axios.get(apiUrl, { 
      params: { ask: input, uid: senderId, webSearch: "off" } 
    });

    const response = data.response;

    // Ajouter la réponse de l'IA à l'historique
    chatHistory[senderId].push({ role: "assistant", content: response });

    sendLongMessage(senderId, response, pageAccessToken);
  } catch (error) {
    console.error('Erreur GPT-4o:', error.message);
    sendMessage(senderId, { text: "⚠️ Une erreur est survenue, veuillez réessayer plus tard." }, pageAccessToken);
  }
};

// Fonction pour envoyer les messages longs sans limite de mots
const sendLongMessage = async (senderId, message, pageAccessToken) => {
  sendMessage(senderId, { text: message }, pageAccessToken);
};
