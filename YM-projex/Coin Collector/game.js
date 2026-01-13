/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

function fillCircle(x, y, r, color){
    ctx.beginPath(); // Start a new path
    ctx.arc(x, y, r, 0, Math.PI * 2, false); // x, y, radius, start, end, anti-clockwise
    ctx.fillStyle = color; // Set fill color
    ctx.fill(); // Fill the circle
}
function strokeCircle(x, y, r, color){
    ctx.beginPath(); // Start a new path
    ctx.arc(x, y, r, 0, Math.PI * 2, false); // x, y, radius, start, end, anti-clockwise
    ctx.strokeStyle = color; // Set fill color
    ctx.stroke(); // Fill the circle
}

function drawCoin(x, y, value){
    fillCircle(x, y, 25, 'gold')
    strokeCircle(x, y, 25, 'red')

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "16px Arial";
    ctx.fillStyle = "red"
    ctx.fillText("$"+value, x, y)
}

let x = 100
let y = 100
let score = 0 
function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawCoin(x, y, 20)

    ctx.font = "16px Arial";
    ctx.fillStyle = "red"
    ctx.fillText("$"+score, 25, 25)

    requestAnimationFrame(gameLoop)
}
gameLoop()
function getRandomDecimal(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomIntExclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}

document.addEventListener("click", (e)=>{
    console.log(e.clientX, e.clientY)
    if(Math.hypot(e.clientX - x, e.clientY - y)<=25){
        console.log("Youre on my coin man ihs mine!")
        x = getRandomIntExclusive(25, canvas.width-25)
        // Math.random()*(canvas.width-50)+50
        y = getRandomIntExclusive(25, canvas.height-25)
        score+=20
        console.log(score)
    }      
})