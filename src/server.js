const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 9532;

const jokePrompt = `
  Tell me an original, medium-form, very funny joke about a software engineer understandable by non-technical audiences in a non-software context. 
  It should be as hilarious as possible. 
  Joke ONLY - No preamble, not preachy, not controversial.
  Use job titles / roles instead of names.`;

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
                messages: [{ role: 'user', content: jokePrompt }]
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