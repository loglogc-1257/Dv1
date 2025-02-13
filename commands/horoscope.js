const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'horoscope',
  description: 'Obtenez votre horoscope du jour.',
  usage: 'horoscope [signe]',
  async execute(senderId, args) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Usage: horoscope [signe]. Exemple: horoscope balance' }, token);
    }

    const sign = args[0].toLowerCase();

    try {
      const { data } = await axios.get(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, { method: 'POST' });

      await sendMessage(senderId, {
        text: `🔮 **Horoscope ${sign}**\n💫 **Date:** ${data.current_date}\n❤️ **Amour:** ${data.description}`
      }, token);

    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Horoscope introuvable.' }, token);
    }
  }
};
