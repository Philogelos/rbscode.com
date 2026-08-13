/*
RBS CODE · MASTER GAME LIBRARY · FINAL DAY
===========================================
One library for the beginner "power blocks" AND the later building blocks.

IMPORTANT:
- Functions accept either an element OR its id as text.
- Old examples such as moveWithKeys("player", 7, "game") keep working.
- Dynamic sprites are removed from BOTH the webpage and their array.
*/

let RBS_GAME_ENDED = false;

function get(item) {
    if (typeof item === "string") {
        return document.getElementById(item);
    }
    return item;
}

function getAll(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function move(item, xChange, yChange) {
    item = get(item);
    if (!item) return;
    item.style.left = (item.offsetLeft + xChange) + "px";
    item.style.top = (item.offsetTop + yChange) + "px";
}

function place(item, x, y) {
    item = get(item);
    if (!item) return;
    item.style.left = x + "px";
    item.style.top = y + "px";
}

function hide(item) {
    item = get(item);
    if (item) item.style.display = "none";
}

function show(item) {
    item = get(item);
    if (item) item.style.display = "block";
}

function setText(item, text) {
    item = get(item);
    if (item) item.innerText = text;
}

function setEmoji(item, emoji) {
    setText(item, emoji);
}

function setImage(item, src) {
    item = get(item);
    if (item) item.src = src;
}

function changePicture(item, src) {
    setImage(item, src);
}

function changeNumber(number, amount, display) {
    number = number + amount;
    display = get(display);
    if (display) display.innerText = number;
    return number;
}

function keepInside(item, gameArea) {
    item = get(item);
    gameArea = get(gameArea);
    if (!item || !gameArea) return;

    let maxX = gameArea.clientWidth - item.offsetWidth;
    let maxY = gameArea.clientHeight - item.offsetHeight;

    if (item.offsetLeft < 0) item.style.left = "0px";
    if (item.offsetTop < 0) item.style.top = "0px";
    if (item.offsetLeft > maxX) item.style.left = maxX + "px";
    if (item.offsetTop > maxY) item.style.top = maxY + "px";
}

function touching(a, b) {
    a = get(a);
    b = get(b);

    if (!a || !b) return false;
    if (a.style.display === "none" || b.style.display === "none") return false;

    let x = a.getBoundingClientRect();
    let y = b.getBoundingClientRect();

    return x.left < y.right &&
           x.right > y.left &&
           x.top < y.bottom &&
           x.bottom > y.top;
}

function atEdge(item, gameArea, side) {
    item = get(item);
    gameArea = get(gameArea);
    if (!item || !gameArea) return false;

    if (side === "left") return item.offsetLeft <= 0;
    if (side === "right") return item.offsetLeft + item.offsetWidth >= gameArea.clientWidth;
    if (side === "top") return item.offsetTop <= 0;
    if (side === "bottom") return item.offsetTop + item.offsetHeight >= gameArea.clientHeight;
    return false;
}

function randomPosition(item, gameArea) {
    item = get(item);
    gameArea = get(gameArea);
    if (!item || !gameArea) return;

    let maxX = Math.max(0, gameArea.clientWidth - item.offsetWidth);
    let maxY = Math.max(0, gameArea.clientHeight - item.offsetHeight);

    place(
        item,
        Math.floor(Math.random() * (maxX + 1)),
        Math.floor(Math.random() * (maxY + 1))
    );
}

function randomX(item, gameArea) {
    item = get(item);
    gameArea = get(gameArea);
    if (!item || !gameArea) return;

    let maxX = Math.max(0, gameArea.clientWidth - item.offsetWidth);
    item.style.left = Math.floor(Math.random() * (maxX + 1)) + "px";
}

function moveToward(enemy, target, speed) {
    enemy = get(enemy);
    target = get(target);
    if (!enemy || !target) return;

    let dx = target.offsetLeft - enemy.offsetLeft;
    let dy = target.offsetTop - enemy.offsetTop;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    move(enemy, (dx / distance) * speed, (dy / distance) * speed);
}

/*
THREE WAYS TO USE moveWithKeys:

1. Default arrows + stay inside game:
moveWithKeys("player", 10, "game");

2. Custom keys + stay inside game:
moveWithKeys("blue", 10, "game", "w", "s", "a", "d");

3. Custom keys without a boundary:
moveWithKeys("player", 10, "w", "s", "a", "d");
*/
function moveWithKeys(item, speed, third, fourth, fifth, sixth, seventh) {
    item = get(item);
    if (!item) return;

    let gameArea = null;
    let upKey = "ArrowUp";
    let downKey = "ArrowDown";
    let leftKey = "ArrowLeft";
    let rightKey = "ArrowRight";

    if (arguments.length === 3) {
        gameArea = get(third);
    } else if (arguments.length >= 7) {
        gameArea = get(third);
        upKey = fourth;
        downKey = fifth;
        leftKey = sixth;
        rightKey = seventh;
    } else if (arguments.length >= 6) {
        upKey = third;
        downKey = fourth;
        leftKey = fifth;
        rightKey = sixth;
    }

    document.addEventListener("keydown", function(event) {
        if (RBS_GAME_ENDED) return;

        let moved = false;

        if (event.key === upKey) {
            move(item, 0, -speed);
            moved = true;
        }
        if (event.key === downKey) {
            move(item, 0, speed);
            moved = true;
        }
        if (event.key === leftKey) {
            move(item, -speed, 0);
            moved = true;
        }
        if (event.key === rightKey) {
            move(item, speed, 0);
            moved = true;
        }

        if (moved && gameArea) keepInside(item, gameArea);

        if (moved && event.key.startsWith("Arrow")) {
            event.preventDefault();
        }
    });
}

function after(milliseconds, doThis) {
    return setTimeout(doThis, milliseconds);
}

function every(milliseconds, doThis) {
    return setInterval(doThis, milliseconds);
}

function everyFrame(doThis) {
    function loop() {
        doThis();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

function restartGame() {
    location.reload();
}

function gameOver(message, text) {
    RBS_GAME_ENDED = true;
    setText(message, text || "GAME OVER");
}

/* =========================================================
   BEGINNER POWER BLOCKS
   ========================================================= */

function collect(player, itemOrInventory, scoreOrName, points, gameArea) {
    /*
    Beginner:
    collect("player", "coin", "scoreText", 1, "game");

    Later array lesson:
    collect(keyElement, inventoryArray, "key");
    */
    if (Array.isArray(itemOrInventory)) {
        let item = get(player);
        itemOrInventory.push(scoreOrName);
        hide(item);
        return;
    }

    player = get(player);
    let item = get(itemOrInventory);
    let scoreText = get(scoreOrName);
    gameArea = get(gameArea);

    if (!player || !item || !scoreText || !gameArea) return;

    everyFrame(function() {
        if (RBS_GAME_ENDED) return;

        if (touching(player, item)) {
            let score = Number(scoreText.innerText) || 0;
            score = score + points;
            scoreText.innerText = score;
            randomPosition(item, gameArea);
        }
    });
}

function winAtScore(scoreText, target, message) {
    scoreText = get(scoreText);
    message = get(message);

    everyFrame(function() {
        if (RBS_GAME_ENDED || !scoreText) return;

        if ((Number(scoreText.innerText) || 0) >= target) {
            RBS_GAME_ENDED = true;
            if (message) message.innerText = "YOU WIN!";
        }
    });
}

function loseOnTouch(player, enemy, message, playerAfter) {
    player = get(player);
    enemy = get(enemy);
    message = get(message);

    everyFrame(function() {
        if (RBS_GAME_ENDED) return;

        if (touching(player, enemy)) {
            RBS_GAME_ENDED = true;
            if (playerAfter) setEmoji(player, playerAfter);
            if (message) message.innerText = "GAME OVER";
        }
    });
}

function winOnTouch(player, goal, message) {
    player = get(player);
    goal = get(goal);
    message = get(message);

    everyFrame(function() {
        if (RBS_GAME_ENDED) return;

        if (goal && goal.dataset.locked === "true") return;

        if (touching(player, goal)) {
            RBS_GAME_ENDED = true;
            if (message) message.innerText = "YOU WIN!";
        }
    });
}

function chase(enemy, player, speed) {
    enemy = get(enemy);
    player = get(player);

    everyFrame(function() {
        if (RBS_GAME_ENDED) return;
        moveToward(enemy, player, speed);
    });
}

function patrol(enemy, xSpeed, ySpeed, gameArea) {
    enemy = get(enemy);
    gameArea = get(gameArea);
    if (!enemy || !gameArea) return;

    let dx = xSpeed;
    let dy = ySpeed;

    everyFrame(function() {
        if (RBS_GAME_ENDED) return;

        move(enemy, dx, dy);

        if (atEdge(enemy, gameArea, "left") || atEdge(enemy, gameArea, "right")) {
            dx = -dx;
        }
        if (atEdge(enemy, gameArea, "top") || atEdge(enemy, gameArea, "bottom")) {
            dy = -dy;
        }

        keepInside(enemy, gameArea);
    });
}

function keyOpensDoor(player, key, door, message) {
    player = get(player);
    key = get(key);
    door = get(door);
    message = get(message);
    if (!player || !key || !door) return;

    door.dataset.locked = "true";
    let hasKey = false;

    everyFrame(function() {
        if (RBS_GAME_ENDED) return;

        if (!hasKey && touching(player, key)) {
            hasKey = true;
            hide(key);
            door.dataset.locked = "false";
            if (message) message.innerText = "KEY FOUND! Reach the door.";
        }

        if (hasKey && touching(player, door)) {
            RBS_GAME_ENDED = true;
            if (message) message.innerText = "YOU ESCAPED!";
        }
    });
}

function countdown(seconds, timeText, message) {
    timeText = get(timeText);
    message = get(message);
    let time = seconds;

    if (timeText) timeText.innerText = time;

    let timer = setInterval(function() {
        if (RBS_GAME_ENDED) {
            clearInterval(timer);
            return;
        }

        time = time - 1;
        if (timeText) timeText.innerText = time;

        if (time <= 0) {
            clearInterval(timer);
            RBS_GAME_ENDED = true;
            if (message) message.innerText = "TIME UP!";
        }
    }, 1000);

    return timer;
}

function startCountdown(seconds, display, whenFinished) {
    display = get(display);
    let time = seconds;
    if (display) display.innerText = time;

    let timer = setInterval(function() {
        time = time - 1;
        if (display) display.innerText = time;

        if (time <= 0) {
            clearInterval(timer);
            if (whenFinished) whenFinished();
        }
    }, 1000);

    return timer;
}

function survive(seconds, timeText, message, player) {
    timeText = get(timeText);
    message = get(message);
    player = get(player);
    let time = seconds;

    if (timeText) timeText.innerText = time;

    let timer = setInterval(function() {
        if (RBS_GAME_ENDED) {
            clearInterval(timer);
            return;
        }

        time = time - 1;
        if (timeText) timeText.innerText = time;

        if (time <= 0) {
            clearInterval(timer);
            RBS_GAME_ENDED = true;
            if (message) message.innerText = "YOU SURVIVED!";
            if (player) player.innerText = "🏆";
        }
    }, 1000);

    return timer;
}

/* =========================================================
   ARRAYS
   ========================================================= */

function hasItem(list, item) {
    return list.includes(item);
}

/*
Overloaded:
removeItem(array, thing) removes from an array.
removeItem(element) removes a DOM element.
*/
function removeItem(listOrElement, item) {
    if (Array.isArray(listOrElement)) {
        let index = listOrElement.indexOf(item);
        if (index !== -1) {
            listOrElement.splice(index, 1);
            return true;
        }
        return false;
    }

    let element = get(listOrElement);
    if (element) element.remove();
    return !!element;
}

function showInventory(list, display) {
    display = get(display);
    if (display) display.innerText = list.join(", ");
}

function randomItem(list) {
    if (list.length === 0) return undefined;
    return list[Math.floor(Math.random() * list.length)];
}

function countItem(list, item) {
    let total = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === item) total = total + 1;
    }
    return total;
}

function removeItems(list, item, amount) {
    if (countItem(list, item) < amount) return false;

    for (let i = 0; i < amount; i++) {
        removeItem(list, item);
    }
    return true;
}

function hasAllItems(list, neededItems) {
    for (let i = 0; i < neededItems.length; i++) {
        if (!list.includes(neededItems[i])) return false;
    }
    return true;
}

function touchingAny(item, items) {
    item = get(item);

    for (let i = 0; i < items.length; i++) {
        if (touching(item, items[i])) return items[i];
    }
    return null;
}

function touchingIndex(item, items) {
    item = get(item);

    for (let i = 0; i < items.length; i++) {
        if (touching(item, items[i])) return i;
    }
    return -1;
}

function moveIfClear(item, xChange, yChange, walls, gameArea) {
    item = get(item);
    gameArea = get(gameArea);

    let oldX = item.offsetLeft;
    let oldY = item.offsetTop;

    move(item, xChange, yChange);
    if (gameArea) keepInside(item, gameArea);

    for (let i = 0; i < walls.length; i++) {
        if (touching(item, walls[i])) {
            place(item, oldX, oldY);
            return false;
        }
    }
    return true;
}

function moveAll(items, xChange, yChange) {
    for (let i = 0; i < items.length; i++) {
        move(items[i], xChange, yChange);
    }
}

/* =========================================================
   SMOOTH CONTROLS
   ========================================================= */

let keysDown = [];
let keyTrackingStarted = false;

function startKeyTracking() {
    if (keyTrackingStarted) return;
    keyTrackingStarted = true;

    document.addEventListener("keydown", function(event) {
        if (!keysDown.includes(event.key)) keysDown.push(event.key);

        if (event.key.startsWith("Arrow") || event.key === " ") {
            event.preventDefault();
        }
    });

    document.addEventListener("keyup", function(event) {
        let position = keysDown.indexOf(event.key);
        if (position !== -1) keysDown.splice(position, 1);
    });

    window.addEventListener("blur", function() {
        keysDown.length = 0;
    });
}

function keyIsDown(key) {
    return keysDown.includes(key);
}

/* =========================================================
   PLATFORM PHYSICS
   ========================================================= */

function applyGravity(item, ySpeed, gravityStrength) {
    item = get(item);
    ySpeed = ySpeed + gravityStrength;
    move(item, 0, ySpeed);
    return ySpeed;
}

function standingOnAny(player, platforms) {
    player = get(player);
    if (!player) return false;

    let playerBox = player.getBoundingClientRect();

    for (let i = 0; i < platforms.length; i++) {
        let platformBox = platforms[i].getBoundingClientRect();

        let feetNearTop = Math.abs(playerBox.bottom - platformBox.top) <= 5;
        let xOverlap =
            playerBox.right > platformBox.left &&
            playerBox.left < platformBox.right;

        if (feetNearTop && xOverlap) return true;
    }

    return false;
}

function landOnPlatforms(player, ySpeed, platforms) {
    player = get(player);
    if (!player || ySpeed < 0) return ySpeed;

    let playerBox = player.getBoundingClientRect();

    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        let platformBox = platform.getBoundingClientRect();

        let wasAbove =
            playerBox.bottom - ySpeed <= platformBox.top + 3;

        let reachedPlatform =
            playerBox.bottom >= platformBox.top;

        let xOverlap =
            playerBox.right > platformBox.left &&
            playerBox.left < platformBox.right;

        if (wasAbove && reachedPlatform && xOverlap) {
            player.style.top =
                (platform.offsetTop - player.offsetHeight) + "px";
            return 0;
        }
    }

    return ySpeed;
}

