import { h, Component } from 'preact';

import Stopwatch from 'timer-stopwatch';

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      role="button"
      class="f3 dark-gray br-100 h4 w4 ba bw2 b--dark-gray bg-transparent ttu"
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
    this.timer = new Stopwatch(this.state.time, { refreshRateMS: 100 });
    this.timer.start();

    this.setState({
      interval: 'REST'
    });

    this.timer.onTime(this.handleTimeChange.bind(this));
    this.timer.onDone(this.start.bind(this));
    this.timer.onAlmostComplete();
  }

  handleTimeChange(time) {
    this.setState({
      time: time.ms
    });
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
    const { interval } = state;
    return (
      <div class="vh-100">
        <div class="vh-50 bg-dark-gray flex items-center justify-around">
          <div class="white h4 relative w-100">
            <h1 class="ma0 ttu tc">{interval || ' '}</h1>
            <p class="f-5 ttu ma0 absolute bottom-0 tc w-100">
              {formatTime(state.time) || ' '}
            </p>
          </div>
        </div>
        <div class="vh-50 flex items-center justify-around relative">
          {/* TODO: don't show the button when on a rest period */}
          <Button onClick={this.toggle.bind(this)}>
            {interval === 'WORK' ? 'Stop' : 'Start'}
          </Button>

          <button
            class="absolute bottom-1 f4 black bn bg-transparent"
            onClick={this.handleCancel.bind(this)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
