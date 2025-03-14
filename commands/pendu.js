const { sendMessage } = require('../handles/sendMessage');

const mots = ['chat', 'maison', 'ordinateur', 'voiture', 'soleil'];
let jeuPendu = {};

module.exports = {
  name: 'pendu',
  description: 'Joue au jeu du pendu.',
  usage: 'pendu [lettre]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!jeuPendu[senderId]) {
      const mot = mots[Math.floor(Math.random() * mots.length)];
      jeuPendu[senderId] = { mot, trouvé: '_'.repeat(mot.length), essais: 6 };
      await sendMessage(senderId, { text: `🎮 Jeu du Pendu !\nMot : ${jeuPendu[senderId].trouvé}\nEssais restants : 6\nDevine une lettre.` }, pageAccessToken);
      return;
    }

    if (!args || args.length !== 1 || args[0].length !== 1) {
      await sendMessage(senderId, { text: '❌ Veuillez entrer une seule lettre.' }, pageAccessToken);
      return;
    }

    const lettre = args[0].toLowerCase();
    let { mot, trouvé, essais } = jeuPendu[senderId];

    if (mot.includes(lettre)) {
      let nouveauMot = '';
      for (let i = 0; i < mot.length; i++) {
        nouveauMot += mot[i] === lettre ? lettre : trouvé[i];
      }
      jeuPendu[senderId].trouvé = nouveauMot;

      if (!nouveauMot.includes('_')) {
        delete jeuPendu[senderId];
        await sendMessage(senderId, { text: `🎉 Bravo ! Tu as trouvé le mot : ${mot}` }, pageAccessToken);
        return;
      }
    } else {
      jeuPendu[senderId].essais--;
      if (jeuPendu[senderId].essais === 0) {
        delete jeuPendu[senderId];
        await sendMessage(senderId, { text: `☠️ Perdu ! Le mot était : ${mot}` }, pageAccessToken);
        return;
      }
    }

    await sendMessage(senderId, { text: `Mot : ${jeuPendu[senderId].trouvé}\nEssais restants : ${jeuPendu[senderId].essais}` }, pageAccessToken);
  }
};