/* =========================================================
   DOM + ARRAYS: CREATE AND DELETE REAL GAME OBJECTS
   ========================================================= */

function createSprite(gameArea, picture, x, y, size) {
    gameArea = get(gameArea);
    size = size || 44;

    let sprite = document.createElement("div");
    sprite.className = "sprite";
    sprite.innerText = picture;
    sprite.style.position = "absolute";
    sprite.style.left = x + "px";
    sprite.style.top = y + "px";
    sprite.style.width = size + "px";
    sprite.style.height = size + "px";
    sprite.style.fontSize = size + "px";
    sprite.style.lineHeight = size + "px";
    sprite.style.textAlign = "center";
    sprite.style.userSelect = "none";

    gameArea.appendChild(sprite);
    return sprite;
}

/* Create a sprite AND remember it in an array. */
function addSprite(list, gameArea, picture, x, y, size) {
    let sprite = createSprite(gameArea, picture, x, y, size);
    list.push(sprite);
    return sprite;
}

/*
Remove a sprite from the PAGE and, if supplied, from its ARRAY too.
This prevents invisible/dead objects building up in memory.
*/
function removeSprite(sprite, list) {
    sprite = get(sprite);
    if (!sprite) return false;

    if (Array.isArray(list)) {
        let index = list.indexOf(sprite);
        if (index !== -1) list.splice(index, 1);
    }

    sprite.remove();
    return true;
}

