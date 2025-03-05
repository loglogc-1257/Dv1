const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const userData = {}; // Stocke les infos des utilisateurs (temps, XP, rang)
const INACTIVITY_TIME = 10 * 60 * 1000; // 10 minutes en millisecondes
const RANK_UP_XP = 5000; // XP nécessaire pour monter de rang

module.exports = {
  name: 'rank',
  description: 'Affiche le rang de l\'utilisateur et évolue avec l\'utilisation.',
  author: 'Stanley Stawa',

  async execute(senderId) {
    const pageAccessToken = token;
    const currentTime = Date.now();

    // Vérifier si l'utilisateur est déjà enregistré
    if (!userData[senderId]) {
      userData[senderId] = {
        firstInteraction: currentTime,
        lastInteraction: currentTime,
        xp: 0,
        rank: 1
      };
    } else {
      // Augmenter l'XP et le rang si nécessaire
      userData[senderId].xp += Math.floor(Math.random() * 1000) + 500; // Gain aléatoire entre 500 et 1500 XP
      if (userData[senderId].xp >= RANK_UP_XP) {
        userData[senderId].xp = 0;
        userData[senderId].rank++;
      }
      userData[senderId].lastInteraction = currentTime;
    }

    // Récupérer le pseudo de l'utilisateur via l'API Graph de Facebook
    let nickname = "Utilisateur";
    try {
      const userResponse = await axios.get(`https://graph.facebook.com/${senderId}?fields=first_name,last_name&access_token=${pageAccessToken}`);
      nickname = `${userResponse.data.first_name} ${userResponse.data.last_name}`;
    } catch (error) {
      console.error("Erreur lors de la récupération du pseudo :", error.message);
    }

    // Générer l'image de rang avec les données mises à jour
    const apiUrl = "https://kaiz-apis.gleeze.com/api/rank";
    const params = {
      level: userData[senderId].rank * 10, // Exemple : chaque rang ajoute 10 niveaux
      rank: userData[senderId].rank,
      xp: userData[senderId].xp,
      requiredXP: RANK_UP_XP,
      nickname: nickname,
      status: "online",
      avatar: "https://i.imgur.com/P36dq5j.jpeg"
    };

    try {
      const { data } = await axios.get(apiUrl, { params });

      if (data.image) {
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: {
              url: data.image,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: "⚠️ Impossible de générer le rang pour le moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Erreur Rank:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur est survenue. Veuillez réessayer plus tard." }, pageAccessToken);
    }

    // Lancer le timer pour envoyer automatiquement le rang après 10 minutes d'inactivité
    if (userData[senderId].inactivityTimer) {
      clearTimeout(userData[senderId].inactivityTimer);
    }

    userData[senderId].inactivityTimer = setTimeout(async () => {
      if (Date.now() - userData[senderId].lastInteraction >= INACTIVITY_TIME) {
        try {
          const { data } = await axios.get(apiUrl, { params });
          if (data.image) {
            await sendMessage(senderId, {
              attachment: {
                type: "image",
                payload: {
                  url: data.image,
                  is_reusable: true
                }
              }
            }, pageAccessToken);
          } else {
            await sendMessage(senderId, { text: "⚠️ Impossible de générer le rang automatiquement." }, pageAccessToken);
          }
        } catch (error) {
          console.error('Erreur envoi auto Rank:', error.message);
        }
      }
    }, INACTIVITY_TIME);
  }
};
