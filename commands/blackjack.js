const { sendMessage } = require('../handles/sendMessage');

function tirerCarte() {
  return Math.floor(Math.random() * 11) + 1; // Cartes de 1 à 11 points
}

module.exports = {
  name: 'blackjack',
  description: 'Joue une partie de Blackjack.',
  usage: 'blackjack',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    const joueur = [tirerCarte(), tirerCarte()];
    const bot = [tirerCarte(), tirerCarte()];
    
    const totalJoueur = joueur.reduce((a, b) => a + b, 0);
    const totalBot = bot.reduce((a, b) => a + b, 0);

    let resultat = '';

    if (totalJoueur > 21) {
      resultat = '😢 Tu dépasses 21, tu perds !';
    } else if (totalBot > 21 || totalJoueur > totalBot) {
      resultat = '🎉 Tu gagnes !';
    } else if (totalJoueur === totalBot) {
      resultat = '🤝 Égalité !';
    } else {
      resultat = '😢 Tu perds !';
    }

    await sendMessage(senderId, {
      text: `🃏 Cartes : ${joueur.join(', ')} (Total: ${totalJoueur})\n🤖 Bot : ${bot.join(', ')} (Total: ${totalBot})\n\n${resultat}`
    }, pageAccessToken);
  }
};

