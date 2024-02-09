const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('resultText');

const segments = ['ELYTE HOODIE', '$0', '$50', '$75', 'Free Stickers'];
const colors = ['#FFD700', '#ADFF2F', '#FF4500', '#1E90FF', '#FF69B4'];
const arrowColor = '#333';

let currentAngle = 0;
const sliceAngle = (2 * Math.PI) / segments.length;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < segments.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '18px Arial';
        ctx.fillText(segments[i], 250 + Math.cos(currentAngle + sliceAngle / 2) * 200, 250 + Math.sin(currentAngle + sliceAngle / 2) * 200);
        currentAngle += sliceAngle;
    }

    // Draw the arrow
    ctx.fillStyle = arrowColor;
    ctx.beginPath();
    ctx.moveTo(250, 20);
    ctx.lineTo(240, 40);
    ctx.lineTo(260, 40);
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    spinBtn.disabled = true;
    let spinTime = 0;
    let startAngle = currentAngle;
    let spinAnimation;

    const easeOutQuad = t => t * (2 - t);
    const duration = 5000; // Duration of the spin

    const spin = timestamp => {
        if (!spinTime) { spinTime = timestamp; }
        const progress = Math.min((timestamp - spinTime) / duration, 1);
        const easeProgress = easeOutQuad(progress);

        currentAngle = startAngle + easeProgress * 25 * Math.PI; // 25 full spins
        drawWheel();

        if (progress < 1) {
            spinAnimation = requestAnimationFrame(spin);
        } else {
            cancelAnimationFrame(spinAnimation);
            spinBtn.disabled = false;
            // Determine the prize
            const winningIndex = Math.floor(segments.length - (currentAngle / (2 * Math.PI)) % segments.length) % segments.length;
            resultText.textContent = `Congratulations! You won ${segments[winningIndex]}!`;
        }
    };

    requestAnimationFrame(spin);
}

spinBtn.addEventListener('click', spinWheel);

// Initial draw of the wheel
drawWheel();
