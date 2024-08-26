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
  Tell me 4 original, short, very funny jokes about a software engineer understandable by non-technical audiences in a non-software context. 
  Each joke should be as hilarious as possible. 
  Jokes ONLY - No preamble, not preachy.
  Use job titles / roles instead of names.
  For any acronyms, add a period between each letter.
  Keep technical terms to a minimum.
  Separate each joke with '---'.
  
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

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY_JOKES_APP,
            'anthropic-version': '2023-06-01'
        };

        const jokeScenarioPrompt = jokePrompt.replace('[Scenario]', everydayContexts[Math.floor(Math.random() * everydayContexts.length)])

        console.log('Generating jokes using Claude API');
        const jokeResponse = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 2048,
                messages: [{ role: 'user', content: jokeScenarioPrompt }]
            },
            { headers }
        );

        const jokesFirstDraft = jokeResponse.data.content[0].text;
        console.log('Jokes generated successfully');

        // Ask Claude to critique its own jokes
        console.log('Requesting joke critiques from Claude');
        const critiqueResponse = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 2048,
                messages: [
                    { role: 'user', content: jokeScenarioPrompt },
                    { role: 'assistant', content: jokesFirstDraft },
                    { role: 'user', content: "Critique these jokes. For each joke, briefly assess if it's funny, original, and meets all the criteria specified in the prompt. Provide a quick rating out of 10 for humor. Identify which joke is the funniest." }
                ]
            },
            { headers }
        );

        const critique = critiqueResponse.data.content[0].text;
        console.log('Joke critiques received:', critique);

        // Generate final draft based on jokes and critique
        console.log('Generating final draft based on jokes and critique');
        const finalDraftResponse = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 2048,
                messages: [
                    { role: 'user', content: jokeScenarioPrompt },
                    { role: 'assistant', content: jokesFirstDraft },
                    { role: 'user', content: "Critique these jokes. For each joke, briefly assess if it's funny, original, and meets all the criteria specified in the prompt. Provide a quick rating out of 10 for humor. Identify which joke is the funniest." },
                    { role: 'assistant', content: critique },
                    { role: 'user', content: "Based on your critique, please revise and improve the joke you identified as the funniest. Make sure it's even funnier, original, and meets all the criteria from the original prompt. Provide only the revised joke, without any explanations." }
                ]
            },
            { headers }
        );

        const finalJoke = finalDraftResponse.data.content[0].text;
        console.log('Final joke draft generated successfully');

        console.log('Generating audio using ElevenLabs API');
        const audioResponse = await axios.post(
            'https://api.elevenlabs.io/v1/text-to-speech/Rn9Yq7uum9irZ6RwppDN',
            { text: finalJoke },
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
        res.json({ joke: finalJoke, audioUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating the joke.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
