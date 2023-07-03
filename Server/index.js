const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors()); // Enable CORS for all routes

app.get('/data', async (req, res) => {
  try {
    const response = await axios.get('https://kworb.net/spotify/listeners.html');
    const $ = cheerio.load(response.data);

    const artists = [];
    const listeners = [];

    $('table tr').each((index, element) => {
      const artist = $(element).find('td:nth-child(1)').text();
      const listener = $(element).find('td:nth-child(2)').text();
      const id = 1;
      if (artist && listener) {
        artists.push(artist.trim());
        listeners.push(listener.trim());
      }
    });

    const jsonData = artists.slice(0, 500).map((artist, index) => {
      return { id: index + 1, artist, listener: listeners[index] };
    });

    const filePath = 'Data/artists.json';
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filePath, jsonString);

    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/data/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const response = await axios.get('https://kworb.net/spotify/listeners.html');
    const $ = cheerio.load(response.data);

    const artists = [];
    const listeners = [];

    $('table tr').each((index, element) => {
      const artist = $(element).find('td:nth-child(1)').text();
      const listener = $(element).find('td:nth-child(2)').text();
      const id = 1;
      if (artist && listener) {
        artists.push(artist.trim());
        listeners.push(listener.trim());
      }
    });

    if (id >= 1 && id <= artists.length) {
      const jsonData = { id: parseInt(id), artist: artists[id - 1], listener: listeners[id - 1] };
      res.status(200).json(jsonData);
    } else {
      res.status(404).send('Artist not found');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
  
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/data`));
