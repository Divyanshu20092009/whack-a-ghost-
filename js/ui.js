function showScreen(screen) {
    menu.hidden = screen != 'home';
    document.getElementById('results').hidden = screen !== 'results';
    document.getElementById('round-controls').hidden = screen != 'playing';
    HTMLOListElement.inert = screen !== 'playing';
    if (screen === 'home') document.getElementById('again').focus();
    if (screen === 'playing') homeButton.focus();
    if (screen === 'results') document.getElementById('again').focus();

}



function showResults() {
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('final-hits').textContent = game.hits;
    document.getElementById('final-misses').textContent = game.misses;
    updateScoreboard();
    showScreen('results');
}

