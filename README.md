# Software Engineering Joke Generator

This web application generates original software engineering jokes using the Claude API and converts them to audio using the ElevenLabs API.

## Features

- Generate original software engineering jokes
- Text-to-speech conversion of jokes
- Animated face during joke playback
- Feedback system for jokes

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/software-engineering-joke-generator.git
   cd software-engineering-joke-generator
   ```

2. Install dependencies:
   ```
   cd src
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `src` directory with the following content:
   ```
   ANTHROPIC_API_KEY_JOKES_APP=your_claude_api_key_here
   ELEVEN_LABS_KEY_JOKES_APP=your_elevenlabs_api_key_here
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open a web browser and navigate to `http://localhost:9532`

## Technologies Used

- Node.js
- Express.js
- Claude API (Anthropic)
- ElevenLabs API
- HTML5
- CSS3
- JavaScript

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)