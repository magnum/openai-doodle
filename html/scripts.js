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


generateButton.addEventListener("click", async () => {
    const imageDataUrl = canvas.toDataURL("image/png"); // Convert canvas drawing to data URL
    const response = await fetch("/generateImage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageDataUrl: imageDataUrl }),
    });
    const data = await response.json();
    console.log(data)
    //generatedImage.src = data.image;
    //generatedImage.style.display = "block";
});