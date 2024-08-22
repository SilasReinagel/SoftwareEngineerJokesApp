const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 9532;

const everydayContexts = [
    "ordering lunch at a restaurant",
    "going for a bike ride",
    "driving on the freeway",
    "when car breaks down",
    "going to a polling place",
    "listening to a sermon at church",
    "grocery shopping",
    "waiting in line at the post office",
    "attending a parent-teacher conference",
    "getting a haircut",
    "walking the dog",
    "doing laundry at a laundromat",
    "visiting a dentist",
    "watching a movie at a cinema",
    "attending a wedding",
    "gardening in the backyard",
    "taking public transportation",
    "going to the gym",
    "buying clothes at a mall",
    "having a picnic in the park",
    "attending a job interview",
    "cooking dinner at home",
    "visiting a museum",
    "going to a concert",
    "taking a taxi",
    "attending a sports event",
    "going camping",
    "visiting the doctor for a check-up",
    "getting a coffee at a cafe",
    "attending a yoga class",
    "going to the beach",
    "visiting a library",
    "attending a birthday party",
    "going to a farmers market",
    "taking a driving test",
    "visiting an amusement park",
    "attending a funeral",
    "going to a bar",
    "visiting a zoo",
    "attending a book club meeting",
    "going fishing",
    "visiting an art gallery",
    "attending a cooking class",
    "going to a spa",
    "visiting a national park",
    "attending a town hall meeting",
    "going bowling",
    "visiting a car dealership",
    "attending a music festival",
    "going ice skating",
    "visiting a retirement home",
    "attending a school play",
    "going to a flea market",
    "visiting a fortune teller",
    "attending a wine tasting",
    "going to a pet store",
    "visiting a tailor",
    "attending a stand-up comedy show",
    "going to a hardware store",
    "visiting a travel agency",
    "attending a pottery class",
    "going to a theme park",
    "visiting a psychologist",
    "attending a charity event",
    "going to a flower shop",
    "visiting a tattoo parlor",
    "attending a dance class",
    "going to an aquarium",
    "visiting a car wash",
    "attending a neighborhood block party",
    "going to a bookstore",
    "visiting a pawn shop",
    "attending a karaoke night",
    "going to a furniture store",
    "visiting a dry cleaner",
    "attending a garage sale",
    "going to a photo booth",
    "visiting a shoe repair shop",
    "attending a speed dating event",
    "going to an escape room",
    "visiting a notary public",
    "attending a food truck festival",
    "going to a planetarium",
    "visiting a chiropractor",
    "attending a knitting circle",
    "going to a video game arcade",
    "visiting a tax accountant",
    "attending a pottery painting studio",
    "going to a botanical garden",
    "visiting a fortune cookie factory",
    "attending a silent disco",
    "going to a trampoline park",
    "visiting a clock repair shop",
    "attending a cat cafe",
    "going to a rock climbing gym",
    "visiting a stamp collector's convention",
    "attending a hot air balloon festival",
    "going to a drive-in movie theater",
    "visiting a beekeeping farm",
    "attending a Renaissance fair"
];


const jokePrompt = `
  Tell me an original, short, very funny joke about a software engineer understandable by non-technical audiences in a non-software context. 
  It should be as hilarious as possible. 
  Joke ONLY - No preamble, not preachy.
  Use job titles / roles instead of names.
  For any acronyms, add a period between each letter.
  
  Scenario: [Scenario]`;

// Check for required API keys
if (!process.env.ANTHROPIC_API_KEY_JOKES_APP) {
    console.error('Error: Missing ANTHROPIC_API_KEY_JOKES_APP in system environment variables');
    process.exit(1);
}

if (!process.env.ELEVEN_LABS_KEY_JOKES_APP) {
    console.error('Error: Missing ELEVEN_LABS_KEY_JOKES_APP in system environment variables');
    process.exit(1);
}

app.use(express.static('public'));

app.get('/generate-joke', async (req, res) => {
    try {
        console.log('Starting joke generation process');

        console.log('Generating joke using Claude API');
        const jokeResponse = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 600,
                messages: [{ role: 'user', content: jokePrompt.replace('[Scenario]', everydayContexts[Math.floor(Math.random() * everydayContexts.length)]) }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY_JOKES_APP,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        const joke = jokeResponse.data.content[0].text;
        console.log('Joke generated successfully');

        console.log('Generating audio using ElevenLabs API');
        const audioResponse = await axios.post(
            'https://api.elevenlabs.io/v1/text-to-speech/Rn9Yq7uum9irZ6RwppDN',
            { text: joke },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVEN_LABS_KEY_JOKES_APP
                },
                responseType: 'arraybuffer'
            }
        );

        console.log('Audio generated successfully');

        const audioBase64 = Buffer.from(audioResponse.data, 'binary').toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        console.log('Joke generation process completed');
        res.json({ joke, audioUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating the joke.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});