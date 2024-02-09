const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const codeInput = document.getElementById('codeInput');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const resultText = document.getElementById('resultText');
const balanceText = document.getElementById('balanceText');

let balance = 0; // Initialize balance
const spinCost = 25; // Cost per spin

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
        ctx.arc(250, 250, 250, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.fillText(segment, 200, 0);
        ctx.rotate(-(currentAngle + sliceAngle / 2));
        ctx.translate(-250, -250);

        currentAngle += sliceAngle;
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
    if (balance < spinCost) {
        alert("Insufficient balance. Please load more credits.");
        return;
    }

    balance -= spinCost; // Deduct the cost of one spin
    updateBalanceDisplay();

    let startAngle = currentAngle % (2 * Math.PI); // Normalize start angle
    let spinDuration = 8000; // Extended spin duration for added anticipation
    let endAngle = startAngle + 10 * Math.PI + Math.random() * 5 * Math.PI; // Randomize end angle for varied outcomes

    function animateSpin(time) {
        const elapsedTime = (time % spinDuration) / spinDuration;
        const easeOut = 1 - Math.pow(1 - elapsedTime, 3); // Cubic ease-out for smooth slowdown
        currentAngle = startAngle + easeOut * (endAngle - startAngle);

        drawWheel();

        if (elapsedTime < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            finalizeSpin();
        }
    }

    function finalizeSpin() {
        const adjustedAngle = currentAngle % (2 * Math.PI); // Normalize final angle
        const winningIndex = Math.floor(adjustedAngle / sliceAngle) % segments.length;
        const winningSegment = segments[winningIndex];
        resultText.textContent = `You won ${winningSegment}!`;

        // Handle special prizes and store credit winnings
        if (winningSegment.includes('Store Credit')) {
            const amountWon = parseInt(winningSegment.replace(/\D/g, ''));
            balance += amountWon; // Add winnings to balance
            updateBalanceDisplay();
        } else if (winningSegment === 'Bonus') {
            // Handle Bonus prize logic here, potentially including the $1000 prize
        }
    }

    requestAnimationFrame(animateSpin);
}

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
