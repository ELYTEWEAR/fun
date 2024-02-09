const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const codeInput = document.getElementById('codeInput');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const resultText = document.getElementById('resultText');
const balanceText = document.getElementById('balanceText');

let balance = 0; // Initialize balance
const spinCost = 25; // Cost per spin

// Define segments and their corresponding colors
const segments = [
    'Bonus', // 1x "Bonus"
    '$100 Store Credit', '$100 Store Credit', // 2x "$100 Credit"
    '$50 Store Credit', '$50 Store Credit', '$50 Store Credit', '$50 Store Credit', // 4x "$50 Credit"
    '$25 Store Credit', '$25 Store Credit', '$25 Store Credit', '$25 Store Credit', '$25 Store Credit', '$25 Store Credit', // 6x "$25 Credit"
    'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', 'ELYTEWEAR Stickers', // 8x "Stickers"
    '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0', '$0' // 18x "$0"
];
const colors = segments.map((seg, index) => ['#FFC107', '#17A2B8', '#dc3545', '#007bff', '#28a745'][index % 5]);

let currentAngle = 0;
const sliceAngle = (2 * Math.PI) / segments.length;

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
        ctx.font = '12px Arial'; // Adjusted font size for readability
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.fillText(segment, 175, 0); // Adjusted text position
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

    let startAngle = currentAngle;
    let spinDuration = 7000; // Extended spin duration for added anticipation

    function animateSpin(time) {
        const elapsedTime = (time % spinDuration) / spinDuration;
        const easeOut = 1 - Math.pow(1 - elapsedTime, 3); // Cubic ease-out
        currentAngle = startAngle + easeOut * 20 * Math.PI; // Complete 20 full rotations

        drawWheel();

        if (elapsedTime < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            finalizeSpin();
        }
    }

    function finalizeSpin() {
        const adjustedAngle = currentAngle % (2 * Math.PI);
        const winningIndex = Math.floor((adjustedAngle / (2 * Math.PI)) * segments.length);
        const winningSegment = segments[(segments.length - winningIndex) % segments.length];
        resultText.textContent = `You won ${winningSegment}!`;

        // Handle winning logic, including bonus and store credits
        if (winningSegment === 'Bonus') {
            // Bonus can be any prize, including $1000
            const bonusPrizes = ['$1000', ...segments.filter(prize => prize !== 'Bonus')];
            const randomBonusIndex = Math.floor(Math.random() * bonusPrizes.length);
            const bonusPrize = bonusPrizes[randomBonusIndex];
            resultText.textContent += ` Bonus Prize: ${bonusPrize}!`;
            if (bonusPrize.includes('$')) {
                const amountWon = parseInt(bonusPrize.substring(1));
                balance += amountWon; // Add winnings to balance if it's a store credit
                updateBalanceDisplay();
            }
        } else if (winningSegment.includes('$')) {
            const amountWon = parseInt(winningSegment.substring(1));
            balance += amountWon; // Add winnings to balance if it's a store credit
            updateBalanceDisplay();
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

// Initialize
drawWheel();
updateBalanceDisplay();
