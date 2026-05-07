<!DOCTYPE html>
<html>
<head>
  <title>Himno</title>
</head>
<body>
  <h1>Himno</h1>
  <button onclick="playExtendedHymn()">Reproducir Himno</button>

  <script>
    function playExtendedHymn() {
      const context = new (window.AudioContext || window.webkitAudioContext)();

      // Base de notas graves y altas para la épica
      const baseNotes = [
        130.81, 164.81, 196.00, 220.00,
        261.63, 293.66, 329.63, 349.23,
        392.00, 440.00, 493.88, 523.25,
        587.33, 659.25, 698.46, 783.99
      ];

      // Duraciones en ms
      const durations = [300, 400, 500, 600, 700];

      // Construcción del himno largo con variaciones
      let hymn = [];

      for (let i = 0; i < 10; i++) { // 10 bloques de sección épica
        for (let j = 0; j < baseNotes.length; j++) {
          let duration = durations[Math.floor(Math.random() * durations.length)];
          hymn.push({ freq: baseNotes[j], duration: duration });
        }
      }

      // Añadimos un clímax final más largo
      const climaxNotes = [523.25, 659.25, 783.99, 880.00, 987.77];
      for (let i = 0; i < 5; i++) {
        hymn.push({ freq: climaxNotes[i], duration: 600 });
      }
      hymn.push({ freq: 783.99, duration: 800 });
      hymn.push({ freq: 659.25, duration: 800 });
      hymn.push({ freq: 523.25, duration: 1000 });
      hymn.push({ freq: 440.00, duration: 1200 });
      hymn.push({ freq: 392.00, duration: 1500 });

      let startTime = context.currentTime;

      hymn.forEach(note => {
        const oscillator = context.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(note.freq, startTime);

        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(0.9, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + note.duration / 1000);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration / 1000);

        startTime += note.duration / 1000;
      });
    }
  </script>
</body>
</html>
