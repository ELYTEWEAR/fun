const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('resultText');

const segments = ['ELYTE HOODIE', '$0', '$50', '$75', 'Free Stickers'];
const colors = ['#FFD700', '#ADFF2F', '#FF4500', '#1E90FF', '#FF69B4'];
let currentAngle = 0;
const sliceAngle = (2 * Math.PI) / segments.length;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for redrawing
    segments.forEach((segment, index) => {
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(250, 250); // Move to the center
        ctx.arc(250, 250, 250, currentAngle, currentAngle + sliceAngle); // Draw the arc
        ctx.closePath();
        ctx.fill();

        // Text
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.translate(250, 250); // Move to the center
        ctx.rotate(currentAngle + sliceAngle / 2); // Rotate to the middle of the slice
        ctx.fillText(segment, 200, 10); // Position the text 200px from the center, slightly adjusted for better alignment
        ctx.rotate(-(currentAngle + sliceAngle / 2)); // Rotate back
        ctx.translate(-250, -250); // Move back to the original position

        currentAngle += sliceAngle; // Move to the next segment
    });

    // Draw the arrow
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(250, 5); // Top of the arrow
    ctx.lineTo(240, 30); // Bottom left
    ctx.lineTo(260, 30); // Bottom right
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    spinBtn.disabled = true;
    let spinDuration = 4000 + Math.random() * 2000; // Spin duration between 4 and 6 seconds
    let startTimestamp;

    const easeOut = (t) => {
        // Easing function for a more dramatic slowdown
        return 1 - Math.pow(1 - t, 3);
    };

    const animateSpin = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsedTime = timestamp - startTimestamp;
        const progress = Math.min(elapsedTime / spinDuration, 1); // Ensure progress goes from 0 to 1
        const easeProgress = easeOut(progress);

        currentAngle = easeProgress * 25 * 2 * Math.PI; // Complete spins: 25 full rotations
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            // Determine the winning segment
            const winningIndex = Math.floor(((currentAngle / sliceAngle) + segments.length) % segments.length);
            const winningSegment = segments[winningIndex];
            resultText.textContent = `Congratulations! You won ${winningSegment}!`;
            spinBtn.disabled = false;
        }
    };

    requestAnimationFrame(animateSpin);
}

spinBtn.addEventListener('click', spinWheel);
drawWheel(); // Initial draw
