import React, { Component, PropTypes } from 'react';

const ATOM_NAME = 'timer';
const DEFAULT_TIMER = 5000; // Default GAME LENGTH
const ELAPSE_TIME = 1000; // EVERY 1 second
export default class Timer extends Component {
  constructor(props) {
    super(props);

    const {
      count = DEFAULT_TIMER,
      onComplete
    } = props;

    this.tick = null;
    this.state = {
      count : parseInt(count / ELAPSE_TIME, 0),
    };
  }

  componentDidMount() {
    this.tick = window.setInterval(() => {
      this.setState((prevState) =>  {
        return {
          count: --prevState.count,
        }
      }, () => {
          if (this.state.count === 0) {
            window.clearInterval(this.tick);
            if (typeof this.props.onTimeout === "function") {
              this.props.onTimeout();
            }
          }
      });
    }, ELAPSE_TIME);
  }

  componentWillUnmount() {
      window.clearInterval(this.tick);
  }

  getFormattedTime (count) {
    const formttedSeconds = count % 60;
    return (`${formttedSeconds}`.length === 1) ? `0${formttedSeconds}` : formttedSeconds;
  }

  render() {
    const {
      className = "",
      formattedText = "",
      prefixText = "",
    } = this.props;

    const {
      count,
    } = this.state;

    const formattedTime = this.getFormattedTime(count);
    return (

      <div className={`${ATOM_NAME} ${className}`}>
          <span className={`${ATOM_NAME}__prefix-text`}>{prefixText}</span>
          <span className={`${ATOM_NAME}__seconds`}>{formattedTime}</span>
          <span className={`${ATOM_NAME}__formatter-unit`}>{formattedText}</span>
      </div>
    );
  }
}


Timer.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
  onComplete: PropTypes.func,
};

Timer.defaultProps = {
  count: 5000,
  prefixText: "Time left",
  formattedText: "Seconds",
  className: "defualt-timer",
}
