const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const loadMoneyBtn = document.getElementById('loadMoneyBtn');
const resultText = document.getElementById('resultText');
const balanceText = document.getElementById('balanceText');

let balance = 150; // Initial balance
const spinCost = 25; // Cost per spin
const segments = ['Bonus', '$0', 'ELYTE STICKER', '$100', '$0', 'Bonus', '$0', '$25', '$0', '$50'];
const colors = ['#ff4d4d', '#4da6ff', '#e6e600', '#ff4d4d', '#4da6ff', '#e6e600', '#ff4d4d', '#4da6ff', '#e6e600', '#ff4d4d'];
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
        ctx.font = '16px Arial';
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.fillText(segment, 200, 10);
        ctx.rotate(-(currentAngle + sliceAngle / 2));
        ctx.translate(-250, -250);

        currentAngle += sliceAngle;
    });

    // Arrow
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(250, 0);
    ctx.lineTo(230, 30);
    ctx.lineTo(270, 30);
    ctx.closePath();
    ctx.fill();
}

function updateBalanceDisplay() {
    balanceText.textContent = `Balance: $${balance}`;
}

function spinWheel() {
    if (balance < spinCost) {
        alert("Not enough balance. Please load more money.");
        return;
    }
    balance -= spinCost;
    updateBalanceDisplay();

    let spinTime = 0;
    let spinDuration = Math.random() * 3000 + 2000; // Spin for 2-5 seconds
    let startAngle = currentAngle;
    let endAngle = startAngle + Math.random() * 10 * Math.PI + 5 * Math.PI; // Ensure at least 5 full rotations

    function animateSpin() {
        const frame = (timestamp) => {
            if (!spinTime) spinTime = timestamp;
            const progress = (timestamp - spinTime) / spinDuration;

            if (progress < 1) {
                currentAngle = startAngle + easeOut(progress) * (endAngle - startAngle);
                drawWheel();
                requestAnimationFrame(frame);
            } else {
                finalizeSpin();
            }
        };
        requestAnimationFrame(frame);
    }

    function finalizeSpin() {
        const winningIndex = Math.floor(((currentAngle / sliceAngle) + 0.5) % segments.length);
        const winningSegment = segments[winningIndex];
        resultText.textContent = `You won ${winningSegment}!`;

        if (winningSegment.includes('$')) {
            const amountWon = parseInt(winningSegment.substring(1));
            balance += amountWon;
            updateBalanceDisplay();
        } else if (winningSegment === 'Bonus') {
            // Implement bonus prize logic here
        }
    }

    function easeOut(t) {
        return t * (2 - t);
    }

    animateSpin();
}

function loadMoney() {
    balance += 150;
    updateBalanceDisplay();
}

spinBtn.addEventListener('click', spinWheel);
loadMoneyBtn.addEventListener('click', loadMoney);

drawWheel();
updateBalanceDisplay();
