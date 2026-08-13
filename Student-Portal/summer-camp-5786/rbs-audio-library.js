// RBS CODE — tiny audio helper library
// Put this file in the SAME folder as your HTML file.
// Then add: <script src="rbs-audio-library.js"></script>

function makeSound(file, volume = 1, loop = false) {
    let sound = new Audio(file);
    sound.volume = volume;
    sound.loop = loop;
    return sound;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(function() {});
}

function playOverlap(file, volume = 1) {
    let sound = new Audio(file);
    sound.volume = volume;
    sound.play().catch(function() {});
    return sound;
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function pauseSound(sound) {
    sound.pause();
}

function setVolume(sound, volume) {
    sound.volume = Math.max(0, Math.min(1, volume));
}

function fadeOut(sound, step = 0.05, every = 50) {
    let timer = setInterval(function() {
        sound.volume = Math.max(0, sound.volume - step);
        if (sound.volume <= 0) {
            clearInterval(timer);
            sound.pause();
        }
    }, every);
}
