/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function fillCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawCoin(x, y, value) {
    fillCircle(x, y, 20, "gold");

    ctx.fillStyle = "red";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("$" + value, x, y);
}

let x = 100;
let y = 100;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setInterval()
    drawCoin(x, y, 20);
    requestAnimationFrame(gameLoop);
}

gameLoop();