function removeAt(list, index) {
    if (index < 0 || index >= list.length) return false;

    let sprite = list[index];
    if (sprite && sprite.remove) sprite.remove();
    list.splice(index, 1);
    return true;
}

function clearSprites(list) {
    for (let i = list.length - 1; i >= 0; i--) {
        removeAt(list, i);
    }
}

/*
IMPORTANT CLEANUP:
Returns how many objects were removed.
Uses a backwards loop so splice() cannot skip items.
*/
function removeOffscreen(items, gameArea) {
    gameArea = get(gameArea);
    let removed = 0;

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];

        let outside =
            item.offsetLeft + item.offsetWidth < 0 ||
            item.offsetLeft > gameArea.clientWidth ||
            item.offsetTop + item.offsetHeight < 0 ||
            item.offsetTop > gameArea.clientHeight;

        if (outside) {
            removeAt(items, i);
            removed = removed + 1;
        }
    }

    return removed;
}

function makeBullet(shooter, gameArea, bullets, picture, size) {
    shooter = get(shooter);
    gameArea = get(gameArea);
    size = size || 18;

    let x =
        shooter.offsetLeft +
        shooter.offsetWidth / 2 -
        size / 2;

    let y = shooter.offsetTop - size;

    return addSprite(bullets, gameArea, picture || "•", x, y, size);
}

/*
Remove every A/B collision from BOTH arrays and BOTH DOM elements.
Returns number of hits.
*/
function removeCollisions(listA, listB) {
    let hits = 0;

    for (let a = listA.length - 1; a >= 0; a--) {
        let hitSomething = false;

        for (let b = listB.length - 1; b >= 0; b--) {
            if (touching(listA[a], listB[b])) {
                removeAt(listB, b);
                removeAt(listA, a);
                hits = hits + 1;
                hitSomething = true;
                break;
            }
        }

        if (hitSomething) continue;
    }

    return hits;
}
