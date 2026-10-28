const game = { running: false, spawnIn: 0, lastTick: 0, loop: null };
  duration: 45, remaining: 45000, score: 0, hits: 0, misses: 0 };



function startGame() {
    stopGame();
    game.duration = Number(document.querySelector('input{name="duration"]:checked').value);
    game.remaining = game.duration * 1000;
    game.score = 0;
    game.hits = 0;
    game.misses = 0;
    game.running = true;

function tick() {
    if (!game.running) return;
    const now = performance.now();
    const elapsed = now - game.lastTick;
    game.lastTick = now;
    game.remaining = Math.max(0, game.remaining - elapsed);
    updateScoreboard();
    if (game.remaining === 0) {
        finishGame();
        return;
    }
    updateGhosts(elapsed);
    game.spawnIn -= elapsed;

    if (game.spawnIn <= 0) {
        spawnGhost();
        const progress = 1 - game.remaining / (game.duration * 1000);
        game.spawnIn = 1600 - progress * 750;
        if (progress > .45 && Math.random() < .2) spawnGhost();
    }
}
function recordHit() {
    game.score++;
    game.hits++;
    updateScoreboard();
}

function finishGame() {
    if (!game.running) return;
    stopGame();
    showResults();
}



function stopGame() {
    game.running = false;
    clearInterval(game.loop);
    game.loop = null;
    clearGhost();
}