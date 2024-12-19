const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const result = document.getElementById("result");
const ctx = canvas.getContext("2d");

// Mapping objects to brands
const objectToBrand = {
    "bottle": "Brand: Coca-Cola or Pepsi",
    "cell phone": "Brand: Apple or Samsung",
    "laptop": "Brand: Dell or HP",
};

// Start video stream
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
    } catch (error) {
        alert("Camera access denied or unavailable!");
    }
}

// Load the COCO-SSD model and detect objects
async function detectObjects() {
    const model = await cocoSsd.load();
    setInterval(async () => {
        // Adjust canvas size based on video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const predictions = await model.detect(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "red";
            ctx.font = "16px Arial";
            ctx.fillText(prediction.class, x, y - 10);

            // Show result with brand
            if (objectToBrand[prediction.class]) {
                result.innerText = `${prediction.class} - ${objectToBrand[prediction.class]}`;
            } else {
                result.innerText = `Detected: ${prediction.class}`;
            }
        });
    }, 500);
}

// Start the application
(async function () {
    await startCamera();
    await detectObjects();
})();