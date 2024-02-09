const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('resultText');

// Define the segments and colors for the spinning wheel
const segments = ['ELYTE HOODIE', '$0', '$50', '$75', 'Bonus Prize'];
const colors = ['#FFD700', '#ADFF2F', '#FF4500', '#1E90FF', '#FF69B4'];

// Variables to control the spinning
let currentAngle = 0;
const sliceAngle = (2 * Math.PI) / segments.length;

// Function to draw the spinning wheel
function drawWheel() {
    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, currentAngle, currentAngle + sliceAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();

        // Draw the text
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.fillText(segments[i], 130, 10);
        ctx.restore();

        currentAngle += sliceAngle;
    }
}

// Function to spin the wheel
function spinWheel() {
    let rotations = 0;
    const spinDuration = 8000; // milliseconds
    const spinInterval = 10; // milliseconds
    const spinIncrements = (2 * Math.PI) / (spinDuration / spinInterval); // Full rotation over the duration

    spinBtn.disabled = true; // Disable button during spin

    const spinAnimation = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();
        currentAngle += spinIncrements;
        rotations += spinIncrements;

        if (rotations >= (2 * Math.PI)) {
            rotations -= (2 * Math.PI);
        }

        if (currentAngle >= (2 * Math.PI)) {
            currentAngle -= (2 * Math.PI);
        }

        if (Date.now() - startTime >= spinDuration) {
            clearInterval(spinAnimation);
            spinBtn.disabled = false; // Re-enable button
            // Determine the prize and display the result
            const winningSegment = segments[Math.floor(segments.length - (currentAngle / (2 * Math.PI)) % segments.length)];
            resultText.textContent = `Congratulations! You won ${winningSegment}.`;
        }
    }, spinInterval);
    
    const startTime = Date.now(); // Record the time when spinning started
}

// Attach the spinWheel function to the click event of the spin button
spinBtn.addEventListener('click', spinWheel);

// Initial draw of the wheel
drawWheel();
