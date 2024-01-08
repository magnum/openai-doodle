require('dotenv').config()
const FormData = require("form-data");

const path = require('path');
const express = require('express');
const axios = require("axios"); 
const openai = require("openai");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;
var htmlPath = path.join(__dirname, 'html');
app.use(express.static(htmlPath));

// Replace with your OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;

app.post("/generateImage", async (req, res) => {
    const userSketch = req.body.sketch; // Get the user's sketch from the request
    // Use the OpenAI API to generate an image based on the sketch
    const generatedImage = await generateImage(userSketch);
    res.json({ image: generatedImage });
});


// Function to convert canvas drawing to PNG image
function canvasToPNG(canvas) {
    // Capture the canvas drawing as a data URL
    const dataURL = canvas.toDataURL("image/png");

    // Convert the data URL to a Blob
    const blob = dataURLtoBlob(dataURL);

    // Create a new URL for the Blob object
    const blobURL = URL.createObjectURL(blob);

    return blobURL;
}

// Function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}


async function generateImage(userSketch) {
    const textPrompt = "Create an image in the style of Picasso with the following sketch";

    try {
        const formData = new FormData();
        formData.append("prompt", textPrompt);
        formData.append("image", userSketch); // Assuming userSketch is a file or Blob object
        
        const config = {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await axios.post("https://api.openai.com/v1/images/edits", formData, config);

        const generatedImages = response.data.choices[0].images; // Extract the generated images
        // You may need to process the images depending on the response format
        return generatedImages[0].url; // Assuming the API returns an array of images and we want the first one
    } catch (error) {
        console.error("Error generating image:", error);
        debugger
        return null;
    }
}

const server = app.listen(port, function () {
    var host = 'localhost';
    var port = server.address().port;
    console.log('listening on http://'+host+':'+port+'/');
});



