const States = Object.freeze({
  PLAYBACK: 'PLAYBACK',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER',
  INITIAL: 'INITIAL',
  WRONG: 'WRONG',
  RIGHT: 'RIGHT'
});

var state = {
  currentState: States.INITIAL,
  playbackDone: function () {
    this.currentState = States.PLAYING;
    display.hdgDisplay();
  },
  wrongAnswer: function () {
    scoring.reset();
    this.currentState = States.GAMEOVER;
    display.hdgDisplay();
  },
  rightAnswer: function () {
    scoring.update();
    this.currentState = States.PLAYBACK;
    display.hdgDisplay();
    challenge.nextTick();
    display.displayCurrent();
  },
  start: function () {
    this.currentState = States.PLAYBACK;
    display.hdgDisplay();
    challenge.nextTick();
    display.displayCurrent();
  }
}

function addClick (ele) {
  if (state.currentState == States.PLAYING) {
    display.change(ele);
    challenge.played.push(ele.id);
    challenge.checkLength();
  }
}

var display = {
  interval: '',
  ctr: 0,
  playback: function () {
    if (challenge.toPlay[this.ctr] == 1) {
      this.change(btn1);
    } else if (challenge.toPlay[this.ctr] == 2) {
      this.change(btn2);
    } else if (challenge.toPlay[this.ctr] == 3) {
      this.change(btn3);
    } else if (challenge.toPlay[this.ctr] == 4) {
      this.change(btn4);
    }
    this.ctr++;
  },
  displayCurrent: function () {
    hdgScore.innerHTML = 'Score: ' + scoring.score;
    this.interval = setInterval(function () { display.playback() }, 1000);
    setTimeout(function () { display.displayDone() }, 1500 * challenge.toPlay.length)
  },
  displayDone: function () {
    clearInterval(this.interval);
    this.ctr = 0;
    state.playbackDone();
  },
  change: function (ele) {
    ele.classList.remove("animDisplay");
    void ele.offsetWidth; //This line somehow allows javascript to reflow the css animation and restart it
    ele.classList.add("animDisplay");
  },
  hdgDisplay: function () {
    hdgS.innerHTML = state.currentState;
  }
}

var scoring = {
  score: 0,
  reset: function () {
    this.score = 0;
  },
  update: function () {
    this.score++;
  }
}

var challenge = {
  toPlay: [],
  played: [],
  ctr: 0,
  displayCtr: 0,
  interval: '',
  nextTick: function () {
    this.toPlay.push(Math.floor((Math.random() * 4) + 1))
    this.ctr++;
  },
  checkOrder: function () {
    let flag = true;
    console.log('played: ' + this.played)
    for (let i = 0; i < this.played.length; i++) {
      if (this.played[i] != this.toPlay[i]) {
        flag = false;
      }
    }
    if (flag) {
      this.played = [];
      state.rightAnswer();
    } else {
      state.wrongAnswer();
    }
  },
  checkLength: function () {
    if (this.played.length == this.toPlay.length) {
      this.checkOrder();
    }
  }
}


const btn1 = document.getElementById('1');
const btn2 = document.getElementById('2');
const btn3 = document.getElementById('3');
const btn4 = document.getElementById('4');
const hdgS = document.getElementById('status');
const hdgScore = document.getElementById('score');
btn1.addEventListener('mousedown', function () { addClick(btn1) });
btn2.addEventListener('mousedown', function () { addClick(btn2) });
btn3.addEventListener('mousedown', function () { addClick(btn3) });
btn4.addEventListener('mousedown', function () { addClick(btn4) });
state.start();
