const menu = document.getElementById('menu');

const holes = document.getElementById('holes');
const homeButton = document.getElementById('home-button');

for (let i = 0; i < 7; i++ ) {
    const hole = document.getElement('div');
    hole.className = 'hole';
    hole.innerHTML = '<img class="hole-art" src="assets/images/hole.png"  alt=""><img class="rim" src="assets/images/hole-front.png" alt=""><div class="shaft"></div>';
    holes.append(hole);
}
document.getElementById('play').addEventListener('click', function () {
    document.getElementById('help').hidden = false;
    homeButton.focus();
});

homeButton.addEventListener('click', function () {
    menu.hidden = false;
    document.getElementById('round-controls').hidden = true;
    document.getElementById('play').focus();
});


document.getElementById('how').addEventListener('click', function () {
    const help = document.getElementById('help');
    help.hidden = !help.hidden;
    this.setAttribute('aria-expanded', string(!help.hidden));
});

