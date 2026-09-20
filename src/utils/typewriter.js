export function createTypewriter(element, phrases, clock = window) {
  let running = false;
  let timer;
  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function step() {
    if (!running) return;
    const phrase = phrases[phraseIndex];
    characterIndex += deleting ? -1 : 1;
    element.textContent = phrase.slice(0, characterIndex);
    let delay = deleting ? 40 : 85;
    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      delay = 4200;
      element.classList.remove('is-typing');
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 100;
    } else {
      element.classList.add('is-typing');
    }
    timer = clock.setTimeout(step, delay);
  }

  function stop() {
    running = false;
    clock.clearTimeout(timer);
    element.textContent = phrases[0];
    element.classList.remove('is-typing');
  }

  return {
    stop,
    setEnabled(enabled) {
      if (!enabled) return stop();
      if (running) return;
      running = true;
      phraseIndex = 0;
      characterIndex = phrases[0].length;
      deleting = true;
      element.textContent = phrases[0];
      element.classList.remove('is-typing');
      timer = clock.setTimeout(step, 4200);
    },
  };
}
