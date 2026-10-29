let bestScore = readBest();

function redBest() {
    try {
        const value = Number(localStorage.getItem('whackTheGhost.best'));
        if (Number.isFinite(value) && value >= 0) return Math.floor(value);
    } catch (error) {}
    return 0;
}




function updateScoreboard() {
    document.getElementById('best').textContent = bestScore;
    document.getElementById('score').textContent = game.score;
    let message = '';
    if (game.combo >= 3) message = game.combo + ' in a row';
    const status = document.getElementById('combo-status');
    if (status.textContent !== message) status.textContent = message;
    const seconds = Math.ceil(game.remaining / 1000);
    const timer = document.getElementById('timer');
    if (timer.dataset.seconds !== String(seconds)) {
        timer.innerHTML = seconds + '<small>s</small>';
        timer.dataset.seconds = seconds;
    }
}

function showScreen(screen) {
    menu.hidden = screen !== 'home';
    document.getElementById('results').hidden = screen !== 'results';
    document.getElementById('round-controls').hidden = screen !== 'playing';
    holes.inert = screen !== 'playing';
    if (screen === 'home') document.getElementById('play').focus();
    if (screen === 'playing') homeButton.focus();
    if (screen === 'results') document.getElementById('again').focus();
}

function showResults() {
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('final-best').textContent = bestScore;
    document.getElementById('final-hits').textContent = game.hits;
    document.getElementById('final-misses').textContent = game.misses;
    document.getElementById('final-combo').textContent = game.highestCombo;
    updateScoreboard();
    showScreen('results');
}
