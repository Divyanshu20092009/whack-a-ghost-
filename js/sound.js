
const sound = { enabled: true, context: null, voices: new Set() };
const soundNotes = {
    pop: [{ startFrequency: 260, endFrequency: 470, duration: .06, delay: 0 }],
    hit: [
        { startFrequency: 600, endFrequency: 850, duration: .07, delay: 0 },
        { startFrequency: 850, endFrequency: 1050, duration: .05, delay: .05 }
    ],
    wrong: [{ startFrequency: 160, endFrequency: 80, duration: .18, delay: 0 }],
    over: [
        { startFrequency: 400, endFrequency: 400, duration: .12, delay: 0 },
        { startFrequency: 320, endFrequency: 320, duration: .12, delay: .14 },
        { startFrequency: 220, endFrequency: 180, duration: .25, delay: .28 }
    ]
};

try {
    sound.enabled = localStorage.getItem('whackTheGhost.sound') !== 'off';
} catch (error) {}

function unlockSound() {
    if (!sound.enabled) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!sound.context) sound.context = new AudioContextClass();
        if (sound.context.state === 'suspended') {
            sound.context.resume().catch(function () {});
        }
    } catch (error) {}
}

function playSound(name) {
    if (!sound.enabled || !sound.context || sound.context.state !== 'running') return false;
    const context = sound.context;
    for (const note of soundNotes[name]) {
        const oscillator = context.createOscillator();
        const volume = context.createGain();
        const start = context.currentTime + note.delay;
        oscillator.type = 'sine';
        if (name === 'wrong') oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(note.startFrequency, start);
        oscillator.frequency.linearRampToValueAtTime(note.endFrequency, start + note.duration);
        volume.gain.setValueAtTime(0, start);
        volume.gain.linearRampToValueAtTime(.035, start + .008);
        volume.gain.linearRampToValueAtTime(0, start + note.duration);
        oscillator.connect(volume);
        volume.connect(context.destination);
        sound.voices.add(oscillator);
        oscillator.onended = function () {
            sound.voices.delete(oscillator);
            oscillator.disconnect();
            volume.disconnect();
        };
        oscillator.start(start);
        oscillator.stop(start + note.duration + .01);
    }
    return true;
}

function stopSounds() {
    for (const voice of sound.voices) {
        try {
            voice.stop();
        } catch (error) {}
    }
    sound.voices.clear();
}

function toggleSound() {
    sound.enabled = !sound.enabled;
    if (sound.enabled) {
        unlockSound();
    } else {
        stopSounds();
    }
    try {
        localStorage.setItem('whackTheGhost.sound', sound.enabled ? 'on' : 'off');
    } catch (error) {}
    updateSoundButtons();
}

function updateSoundButtons() {
    let label = 'SOUND OFF';
    if (sound.enabled) label = 'SOUND ON';
    document.querySelectorAll('.sound-toggle').forEach(function (button) {
        button.textContent = label;
        button.setAttribute('aria-pressed', String(sound.enabled));
    });
}
