'use strict';

const high_icon = '<span class="material-icons">north</span>';
const low_icon = '<span class="material-icons">south</span>';
const correct_icon = '<span class="material-icons">done</span>';

class Game {
  constructor() {
    this.target = this.generate_number();
  }

  generate_number(range=1000) {
    return Math.round(Math.random() * 100);
  }

  process_guess(input) {
    if(input == this.target) {
      return 'Correct';
    } else if(input > this.target) {
      return 'Too high';
    } else {
      return 'Too low';
    }
  }

  end() {
    document.getElementById('submit').setAttribute('disabled', true);
    document.getElementById('guess').setAttribute('disabled', true);
    document.body.classList.add('game-over');
  }
}

function createListItem(guess, text) {
  function build_text(icon) {
    return `<div class="entry"><span class="guess">${guess}</span>: ${icon} <span class="message">${text}</span></div>`;
  }

  let list = document.getElementById('previous-guesses');
  let li = document.createElement('li');
  if (text == 'Correct') {
    li.classList.add('correct');
    text = build_text(correct_icon);
  } else if (text == 'Too high') {
    li.classList.add('high');
    text = build_text(high_icon);
  } else {
    li.classList.add('low');
    text = build_text(low_icon);
  }
  li.innerHTML = text;
  list.appendChild(li);
}

window.addEventListener('load', function () {

  // initialize
  let game = new Game();
  let feedback = document.getElementById('feedback');
  let guess_el = document.getElementById('guess');
  guess_el.value = '';
  guess_el.focus();

  // play the game
  document.getElementById('submit').addEventListener('click', () => {
    let guess = guess_el.value * 1;
    let result = game.process_guess(guess);
    let result_str;
    createListItem(guess, result);
    if(result == 'Correct') {
      feedback.className = 'correct';
      result_str = `${correct_icon} ${result}`;
    } else if (result == 'Too high') {
      feedback.className = 'high';
      result_str = `${high_icon} ${result}`;
    } else {
      feedback.className = 'low';
      result_str = `${low_icon} ${result}`;
    }
    feedback.innerHTML = result_str;
    if(result == 'Correct') game.end();
    guess_el.value = '';
    guess_el.focus();
  });

  // restart the game
  document.getElementById('restart').addEventListener('click', () => {
    game = new Game();
    document.getElementById('previous-guesses').innerHTML = '';
    document.getElementById('submit').removeAttribute('disabled');
    document.getElementById('guess').removeAttribute('disabled');
    feedback.className = '';
    guess_el.value = '';
    guess_el.focus();
  });

  // prevent the form from being submitted
  document.getElementById('guess-form').addEventListener('submit', (e) => {
    e.preventDefault();
    return true;
  });
});
