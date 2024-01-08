const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

const generateButton = document.getElementById("generateButton");
const generatedImage = document.getElementById("generatedImage");

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


generateButton.addEventListener("click", async () => {
    const sketchDataUrl = canvas.toDataURL(); // Convert canvas drawing to data URL
    const blob = dataURLtoBlob(sketchDataUrl); // Convert data URL to Blob
    const response = await fetch("/generateImage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sketch: sketchDataUrl }),
    });

    const data = await response.json();
    generatedImage.src = data.image;
    generatedImage.style.display = "block";
});