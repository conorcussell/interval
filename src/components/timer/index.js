import { h, Component } from 'preact';

import Stopwatch from 'timer-stopwatch';

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      role="button"
      class="pointer f3 dark-gray br-100 h4 w4 ba bw2 b--dark-gray bg-transparent ttu outline-0 b"
    >
      {children}
    </button>
  );
};

function formatTime(ms) {
  let seconds = ms / 1000;
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  return `${hours ? hours.toString().padStart(2, '0') + ':' : ''}${
    minutes ? minutes.toString().padStart(2, '0') + ':' : ''
  }${minutes ? seconds.toFixed(1).padStart(4, '0') : seconds.toFixed(1)}`;
}

export default class Header extends Component {
  state = {
    interval: null,
    time: null
  };

  timer = null;

  toggle() {
    this.state.interval === 'WORK' ? this.stop() : this.start();
  }

  setColor(color) {
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute('content', color);
  }

  start() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }

    this.timer = new Stopwatch(null, { refreshRateMS: 100 });
    this.timer.start();

    this.setState({
      interval: 'WORK'
    });

    this.setColor('#19a974');

    this.timer.onTime(this.handleTimeChange.bind(this));
  }

  stop() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
    this.timer = new Stopwatch(this.state.time, {
      refreshRateMS: 100,
      almostDoneMS: 10000
    });
    this.timer.start();

    this.setState({
      interval: 'REST'
    });

    this.setColor('#e7040f');

    this.timer.onTime(this.handleTimeChange.bind(this));
    this.timer.onDone(this.start.bind(this));
  }

  playBeep(beep = 'short') {
    this[beep].play();
  }

  handleTimeChange(time) {
    this.setState({
      time: time.ms
    });

    // we are in a rest period so lets count down the last 5 seconds. This is JavaScript so times are a bit mental..
    if (this.state.interval === 'REST' && time.ms < 6000 && time.ms > 800) {
      if (time.ms % 1000 < 100) {
        this.playBeep(time.ms > 1200 ? 'short' : 'long');
      }
    }
  }

  handleCancel() {
    this.timer.reset();
    this.timer = null;
    this.setState({
      interval: null,
      time: null
    });
    this.setColor('#333');
  }

  render(props, state) {
    const { interval, time } = state;

    let bg = 'bg-dark-gray';

    switch (interval) {
      case 'WORK':
        bg = 'bg-green';
        break;
      case 'REST':
        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute('content', '#e7040f');
        bg = time > 5000 ? 'bg-red' : 'bg-dark-red';
        break;
    }

    let formattedTime = formatTime(state.time) || ' ';

    let fontSize =
      typeof window !== 'undefined' && window.innerWidth < 340 ? 'f1' : 'f-5';

    return (
      <div class="vh-100">
        <audio ref={el => (this.short = el)}>
          <source src="./assets/beep.wav" type="audio/wav" />
          <source src="./assets/beep.mp3" type="audio/mp3" />
        </audio>
        <audio ref={el => (this.long = el)}>
          <source src="./assets/longBeep.wav" type="audio/wav" />
          <source src="./assets/longBeep.mp3" type="audio/mp3" />
        </audio>
        <div class={`vh-50 flex items-center justify-around ${bg}`}>
          <div class="white h4 relative w-100">
            <h1 class="ma0 ttu tc">{interval || ' '}</h1>
            <p
              class={`f-5 ttu ma0 absolute bottom-0 tc w-100 code ${fontSize}`}
            >
              {formattedTime}
            </p>
          </div>
        </div>
        <div class="vh-50 flex items-center justify-around relative">
          {interval !== 'REST' && (
            <Button onClick={this.toggle.bind(this)}>
              {interval === 'WORK' ? 'Stop' : 'Start'}
            </Button>
          )}

          {interval && (
            <button
              class="pointer absolute bottom-1 f4 black bn bg-transparent outline-0"
              onClick={this.handleCancel.bind(this)}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  }
}
