/*
RBS CODE · GAMEPAD LIBRARY · FINAL DAY
======================================
Load AFTER rbs-game-library.js.

padIndex:
0 = first controller
1 = second controller
*/

const PAD = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    BACK: 8,
    START: 9,
    L3: 10,
    R3: 11,
    UP: 12,
    DOWN: 13,
    LEFT: 14,
    RIGHT: 15,
    HOME: 16
};

const RBS_PAD = {
    previousButtons: [],
    deadZone: 0.15
};

function getGamepad(index = 0) {
    let pads = navigator.getGamepads ? navigator.getGamepads() : [];
    return pads[index] || null;
}

function gamepadConnected(padIndex = 0) {
    return getGamepad(padIndex) !== null;
}

function padButton(number, padIndex = 0) {
    let pad = getGamepad(padIndex);

    return !!(
        pad &&
        pad.buttons[number] &&
        pad.buttons[number].pressed
    );
}

function padButtonValue(number, padIndex = 0) {
    let pad = getGamepad(padIndex);

    if (!pad || !pad.buttons[number]) {
        return 0;
    }

    return pad.buttons[number].value;
}

function padAxis(
    number,
    deadZone = RBS_PAD.deadZone,
    padIndex = 0
) {
    let pad = getGamepad(padIndex);

    if (!pad || pad.axes[number] === undefined) {
        return 0;
    }

    let value = pad.axes[number];

    if (Math.abs(value) < deadZone) {
        return 0;
    }

    return value;
}

function leftStick(
    padIndex = 0,
    deadZone = RBS_PAD.deadZone
) {
    return {
        x: padAxis(0, deadZone, padIndex),
        y: padAxis(1, deadZone, padIndex)
    };
}

function rightStick(
    padIndex = 0,
    deadZone = RBS_PAD.deadZone
) {
    return {
        x: padAxis(2, deadZone, padIndex),
        y: padAxis(3, deadZone, padIndex)
    };
}

function padJustPressed(number, padIndex = 0) {
    let pad = getGamepad(padIndex);

    if (!pad || !pad.buttons[number]) {
        return false;
    }

    let key = padIndex + ":" + number;

    return (
        pad.buttons[number].pressed &&
        !RBS_PAD.previousButtons[key]
    );
}

function updatePadButtons() {
    let pads =
        navigator.getGamepads ?
        navigator.getGamepads() :
        [];

    for (let p = 0; p < pads.length; p++) {
        let pad = pads[p];

        if (!pad) continue;

        for (let b = 0; b < pad.buttons.length; b++) {
            RBS_PAD.previousButtons[p + ":" + b] =
                pad.buttons[b].pressed;
        }
    }
}

async function rumble(
    strong = 1,
    weak = 0.5,
    duration = 150,
    padIndex = 0
) {
    let pad = getGamepad(padIndex);

    if (!pad) return false;

    let actuator =
        pad.vibrationActuator ||
        (pad.hapticActuators &&
         pad.hapticActuators[0]);

    if (!actuator) return false;

    try {
        if (actuator.playEffect) {
            await actuator.playEffect(
                "dual-rumble",
                {
                    startDelay: 0,
                    duration: duration,
                    strongMagnitude:
                        Math.max(
                            0,
                            Math.min(1, strong)
                        ),
                    weakMagnitude:
                        Math.max(
                            0,
                            Math.min(1, weak)
                        )
                }
            );

            return true;
        }

        if (actuator.pulse) {
            await actuator.pulse(
                Math.max(strong, weak),
                duration
            );

            return true;
        }
    } catch (error) {}

    return false;
}

async function stopRumble(padIndex = 0) {
    let pad = getGamepad(padIndex);

    if (!pad) return;

    let actuator =
        pad.vibrationActuator ||
        (pad.hapticActuators &&
         pad.hapticActuators[0]);

    if (!actuator) return;

    try {
        if (actuator.reset) {
            await actuator.reset();
        }
    } catch (error) {}
}

/* =========================================================
   HIGH-LEVEL POWER BLOCKS
   ========================================================= */

function moveWithGamepad(
    item,
    speed,
    gameArea,
    padIndex = 0
) {
    item = get(item);
    gameArea = get(gameArea);

    if (!item || !gameArea) return;

    function loop() {
        if (
            typeof RBS_GAME_ENDED === "undefined" ||
            !RBS_GAME_ENDED
        ) {
            let stick = leftStick(padIndex);

            move(
                item,
                stick.x * speed,
                stick.y * speed
            );

            keepInside(item, gameArea);
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function driveWithGamepad(
    vehicle,
    steeringSpeed,
    driveSpeed,
    gameArea,
    padIndex = 0
) {
    vehicle = get(vehicle);
    gameArea = get(gameArea);

    if (!vehicle || !gameArea) return;

    function loop() {
        if (
            typeof RBS_GAME_ENDED === "undefined" ||
            !RBS_GAME_ENDED
        ) {
            let stick = leftStick(padIndex);

            let gas =
                padButtonValue(PAD.RT, padIndex);

            let reverse =
                padButtonValue(PAD.LT, padIndex);

            move(
                vehicle,
                stick.x * steeringSpeed,
                (reverse - gas) * driveSpeed
            );

            keepInside(vehicle, gameArea);
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function rumbleOnTouch(
    item1,
    item2,
    strong = 1,
    weak = 0.5,
    duration = 150,
    padIndex = 0
) {
    item1 = get(item1);
    item2 = get(item2);

    let wasTouching = false;

    function loop() {
        let isTouching =
            item1 &&
            item2 &&
            touching(item1, item2);

        if (isTouching && !wasTouching) {
            rumble(
                strong,
                weak,
                duration,
                padIndex
            );
        }

        wasTouching = isTouching;

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function moveTwoPlayersWithGamepads(
    player1,
    player2,
    speed,
    gameArea
) {
    moveWithGamepad(
        player1,
        speed,
        gameArea,
        0
    );

    moveWithGamepad(
        player2,
        speed,
        gameArea,
        1
    );
}
