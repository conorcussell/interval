import { h, Component } from 'preact';

import Stopwatch from 'timer-stopwatch';

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      role="button"
      class="f3 dark-gray br-100 h4 w4 ba bw2 b--dark-gray bg-transparent ttu outline-0 b"
    >
      {children}
    </button>
  );
};

// TODO: make this show one leading zero;

function formatTime(ms) {
  let seconds = ms / 1000;
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  return `${hours ? hours + ':' : ''}${
    minutes ? minutes + ':' : ''
  }${seconds.toFixed(1)}`;
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

    this.timer.onTime(this.handleTimeChange.bind(this));
  }

  stop() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
    this.timer = new Stopwatch(this.state.time, {
      refreshRateMS: 100,
      almostDoneMS: 1000
    });
    this.timer.start();

    this.setState({
      interval: 'REST'
    });

    this.timer.onTime(this.handleTimeChange.bind(this));
    this.timer.onAlmostDone(function() {
      console.log('works?');
    });
    this.timer.onDone(this.start.bind(this));
  }

  handleTimeChange(time) {
    this.setState({
      time: time.ms
    });
  }

  handleAlmostDone(time) {
    console.log('make a sound');
  }

  handleCancel() {
    this.timer.reset();
    this.timer = null;
    this.setState({
      interval: null,
      time: null
    });
  }

  render(props, state) {
    const { interval, time } = state;

    let bg = 'bg-dark-gray';

    switch (interval) {
      case 'WORK':
        bg = 'bg-green';
        break;
      case 'REST':
        bg = time > 5000 ? 'bg-red' : 'bg-dark-red';
        break;
    }

    return (
      <div class="vh-100">
        <div class={`vh-50 flex items-center justify-around ${bg}`}>
          <div class="white h4 relative w-100">
            <h1 class="ma0 ttu tc">{interval || ' '}</h1>
            <p class="f-5 ttu ma0 absolute bottom-0 tc w-100 code">
              {formatTime(state.time) || ' '}
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
              class="absolute bottom-1 f4 black bn bg-transparent outline-0"
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
