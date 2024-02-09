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
        ctx.moveTo(250, 250); // Center of the wheel
        ctx.arc(250, 250, 250, currentAngle, currentAngle + sliceAngle); // Draw the segment
        ctx.lineTo(250, 250);
        ctx.fill();

        // Draw the text
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.fillText(segment, 200, 10);
        ctx.rotate(-(currentAngle + sliceAngle / 2));
        ctx.translate(-250, -250);

        currentAngle += sliceAngle;
    });

    // Draw the arrow at the top
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(250 - 10, 10); // Left side of the arrow
    ctx.lineTo(250 + 10, 10); // Right side of the arrow
    ctx.lineTo(250, 10 + 20); // Arrow tip
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    spinBtn.disabled = true;
    let spinTime = 0;
    let startAngle = currentAngle;
    let spinAnimation;

    const easeOutQuad = (t) => t * (2 - t);
    const spinDuration = 5000; // Duration in milliseconds for the spin to stop

    const animateSpin = (timestamp) => {
        if (!spinTime) spinTime = timestamp;
        const elapsedTime = timestamp - spinTime;
        const progress = Math.min(elapsedTime / spinDuration, 1);
        const easeProgress = easeOutQuad(progress);

        currentAngle = startAngle + easeProgress * 25 * 2 * Math.PI; // 25 full rotations for a long spin

        drawWheel();

        if (progress < 1) {
            spinAnimation = requestAnimationFrame(animateSpin);
        } else {
            cancelAnimationFrame(spinAnimation);
            spinBtn.disabled = false;
            // Determine the winning segment
            const totalSegments = segments.length;
            const adjustedAngle = currentAngle % (2 * Math.PI); // Normalize the angle
            const segmentAngle = 2 * Math.PI / totalSegments;
            const winningIndex = Math.floor((adjustedAngle + segmentAngle / 2) / segmentAngle) % totalSegments;
            resultText.textContent = `Congratulations! You won ${segments[winningIndex]}!`;
        }
    };

    requestAnimationFrame(animateSpin);
}

spinBtn.addEventListener('click', spinWheel);
drawWheel(); // Initial drawing of the wheel
