const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'password',
  description: 'Génère un mot de passe sécurisé.',
  async execute(senderId) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const length = Math.floor(Math.random() * (16 - 12 + 1)) + 12;
    let password = '';

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    await sendMessage(senderId, { text: `🔐 **Mot de passe généré :** ${password}` }, token);
  }
};
