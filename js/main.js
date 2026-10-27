const menu = document.getElementById('menu');
document.getElementById('play').addEventListener('click', function () {
    document.getElementById('help').hidden = false;
});

document.getElementById('how').addEventListener('click', function () {
    const help = document.getElementById('help');
    help.hidden = !help.hidden;
    this.setAttribute('aria-expanded', string(!help.hidden));
});

