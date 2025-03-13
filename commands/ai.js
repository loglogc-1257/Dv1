const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const chatHistory = {}; // Stocke l'historique des conversations par utilisateur

module.exports = {
  name: 'ai',
  description: 'Interagissez avec Orochi AI.',
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(" ").trim();

    if (!query) {
      return sendMessage(senderId, {
        text: "✨ Bonjour et bienvenue ! Posez-moi vos questions 🤖\n\nVotre satisfaction est ma priorité ! 🚀\n\n_(Édité par Stanley Stawa)_"
      }, pageAccessToken);
    }

    // Toutes les questions passent par l'API
    handleChatResponse(senderId, query, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o";

  if (!chatHistory[senderId]) chatHistory[senderId] = [];

  chatHistory[senderId].push({ role: "user", message: input });

  try {
    const { data } = await axios.get(apiUrl, { 
      params: { ask: input, uid: senderId, webSearch: "off" } 
    });

    const response = data.response;

    chatHistory[senderId].push({ role: "ai", message: response });

    sendLongMessage(senderId, response, pageAccessToken);
  } catch (error) {
    console.error('Erreur AI:', error.message);
    sendMessage(senderId, { text: "⚠️ Une erreur est survenue, veuillez réessayer plus tard." }, pageAccessToken);
  }
};

// Fonction pour gérer les messages longs sans pause
const sendLongMessage = async (senderId, message, pageAccessToken) => {
  const maxLength = 9000;
  let parts = [];

  for (let i = 0; i < message.length; i += maxLength) {
    parts.push(message.substring(i, i + maxLength));
  }

  for (const part of parts) {
    sendMessage(senderId, { text: part }, pageAccessToken);
  }
};
