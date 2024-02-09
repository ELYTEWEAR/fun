function drawArrow() {
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(250, 50); // Arrow tip (above the center top of the wheel)
  ctx.lineTo(230, 90); // Bottom left of the arrow
  ctx.lineTo(270, 90); // Bottom right of the arrow
  ctx.closePath();
  ctx.fill();
}

function spinWheel() {
  spinBtn.disabled = true;
  let spinTime = 0;
  const spinTotalTime = Math.random() * 5000 + 10000; // Between 10 and 15 seconds for more anticipation

  const spinAnimation = setInterval(() => {
    spinTime += 30;
    currentAngle += sliceAngle / 30; // Slower spin increment
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawWheel();
    drawArrow(); // Draw the arrow each time so it remains static

    if (spinTime >= spinTotalTime) {
      clearInterval(spinAnimation);
      spinBtn.disabled = false;
      // Determine the prize
      const winningIndex = Math.floor(prizes.length - (currentAngle / (2 * Math.PI)) % prizes.length) % prizes.length;
      resultText.innerText = `Congratulations! You've won ${prizes[winningIndex]}`;
    }
  }, 30);
}

// Initial draw of the wheel and arrow
drawWheel();
drawArrow();
