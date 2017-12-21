import { h, Component } from 'preact';

import Timer from '../../components/timer';

export default class Home extends Component {
  render() {
    return (
      <div class="sans-serif">
        <Timer />
      </div>
    );
  }
}
