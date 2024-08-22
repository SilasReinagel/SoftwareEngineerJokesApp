document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateJoke');
    const jokeContainer = document.getElementById('jokeContainer');
    const generatingSpinner = document.getElementById('generatingSpinner');
    const countdownElement = document.getElementById('countdown');
    const progressFill = document.getElementById('progressFill');
    const face = document.querySelector('.face');
    const jokeText = document.getElementById('jokeText');
    const jokeAudio = document.getElementById('jokeAudio');
    const jokeControls = document.getElementById('jokeControls');
    const copyJokeButton = document.getElementById('copyJoke');
    const replayJokeButton = document.getElementById('replayJoke');
    const thumbsUpButton = document.getElementById('thumbsUp');
    const thumbsDownButton = document.getElementById('thumbsDown');

    let countdownInterval;
    let currentJoke = '';
    let isGenerating = false;

    generateButton.addEventListener('click', generateJoke);
    copyJokeButton.addEventListener('click', copyJokeToClipboard);
    replayJokeButton.addEventListener('click', replayJoke);
    thumbsUpButton.addEventListener('click', () => provideFeedback('up'));
    thumbsDownButton.addEventListener('click', () => provideFeedback('down'));

    // Enable the generate button initially
    generateButton.disabled = false;

    function generateJoke() {
        if (isGenerating) return;
        
        isGenerating = true;
        generateButton.disabled = true;
        resetUI();
        startCountdownAndProgressBar();

        fetch('/generate-joke')
            .then(response => response.json())
            .then(data => {
                currentJoke = data.joke;
                jokeAudio.src = data.audioUrl;
                playJoke();
            })
            .catch(error => {
                console.error('Error:', error);
                jokeText.textContent = 'Error generating joke. Please try again.';
                jokeText.style.display = 'block';
                generateButton.disabled = false;
                isGenerating = false;
            });
    }

    function resetUI() {
        jokeContainer.style.display = 'block';
        generatingSpinner.style.display = 'block';
        face.style.display = 'none';
        jokeText.style.display = 'none';
        jokeControls.style.display = 'none';
        progressFill.style.width = '0%';
    }

    function startCountdownAndProgressBar() {
        let timeLeft = 15;
        let progress = 0;
        const totalTime = 35; // 35 seconds total
        const interval = 100; // Update every 100ms

        countdownElement.textContent = timeLeft;

        countdownInterval = setInterval(() => {
            progress += (interval / 1000) / totalTime * 100;
            progressFill.style.width = `${Math.min(progress, 100)}%`;

            if (Math.floor(progress / (100 / 15)) > 15 - timeLeft) {
                timeLeft--;
                countdownElement.textContent = Math.max(timeLeft, 0);
            }

            if (progress >= 100) {
                clearInterval(countdownInterval);
                countdownElement.textContent = "0";
            }
        }, interval);
    }

    function playJoke() {
        clearInterval(countdownInterval);
        progressFill.style.width = '100%';
        countdownElement.textContent = "0";

        generatingSpinner.style.display = 'none';
        face.style.display = 'block';
        jokeAudio.play();
        jokeAudio.onended = showJokeText;
    }

    function showJokeText() {
        face.style.display = 'none';
        jokeText.textContent = currentJoke;
        jokeText.style.display = 'block';
        jokeControls.style.display = 'block';
        generateButton.disabled = false;
        isGenerating = false;
    }

    function copyJokeToClipboard() {
        navigator.clipboard.writeText(currentJoke)
            .then(() => alert('Joke copied to clipboard!'))
            .catch(err => console.error('Failed to copy joke: ', err));
    }

    function replayJoke() {
        jokeText.style.display = 'none';
        playJoke();
    }

    function provideFeedback(type) {
        console.log(`User rated the joke: ${type}`);
        alert(`Thank you for your feedback!`);
    }
});