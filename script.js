const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const codeInput = document.getElementById('codeInput');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const resultText = document.getElementById('resultText');
const balanceText = document.getElementById('balanceText');

let balance = 0; // Initialize balance
const spinCost = 25; // Cost per spin
let isSpinning = false; // Flag to prevent spinning when already in progress

// Define segments with an even distribution
const segments = [
    '$0', 'ELYTEWEAR Stickers', '$25 Store Credit', '$0', '$50 Store Credit',
    '$0', 'ELYTEWEAR Stickers', '$100 Store Credit', '$0', 'Bonus',
    '$0', 'ELYTEWEAR Stickers', '$25 Store Credit', '$0', '$50 Store Credit',
    '$0', 'ELYTEWEAR Stickers', '$100 Store Credit'
];
const colors = segments.map((_, index) => ['#FFC107', '#17A2B8', '#dc3545', '#007bff', '#28a745'][index % 5]);

let currentAngle = 0;
const sliceAngle = (2 * Math.PI) / segments.length;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, index) => {
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, currentAngle + index * sliceAngle, currentAngle + (index + 1) * sliceAngle);
        ctx.lineTo(250, 250);
        ctx.fill();

        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + (index + 0.5) * sliceAngle);
        ctx.fillText(segment, 130, 10);
        ctx.rotate(-(currentAngle + (index + 0.5) * sliceAngle));
        ctx.translate(-250, -250);
    });

    // Draw the arrow
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(250, 10);
    ctx.lineTo(235, 40);
    ctx.lineTo(265, 40);
    ctx.closePath();
    ctx.fill();
}

function updateBalanceDisplay() {
    balanceText.textContent = `Balance: $${balance}`;
}

function spinWheel() {
    if (isSpinning || balance < spinCost) {
        alert("Cannot spin now. Check if the wheel is already spinning or if the balance is insufficient.");
        return;
    }

    balance -= spinCost; // Deduct the cost of one spin
    updateBalanceDisplay();
    isSpinning = true; // Set spinning flag

    const spinDuration = 5000; // Spin duration in milliseconds
    const spins = Math.random() * 2 + 3; // Random number of spins
    const totalSpinAngle = spins * 2 * Math.PI; // Total spin angle
    const startAngle = currentAngle; // Starting angle
    const startTime = performance.now(); // Start time for the animation

    function animateSpin(timestamp) {
        let timeElapsed = timestamp - startTime;
        let progress = timeElapsed / spinDuration;

        if (progress < 1) {
            let easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out effect
            currentAngle = startAngle + easeOutProgress * totalSpinAngle;
            drawWheel();
            requestAnimationFrame(animateSpin);
        } else {
            currentAngle = startAngle + totalSpinAngle;
            currentAngle %= 2 * Math.PI; // Normalize angle
            drawWheel();
            finalizeSpin();
            isSpinning = false; // Reset spinning flag
        }
    }

    requestAnimationFrame(animateSpin);
}

function finalizeSpin() {
    const winningIndex = Math.floor((currentAngle / sliceAngle) + 0.5) % segments.length; // Adjusted for text alignment
    const winningSegment = segments[winningIndex];
    resultText.textContent = `You won ${winningSegment}!`;

    // Update balance if won store credit
    if (winningSegment.includes('Store Credit')) {
        const amountWon = parseInt(winningSegment.replace(/\D/g, ''), 10);
        balance += amountWon;
        updateBalanceDisplay();
    }
}

spinBtn.addEventListener('click', spinWheel);

submitCodeBtn.addEventListener('click', function() {
    const code = codeInput.value.trim().toLowerCase();
    if (code === "money") {
        balance += 150; // Load $150 to balance
        updateBalanceDisplay();
        codeInput.value = ''; // Clear input field
        alert("Balance loaded successfully!");
    } else {
        alert("Invalid code. Please try again.");
    }
});

drawWheel(); // Initial drawing of the wheel
updateBalanceDisplay(); // Initial balance update
