const speakButton = document.getElementById('speakButton');
const outputDiv = document.getElementById('output');

function speechToText() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        // Create new instance of SpeechRecognition
        var recognition = new webkitSpeechRecognition();

        // Set recognition parameters
        recognition.continuous = false; // Stop listening after one speech
        recognition.interimResults = false; // Do not return interim results

        // Start speech recognition
        recognition.start();

        // Event listener for when speech is recognized
        recognition.onresult = function(event) {
            // Get the recognized speech
            var transcription = event.results[0][0].transcript;
            
            // Display the recognized speech
            console.log('You said: ' + transcription);
        };

        // Event listener for error handling
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };
    } else {
        // If browser does not support speech recognition
        console.error('Speech recognition not supported in this browser');
    }
}
speakButton.addEventListener('click', () => {
    speechToText();
});