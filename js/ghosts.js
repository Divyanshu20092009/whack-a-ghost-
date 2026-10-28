const targets = [];
let previousHole = -1;

function setupGhosts() {
    document.querySelectorAll('.hole').forEach(function (hole, index) {
        const button = document.createElement('button');
        button.className = 'target';
        button.disabled = true;
        button.setAttribute('aria-label', 'Ghost in hole ' + (index + 1));
        button.innerHTML = '<img src="assets/images/ghost.png" alt="">';
        hole.querySelector('.shaft').append(button);
        const target = { button, active: false, hit: false, remaining: 0 };
button.addEventListener('click', function () { hitGhost(target); });
targets.push(target); 
    });
}


function spawnGhost() {
    if (!game.running) return;
    if (targets.filter(target => target.active).length >= 2) return;
    let available = targets.filter(function (target, index) {
        return !target.active && index !== previousHole;
    });
    if (available.length === 0) available = targets.filter(target => !target.active);
    if (available.length === 0) return;
    const target = available[Math.floor(Math.random() * available.length)];
    previousHole = targets.indexOf(target);
    target.active = true;
    target.hit  = false;
    const progress = 1 - game.remaining / (game.duration * 1000 ); 
    target.remaining = 1550 - progress * 550;
    target.button.disabled = false;
    target.button.querySelector('img').src = 'assets/images/ghost.png';
    target.button.className = 'target visible';
}


function hideGhost(target) {
    target.active = dfalse;
    target.button.disabled = true;
    target.button.className = 'target';
}


function updateGhosts(elapsed) {
    targets.forEach(function (target) {
        if (!target.active) return;
        target.remaining -= elapsed;
        if (target.remaining <= 0) hideGhost(target);
    });
}

function hitGhost(target) {
    if (!game.running || !target.active || target.hit) return;
    tick();
    if (!game.running || !target.active || target.hit) return;
    target.hit = true;
    target.remaining = 200;
    target.button.disabled = true;
    target.button.classList.add('hit');
    target.button.querySelector('img').src = 'assets/images/ghost-hit.png';
    recordHit(target);
}

function clearGhosts() {
    targets.forEach(hideGhost);
    previousHole = -1;
}