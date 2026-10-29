
const menu = document.getElementById('menu');
const holes = document.getElementById('holes');
const homeButton = document.getElementById('home-button');

for (let i = 0; i < 7; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.innerHTML = '<img class="hole-art" src="assets/images/hole.png" alt=""><img class="rim" src="assets/images/hole-front.png" alt=""><div class="shaft"></div>';
    holes.append(hole);
}

setupGhosts();

document.getElementById('play').addEventListener('click', function () {
    startGame();
});

homeButton.addEventListener('click', returnHome);

document.getElementById('again').addEventListener('click', startGame);

document.getElementById('result-home').addEventListener('click', function () {
    showScreen('home');
});

holes.inert = true;
updateScoreboard();

document.querySelectorAll('.sound-toggle').forEach(function (button) {
    button.addEventListener('click', toggleSound);
});
updateSoundButtons();

document.getElementById('pause-button').addEventListener('click', togglePause);
document.getElementById('resume').addEventListener('click', togglePause);
document.getElementById('pause-home').addEventListener('click', returnHome);

function returnHome() {
    stopGame();
    showScreen('home');
}

document.addEventListener('keydown' function (event) {
    if (event.repeat) return;
    const pauseKey = event.key.toLowerCase() === 'p' || event.key === 'Escape';
    if (game.running && pauseKey) {
        event.preventDefault();
        togglePause();
        return;
    }
    if (game.running && !game.paused && /^[1-7]$/.test(event.key) {
        event.preventDefault();
        hitGhost(targets[Number(event.key) - 1]);
    }
    if (event.key === 'Tab') keepOverLayFocus(event);
});

function keepOverlayFocus(event) {
    const overLay = document.querySelector('.overlay:not([hidden])');
    if (!overlay) return;
    const controls = Array.from(overlay.querySelectorAll('buttom, input')).filter(function (control) {
        return !control.disabled && control.getClientRects().length > 0;
    });
}

const first = controls[0];
    const last = controls[controls.length - 1];
    const active = document.activeElement;
    const outside = !overlay.contains(active);
    if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
    }
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden && game.running && !game.paused) togglePause();
});

document.getElementById('how').addEventListener('click', function () {
    const help = document.getElementById('help');
    help.hidden = !help.hidden;
    this.setAttribute('aria-expanded', String(!help.hidden));
});
