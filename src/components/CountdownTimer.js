import React from "react";
import {Vibration} from 'react-native'
import ClockView from "./ClockView";

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    const fullTime = this.getCountdownTime({
      minutes: props.time.minutes,
      seconds: props.time.seconds,
    });
    this.state = {
      time: fullTime,
      type: props.time.type,
      timeOverCallback: props.onCountdownComplete,
    };
  }

  updateTimer = (timeObject) => {
    const fullTime = this.getCountdownTime({
      minutes: timeObject.minutes,
      seconds: timeObject.seconds,
    });
    this.setState({
      time: fullTime,
      type: timeObject.type,
    });
  };

  getCountdownTime = (object) => {
    return this.minutesToSeconds(object.minutes) + object.seconds;
  };

  minutesToSeconds = (minutes) => {
    return minutes * 60;
  };

  secondsToMinutes = (seconds) => {
    return Math.floor(seconds / 60);
  };

  secondsToTimeObject = (seconds) => {
    const minutes = this.secondsToMinutes(seconds);
    const convertedSeconds = seconds - this.minutesToSeconds(minutes);

    return {
      minutes: minutes,
      seconds: convertedSeconds,
      type: this.state.type,
    };
  };

  startCountdown = () => {
    this.timer = setInterval(this.decreaseCount, 1000);
  };

  stopCountdown = () => {
    clearInterval(this.timer);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  decreaseCount = () => {
    if (this.state.time === 0) {
      this.state.timeOverCallback();
    } else {
      this.setState((prevState) => ({ time: prevState.time - 1 }));
      if (this.state.time === 0) {
        Vibration.vibrate([500, 500, 500])
      }
    }
  };

  render() {
    return <ClockView time={this.secondsToTimeObject(this.state.time)} />;
  }
}

export default CountdownTimer;