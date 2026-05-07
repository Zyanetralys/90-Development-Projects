<!DOCTYPE html>
<html>
<head>
  <title>Himno</title>
</head>
<body>
  <h1>Himno</h1>
  <button onclick="playEpicHymn()">Reproducir Himno</button>

  <script>
    function playEpicHymn() {
      const context = new (window.AudioContext || window.webkitAudioContext)();

      // reproducir acordes
      function playChord(frequencies, duration, startTime) {
        frequencies.forEach(freq => {
          const oscillator = context.createOscillator();
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(freq, startTime);

          const gainNode = context.createGain();
          gainNode.gain.setValueAtTime(0.9, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + duration / 1000);

          oscillator.connect(gainNode);
          gainNode.connect(context.destination);
          oscillator.start(startTime);
          oscillator.stop(startTime + duration / 1000);
        });
      }

      let startTime = context.currentTime;
      const beat = 400; // duración base de un compás

      // Intro
      const intro = [
        [130.81, 196.00, 261.63],
        [164.81, 220.00, 293.66],
        [196.00, 261.63, 329.63],
        [220.00, 293.66, 349.23]
      ];
      intro.forEach(chord => {
        playChord(chord, beat, startTime);
        startTime += beat / 1000;
      });

      // Ascenso
      const ascent = [
        [261.63, 329.63, 392.00],
        [293.66, 349.23, 440.00],
        [329.63, 392.00, 493.88],
        [349.23, 440.00, 523.25]
      ];
      ascent.forEach(chord => {
        playChord(chord, beat, startTime);
        startTime += beat / 1000;
      });

      // Clímax
      const climax = [
        [440.00, 523.25, 659.25],
        [493.88, 587.33, 698.46],
        [523.25, 659.25, 783.99],
        [587.33, 698.46, 880.00]
      ];
      climax.forEach(chord => {
        playChord(chord, beat, startTime);
        startTime += beat / 1000;
      });

      // Descenso
      const descent = [
        [523.25, 440.00, 349.23],
        [493.88, 392.00, 329.63],
        [440.00, 349.23, 261.63],
        [392.00, 329.63, 196.00]
      ];
      descent.forEach(chord => {
        playChord(chord, beat, startTime);
        startTime += beat / 1000;
      });

      // Final
      const finale = [
        [261.63, 329.63, 392.00, 523.25],
        [261.63, 329.63, 392.00, 523.25],
        [130.81, 196.00, 261.63, 392.00]
      ];
      finale.forEach(chord => {
        playChord(chord, beat, startTime);
        startTime += beat / 1000;
      });
    }
  </script>
</body>
</html>
