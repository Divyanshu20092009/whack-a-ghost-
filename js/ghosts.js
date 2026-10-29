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
        const effect = document.createElement('span');
        effect.className = 'hit-effect';
        effect.setAttribute('aria-hidden', 'true');
        hole.append(effect);
        const target = { button, effect, effectRemaining: 0, active: false, hit: false, remaining: 0 };
button.addEventListener('click', function () { hitGhost(target); });
targets.push(target); 
    });
}

function chooseTargetType() {
    const progress = 1 - game.remaining / (game.duration * 1000); 
    if (progress < .2) return 'normal';
    const chance = Math.random();
    if (chance < .13) return 'golden';
    if (chance < .29) return 'pumpkin';
    return 'normal';
}

function spawnGhost(type = chooseTargetType()) {
    if (!game.running || game.paused) return;
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
    target.type = type;
    const progress = 1 - game.remaining / (game.duration * 1000 ); 
    target.remaining = 1550 - progress * 550;
    if (type === 'golden') target.remaining -= 220;
    target.button.disabled = false;
    let sprite = 'ghost';
    let label = 'Ghost, one point';
    if (type === 'golden') {
        sprite = 'golden-ghost';
        label = 'Golden ghost, three points';
    }
    else if (type === 'pumpkin') {
        sprite = 'pumpkin';
        label = 'Pumpkin, avoid';
    }
    target.button.setAttribute('aria-label', label + ', hole ' + (previousHole + 1));
    target.button.querySelector('img').src = 'assets/images/' + sprite + '.png';
    target.button.className = 'target visible';
    playSound('pop');
}


function hideGhost(target) {
    target.active = false;
    target.button.disabled = true;
    target.button.className = 'target';
}


function updateGhosts(elapsed) {
    targets.forEach(function (target) {
        if (target.effectRemaining > 0) {
            target.effectRemaining -= elapsed;
            if (target.effectRemaining <= 0) target.effect.className = 'hit-effect';
        }
        if (!target.active) return;
        target.remaining -= elapsed;
        if (target.remaining <= 0) {
            if (!target.hit && target.type !== 'pumpkin') {
                game.misses++;
                game.combo = 0;
                updateScoreboard();
            }
            hideGhost(target);
        }
    });

}


function hitGhost(target) {
    if (!game.running || game.paused ||  !target.active || target.hit) return;
    tick();
    if (!game.running || game.paused ||  !target.active || target.hit) return;
    target.hit = true;
    target.remaining = 200;
    target.button.disabled = true;
    target.button.classList.add('hit');
    if ( target.type !== 'pumpkin') {
        let image = 'ghost-hit.png';
        if (target.type === 'golden') image = 'golden-ghost-hit.png';
        target.button.querySelector('img').src = 'assets/images/' + image;
    }
    recordHit(target);
    let points = '+1';
    if (target.type === 'golden') points = '+3';
    if (target.type === 'pumpkin') points = '-2';
    target.effect.textContent = points;
    target.effect.className = 'hit-effect show';
    target.effect.classList.toggle('penalty', target.type === 'pumpkin');
    target.effectRemaining = 550;
    playSound(target.type === 'pumpkin' ? 'wrong' : 'hit');
}

function clearGhosts() {
    targets.forEach(hideGhost);
    targets.forEach(function (target) {
        target.effectRemaining = 0;
        target.effect.className = 'hit-effect';
    });
    previousHole = -1;
}