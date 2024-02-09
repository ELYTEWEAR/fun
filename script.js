const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');

const segments = ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5'];
const colors = ['#EAD637', '#F7811F', '#E74B3C', '#C2185A', '#881798'];
let angle = 0;

function drawWheel() {
    const sliceAngle = (2 * Math.PI) / segments.length;
    
    segments.forEach((seg, index) => {
        ctx.beginPath();
        ctx.moveTo(250, 250); // Wheel center
        ctx.arc(250, 250, 250, angle, angle + sliceAngle);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // Draw segment text
        ctx.translate(250, 250);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "18px Arial";
        ctx.fillText(seg, 225, 10);
        ctx.rotate(-(angle + sliceAngle / 2));
        ctx.translate(-250, -250);

        angle += sliceAngle;
    });
}

function spinWheel() {
    const spinTo = Math.random() * 7200; // Spin the wheel multiple rounds
    let currentAngle = angle;

    const spinAnimation = setInterval(() => {
        currentAngle += 10;
        ctx.clearRect(0, 0, 500, 500);
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(currentAngle * Math.PI / 180);
        ctx.translate(-250, -250);
        drawWheel();
        ctx.restore();

        if (currentAngle >= spinTo) {
            clearInterval(spinAnimation);
            // Logic to determine the landed segment can go here
        }
    }, 10);
}

spinBtn.addEventListener('click', spinWheel);

// Initial draw
drawWheel();
