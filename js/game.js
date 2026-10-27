const game = { running: false, spawnIn: 0, lastTick: 0, loop: null };

function startGame() {
    stopGame();
    game.running = true;
    game.spawnIn = 150;
    game.lastTick = performance.now();
    game.loop = setInterval(tick, 16);
}

function tick() {
    if (!game.running) return;
    const now = performance.now();
    const elapsed = now - game.lastTick;
    game.lastTick = now;
    updateGhosts(elapsed);
    game.spawnIn -= elapsed;

    if (game.spawnIn <= 0) {
        spawnGhost();
        game.spawnIn = 1600;
    }
}

function stopGame() {
    game.running = false;
    clearInterval(game.loop);
    game.loop = null;
    clearGhost();
}