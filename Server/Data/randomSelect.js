const axios = require('axios');

let currentArtist;
let newArtist;

async function getRandomArtists() {
  try {
    const response = await axios.get('http://localhost:8080/data');
    const data = response.data;

    currentArtist = selectRandomArtist(data);
    newArtist = selectRandomArtistExcept(data, currentArtist);

    console.log('Higher or Lower:');
    console.log(`${currentArtist.artist}`);
    console.log(`${newArtist.artist}`);
    console.log('');
    console.log('');

    await takeGuess(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

function selectRandomArtist(data) {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

function selectRandomArtistExcept(data, exceptArtist) {
  let randomArtist;
  do {
    randomArtist = selectRandomArtist(data);
  } while (randomArtist === exceptArtist);
  return randomArtist;
}

async function takeGuess(data) {
  const answer = await getGuessFromUser();

  const currentListener = parseInt(currentArtist.listener.replace(/,/g, ''));
  const newListener = parseInt(newArtist.listener.replace(/,/g, ''));

  console.log(`You guessed: ${answer}`);
  console.log(`Listener count for ${currentArtist.artist}: ${currentArtist.listener}`);
  console.log(`Listener count for ${newArtist.artist}: ${newArtist.listener}`);
  console.log('');
  console.log('');

  if (
    (answer.toLowerCase() === 'higher' && newListener > currentListener) ||
    (answer.toLowerCase() === 'lower' && newListener < currentListener)
  ) {
    console.log('Congratulations! You guessed correctly!');
    console.log('');
    console.log('');

    currentArtist = newArtist;
    newArtist = selectRandomArtistExcept(data, currentArtist);

    console.log('Higher or Lower:');
    console.log(`${currentArtist.artist}`);
    console.log(`${newArtist.artist}`);
    console.log('');
    console.log('');

    await takeGuess(data);
  } else {
    console.log('Game over!');
    console.log('');
  }
}

function getGuessFromUser() {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter your guess (higher or lower): ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

getRandomArtists();

module.exports = getRandomArtists;