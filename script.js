const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('resultText');
const balanceText = document.getElementById('balanceText'); // Add a balance display element in your HTML

let balance = 0; // Starting balance
const segments = ['ELYTE HOODIE', '$0', '$50', '$75', 'Mystery'];
const colors = ['#FFD700', '#ADFF2F', '#FF4500', '#1E90FF', '#FF69B4'];
let currentAngle = 0;
const sliceAngle = (2 * Math.PI) / segments.length;

function updateBalance(amount) {
    balance += amount;
    balanceText.textContent = `Balance: $${balance}`;
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    segments.forEach((segment, index) => {
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.fillText(segment, 200, 10);
        ctx.rotate(-(currentAngle + sliceAngle / 2));
        ctx.translate(-250, -250);

        currentAngle += sliceAngle;
    });

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(250 - 10, 10);
    ctx.lineTo(250 + 10, 10);
    ctx.lineTo(250, 30);
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    spinBtn.disabled = true;
    let spinDuration = 4000 + Math.random() * 1000; // Spin duration between 4 and 5 seconds
    let startTimestamp;
    let startAngle = currentAngle;
    let endAngle = startAngle + Math.random() * 5 * 2 * Math.PI; // Random end angle for varied outcomes

    const animateSpin = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsedTime = timestamp - startTimestamp;
        const progress = elapsedTime / spinDuration;

        if (progress < 1) {
            currentAngle = startAngle + easeOutQuad(progress) * (endAngle - startAngle);
            drawWheel();
            requestAnimationFrame(animateSpin);
        } else {
            finalAdjustment(); // Adjust the final position to weight towards smaller prizes
        }
    };

    requestAnimationFrame(animateSpin);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function finalAdjustment() {
    const mysteryPrizes = ['$0', '$50', '$75', 'ELYTE HOODIE', '$1000']; // Including the rare $1000 prize
    let finalSegment = segments[Math.floor(((currentAngle + Math.PI / segments.length) % (2 * Math.PI)) / sliceAngle) % segments.length];

    if (finalSegment === 'Mystery') {
        finalSegment = mysteryPrizes[Math.floor(Math.pow(Math.random(), 3) * mysteryPrizes.length)]; // Skew towards lower-value prizes
    }

    // Update the balance based on the prize won
    const prizeAmount = finalSegment === 'ELYTE HOODIE' ? 0 : (finalSegment === 'Mystery' ? (finalSegment === '$1000' ? 1000 : 0) : parseInt(finalSegment.replace('$', ''), 10));
    updateBalance(prizeAmount);

    resultText.textContent = `Congratulations! You won ${finalSegment}!`;
    spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spinWheel);
drawWheel(); // Initial drawing of the wheel
