const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'rp',
  description: 'Joue un rôle dans un univers anime avec un scénario généré.',
  usage: 'rp [anime] [type]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length < 1) {
      await sendMessage(senderId, { 
        text: '❌ Veuillez spécifier un anime et éventuellement un type de RP !\n\n📌 Exemples :\n- `rp Naruto`\n- `rp Jujutsu Kaisen`\n- `rp Shadow Garden`\n- `rp Naruto combat`\n- `rp Jujutsu Kaisen romance`' 
      }, pageAccessToken);
      return;
    }

    const anime = args[0];
    const type = args.length > 1 ? args.slice(1).join(' ') : "aventure"; // Type de RP par défaut

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?ask=Imagine+un+roleplay+dans+l'univers+de+${encodeURIComponent(anime)}+avec+un+scénario+du+type+${encodeURIComponent(type)}&uid=${senderId}&webSearch=on`);

      const rpScenario = response.data.response;

      await sendMessage(senderId, { 
        text: `🎭 **Roleplay Anime - ${anime}** 🎭\n\n📜 **Scénario (${type}) :**\n${rpScenario}\n\n📝 Réponds pour continuer l'histoire !` 
      }, pageAccessToken);

    } catch (error) {
      console.error("Erreur RP :", error);
      await sendMessage(senderId, { text: '❌ Impossible de générer le RP. Réessaie plus tard !' }, pageAccessToken);
    }
  }
};
