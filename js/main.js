
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

homeButton.addEventListener('click', function () {
    stopGame();
    showScreen('home');
});

document.getElementById('again').addEventListener('click', startGame);

document.getElementById('result-home').addEventListener('click', function () {
    showScreen('home');
});

holes.inert = true;
updateScoreboard();

document.getElementById('how').addEventListener('click', function () {
    const help = document.getElementById('help');
    help.hidden = !help.hidden;
    this.setAttribute('aria-expanded', String(!help.hidden));
});
