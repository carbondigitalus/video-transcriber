// Core Modules
const fs = require('fs');
// NPM Modules
const { Deepgram } = require('@deepgram/sdk');

// Use DotEnv Files
require('dotenv').config();

// Location of the file you want to transcribe. Should include filename and extension.
// Example of a local file: ../../Audio/life-moves-pretty-fast.wav
// Example of a remote file: https://static.deepgram.com/examples/interview_speech-analytics.wav
const file = '../video/video.mp4';

// Mimetype for the file you want to transcribe
// Only necessary if transcribing a local file
// Example: audio/wav
const mimetype = 'video/mp4';

// Initialize the Deepgram SDK
const deepgram = new Deepgram(process.env.API_KEY);

// Check whether requested file is local or remote, and prepare accordingly
if (file.startsWith('http')) {
  // File is remote
  // Set the source
  source = {
    url: file
  };
} else {
  // File is local
  // Open the audio file
  const audio = fs.readFileSync(`${__dirname}/${file}`);

  // Set the source
  source = {
    buffer: audio,
    mimetype: mimetype
  };
}

// Send the audio to Deepgram and get the response
deepgram.transcription
  .preRecorded(source, {
    punctuate: true,
    model: 'nova'
  })
  .then((response) => {
    // Write the response to the console
    // console.dir(response, { depth: null });

    // Write only the transcript to the console
    const transcript = response.results.channels[0].alternatives[0].transcript;
    console.dir(transcript, { depth: null });

    fs.writeFileSync(`src/transcript.txt`, transcript, () => `File Saved!`);
  })
  .catch((err) => {
    console.log(err);
  });
