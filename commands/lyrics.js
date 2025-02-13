const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'lyrics',
  description: 'Obtenez les paroles d’une chanson.',
  usage: 'lyrics [artiste] [titre]',
  async execute(senderId, args) {
    if (args.length < 2) {
      return sendMessage(senderId, { text: 'Usage: lyrics [artiste] [titre]. Exemple: lyrics Eminem Lose Yourself' }, token);
    }

    const artist = args[0];
    const title = args.slice(1).join(' ');

    try {
      const { data } = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);

      if (!data.lyrics) {
        return sendMessage(senderId, { text: '❌ Paroles introuvables.' }, token);
      }

      const lyrics = data.lyrics.length > 500 ? data.lyrics.substring(0, 500) + '...' : data.lyrics;
      await sendMessage(senderId, { text: `🎶 **${title} - ${artist}**\n\n${lyrics}` }, token);

    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Erreur API Lyrics.ovh.' }, token);
    }
  }
};
