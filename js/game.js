
const game = { running: false,
    paused: false,
    spawnIn: 0,
    lastTick: 0, 
    loop: null,
    duration: 45,
    remaining: 45000, 
    score: 0, 
    hits: 0, 
    misses: 0, 
    combo: 0, 
    highestCombo: 0,
    elapsed: 0, 
    bonusTime: 0, 
    bonusMessage: '', 
    bonusRemaining: 0,
    attempts: 0
};
const difficultySettings = {
    easy: { visibility: 250, interval: 0, description: 'Ghosts stay visible a little longer.'},
    normal: { visibility: 0, interval:0, description: 'The original ghost timing and pace.' },
    hard: { visibility: -150, interval: -100, description: 'Ghosts appear faster and hide sooner.' }
};

function startGame() {
    stopGame();
    unlockSound();
    game.difficulty = document.getElementById('difficulty').value;
    game.duration = Number(document.querySelector('input[name="duration"]:checked').value);
    game.remaining = game.duration * 1000;
    game.score = 0;
    game.hits = 0;
    game.attempts = 0;
    game.misses = 0;
    game.combo = 0;
    game.highestCombo = 0;
    game.elapsed = 0;
    game.bonusTime = 0;
    game.bonusMessage = '';
    game.bonusRemaining = 0;
    game.running = true;
    game.spawnIn = 150;
    game.lastTick = performance.now();
    game.loop = setInterval(tick, 16);
    showScreen('playing');
    updateScoreboard();
}

function tick() {
    if (!game.running || game.paused) return;
    const now = performance.now();
    const elapsed = now - game.lastTick;
    game.lastTick = now;
    game.remaining = Math.max(0, game.remaining - elapsed);
    game.elapsed += elapsed;
    game.bonusRemaining = Math.max(0, game.bonusRemaining - elapsed);
    updateScoreboard();
    if (game.remaining === 0) {
        finishGame();
        return;
    }
    updateGhosts(elapsed);
    game.spawnIn -= elapsed;
    if (game.spawnIn <= 0) {
        spawnGhost();
        const progress = roundProgress();
        game.spawnIn = 1600 - progress * 750 + difficultySettings[game.difficulty].interval;
        if (progress > .45 && Math.random() < .2) spawnGhost();
    }
}

function recordHit(target) {
    if (target.type === 'pumpkin') {
        game.score = Math.max(0, game.score - 2);
        game.combo = 0;
    } 
    else {
        if (target.type === 'time') {
            game.remaining += 3000;
            game.bonusTime += 3000;
            showBonus('+3s');
        }
        else {
        game.score += target.type === 'golden' ? 3 : 1;
        }
        game.hits++;
        game.combo++;
        game.highestCombo = Math.max(game.highestCombo, game.combo);
        if (game.combo % 5 === 0) {
            game.score += 2;
            showBonus('+2 bonus');
        } 
    }
    updateScoreboard();
}

function finishGame() {
    if (!game.running) return;
    stopGame();
    if (game.score > bestScore) {
        bestScore = game.score;
        try {
            localStorage.setItem('WhackTheGhost.best', String(bestScore));
        } catch (error) {}
        }
    showResults();
    playSound('over');
}

function stopGame() {
    game.running = false;
    game.paused = false;
    stopSounds();
    clearInterval(game.loop);
    game.loop = null;
    document.getElementById('pause').hidden = true;
    document.getElementById('yard').classList.remove('paused');
    document.getElementById('round-controls').inert = false;
    clearGhosts();
}

function togglePause() {
    if (!game.running) return;
    if (!game.paused) {
        tick();
        if (!game.running) return;
    }
    game.paused = !game.paused;
    if (game.paused) {
        stopSounds();
    } else {
        unlockSound();
    }
     game.lastTick = performance.now();
    document.getElementById('pause').hidden = !game.paused;
    document.getElementById('yard').classList.toggle('paused', game.paused);
    holes.inert = game.paused;
    document.getElementById('round-controls').inert = game.paused;
    if (game.paused) {
        document.getElementById('resume').focus();
    } else {
        document.getElementById('pause-button').focus();
    }
}

function roundProgress() {
    return Math.min(1, 1 - (game.remaining - game.bonusTime) / (game.duration * 1000));
}

function showBonus(message) {
    game.bonusMessage = message;
    game.bonusRemaining = 900;
}