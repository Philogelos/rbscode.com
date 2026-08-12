/* RBS CODE · GAME TOOLS · readable student helpers */

function move(item, xChange, yChange) {
    let x = item.offsetLeft;
    let y = item.offsetTop;
    item.style.left = (x + xChange) + "px";
    item.style.top = (y + yChange) + "px";
}

function place(item, x, y) {
    item.style.left = x + "px";
    item.style.top = y + "px";
}

function hide(item) {
    item.style.display = "none";
}

function show(item) {
    item.style.display = "block";
}

function setText(textBox, text) {
    textBox.innerText = text;
}

function changeNumber(number, amount, display) {
    number = number + amount;
    display.innerText = number;
    return number;
}

function keepInside(item, gameArea) {
    let maxX = gameArea.clientWidth - item.offsetWidth;
    let maxY = gameArea.clientHeight - item.offsetHeight;

    if (item.offsetLeft < 0) item.style.left = "0px";
    if (item.offsetLeft > maxX) item.style.left = maxX + "px";
    if (item.offsetTop < 0) item.style.top = "0px";
    if (item.offsetTop > maxY) item.style.top = maxY + "px";
}

function touching(item1, item2) {
    let box1 = item1.getBoundingClientRect();
    let box2 = item2.getBoundingClientRect();

    return box1.left < box2.right &&
           box1.right > box2.left &&
           box1.top < box2.bottom &&
           box1.bottom > box2.top;
}

function randomPosition(item, gameArea) {
    let maxX = gameArea.clientWidth - item.offsetWidth;
    let maxY = gameArea.clientHeight - item.offsetHeight;
    let newX = Math.floor(Math.random() * maxX);
    let newY = Math.floor(Math.random() * maxY);
    place(item, newX, newY);
}

function randomX(item, gameArea) {
    let maxX = gameArea.clientWidth - item.offsetWidth;
    let newX = Math.floor(Math.random() * maxX);
    item.style.left = newX + "px";
}

function atEdge(item, gameArea, side) {
    if (side == "left") return item.offsetLeft <= 0;
    if (side == "right") return item.offsetLeft + item.offsetWidth >= gameArea.clientWidth;
    if (side == "top") return item.offsetTop <= 0;
    if (side == "bottom") return item.offsetTop + item.offsetHeight >= gameArea.clientHeight;
    return false;
}

function moveWithKeys(item, speed, upKey, downKey, leftKey, rightKey) {
    document.addEventListener("keydown", function(event) {
        let used = false;
        if (upKey && event.key == upKey) { move(item, 0, -speed); used = true; }
        if (downKey && event.key == downKey) { move(item, 0, speed); used = true; }
        if (leftKey && event.key == leftKey) { move(item, -speed, 0); used = true; }
        if (rightKey && event.key == rightKey) { move(item, speed, 0); used = true; }
        if (used) event.preventDefault();
    });
}

function moveToward(enemy, target, speed) {
    let xGap = target.offsetLeft - enemy.offsetLeft;
    let yGap = target.offsetTop - enemy.offsetTop;

    if (Math.abs(xGap) > speed) {
        if (xGap > 0) move(enemy, speed, 0);
        else move(enemy, -speed, 0);
    }

    if (Math.abs(yGap) > speed) {
        if (yGap > 0) move(enemy, 0, speed);
        else move(enemy, 0, -speed);
    }
}

function startCountdown(seconds, display, whenFinished) {
    display.innerText = seconds;
    let timer = setInterval(function() {
        seconds = seconds - 1;
        display.innerText = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            whenFinished();
        }
    }, 1000);
    return timer;
}

function randomItem(items) {
    let position = Math.floor(Math.random() * items.length);
    return items[position];
}

function countItem(items, itemName) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i] == itemName) total = total + 1;
    }
    return total;
}

function removeItems(items, itemName, amount) {
    if (countItem(items, itemName) < amount) return false;
    for (let i = 0; i < amount; i++) {
        let position = items.indexOf(itemName);
        items.splice(position, 1);
    }
    return true;
}

function hasAllItems(inventory, neededItems) {
    for (let i = 0; i < neededItems.length; i++) {
        if (!inventory.includes(neededItems[i])) return false;
    }
    return true;
}

function findTouching(item, items) {
    for (let i = 0; i < items.length; i++) {
        if (touching(item, items[i])) return items[i];
    }
    return null;
}

function moveIfClear(item, xChange, yChange, walls, gameArea) {
    let oldX = item.offsetLeft;
    let oldY = item.offsetTop;
    move(item, xChange, yChange);
    keepInside(item, gameArea);

    for (let i = 0; i < walls.length; i++) {
        if (touching(item, walls[i])) {
            place(item, oldX, oldY);
            return false;
        }
    }
    return true;
}

function trackKeys() {
    let keys = [];
    document.addEventListener("keydown", function(event) {
        if (!keys.includes(event.key)) keys.push(event.key);
    });
    document.addEventListener("keyup", function(event) {
        let position = keys.indexOf(event.key);
        if (position != -1) keys.splice(position, 1);
    });
    return keys;
}

function keyDown(keys, key) {
    return keys.includes(key);
}

function applyGravity(item, ySpeed, gravity) {
    ySpeed = ySpeed + gravity;
    move(item, 0, ySpeed);
    return ySpeed;
}

function standingOnAny(player, platforms) {
    let playerBox = player.getBoundingClientRect();
    for (let i = 0; i < platforms.length; i++) {
        let platformBox = platforms[i].getBoundingClientRect();
        let feetNearTop = Math.abs(playerBox.bottom - platformBox.top) <= 4;
        let xOverlap = playerBox.right > platformBox.left && playerBox.left < platformBox.right;
        if (feetNearTop && xOverlap) return true;
    }
    return false;
}

function landOnPlatforms(player, ySpeed, platforms) {
    if (ySpeed < 0) return ySpeed;
    let playerBox = player.getBoundingClientRect();

    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        let platformBox = platform.getBoundingClientRect();
        let wasAbove = playerBox.bottom - ySpeed <= platformBox.top + 3;
        let reached = playerBox.bottom >= platformBox.top;
        let xOverlap = playerBox.right > platformBox.left && playerBox.left < platformBox.right;

        if (wasAbove && reached && xOverlap) {
            player.style.top = (platform.offsetTop - player.offsetHeight) + "px";
            return 0;
        }
    }
    return ySpeed;
}

function createSprite(gameArea, picture, x, y, size) {
    let sprite = document.createElement("div");
    sprite.innerText = picture;
    sprite.style.position = "absolute";
    sprite.style.left = x + "px";
    sprite.style.top = y + "px";
    sprite.style.width = size + "px";
    sprite.style.height = size + "px";
    sprite.style.fontSize = size + "px";
    sprite.style.lineHeight = size + "px";
    sprite.style.textAlign = "center";
    gameArea.appendChild(sprite);
    return sprite;
}
