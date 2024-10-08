consoleText(['Backend', 'FrontEnd', 'Generative AI', 'Data Structures & Algorithms', 'Competitive Programming'], 'text', ['#76d7c4', '#abb2bf', '#e06c75', '#61afef', '#c678dd']);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#ffffff']; // Default to white for space theme
  let visible = true;
  let con = document.getElementById('console');
  let letterCount = 1;
  let x = 1;
  let waiting = false;
  const target = document.getElementById(id);
  
  target.style.cssText = `color: ${colors[0]}; text-shadow: 0 0 10px ${colors[0]};`;

  window.setInterval(function () {
    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount);
      window.setTimeout(function () {
        let usedColor = colors.shift();
        colors.push(usedColor);
        let usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.style.cssText = `color: ${colors[0]}; text-shadow: 0 0 10px ${colors[0]};`;
        letterCount += x;
        waiting = false;
      }, 1200); // Slightly longer delay for word transition
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function () {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 1000);
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount);
      letterCount += x;
    }
  }, 150); // Slower typing speed to match the theme

  window.setInterval(function () {
    if (visible === true) {
      con.className = 'console-underscore hidden';
      visible = false;
    } else {
      con.className = 'console-underscore';
      visible = true;
    }
  }, 400); // Blinking effect for console underscore
}
