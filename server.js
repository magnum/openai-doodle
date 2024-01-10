require('dotenv').config()

const FormData = require("form-data");
const { Blob } = require('buffer');
const { dataUriToBuffer } = require('data-uri-to-buffer');
const { Image } = require("canvas");

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
    const imageDataUrl = req.body.imageDataUrl; 
    const imageDescribed = await describeImage(imageDataUrl);
    res.json({ imageDescription: imageDescribed });
});


// Function to convert data URL to Blob
function dataUriToBlob(dataUri) {
    try {
        const buffer = dataUriToBuffer(dataUri);
        const blob = new Blob([buffer]);
        return blob;
    } catch (error) {
        console.error("Error converting Data URI to Blob:", error);
        return null;
    }
}


async function describeImage(imageDataUrl) {
  try {
    const formData = new FormData();
    //const image = dataUriToBlob(imageDataUrl);
    let image = new Image();
    await new Promise(r => image.onload=r, image.src=imageDataUrl);
    formData.append("file", image, { filename: "image.png" });

    const response = await axios.post('https://api.openai.com/v1/image-analysis', formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
    });

    if (response.data && response.data.description) {
        console.log(response.data);
        return response.data.description;
    } else {
        throw new Error('No description found in the response.');
    }
  } catch (error) {
    console.error('Error describing image:', error);
    throw error;
  }
}


async function generateImage(imageDataUrl) {
    const prompt = "Create an image in the style of Picasso with the following sketch";
    const image = dataUriToBlob(imageDataUrl);
    try {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("image", image);
        
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



