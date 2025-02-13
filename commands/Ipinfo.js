const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'ipinfo',
  description: 'Obtenez des informations sur une adresse IP.',
  usage: 'ipinfo [adresse IP]',
  async execute(senderId, args) {
    if (!args.length) return sendMessage(senderId, { text: 'Usage: ipinfo [adresse IP]. Exemple: ipinfo 8.8.8.8' }, token);

    const ip = args[0];

    try {
      const { data } = await axios.get(`https://ipinfo.io/${ip}/json`);
      const message = `🌍 **Informations sur l’IP ${ip}**\n📍 **Ville :** ${data.city}\n🌎 **Pays :** ${data.country}\n🏢 **Fournisseur :** ${data.org}\n📌 **Région :** ${data.region}\n📡 **Localisation :** ${data.loc}`;

      await sendMessage(senderId, { text: message }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer les informations de cette IP.' }, token);
    }
  }
};
