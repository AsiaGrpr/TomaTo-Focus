import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from "react-native";
import CountdownTimer from "./CountdownTimer";
import Controls from "./Controls";
import ConfigTimerInput from "./ConfigTimerInput";
import Constants from "expo-constants";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTimerIdx: 0,
      timers: [
        { minutes: 0, seconds: 10, type: "Work" },
        { minutes: 0, seconds: 5, type: "Break" },
      ],
      isTimerRunning: false,
      isTimerPaused: false,
    };
  }

  onUpdateTimerConfig = (timerObject) => {
    timerObject = this.validateTimerObject(timerObject);
    const newTimers = this.state.timers.map((timer) => {
      if (timer.type === timerObject.type) {
        return timerObject;
      } else {
        return timer;
      }
    });
    this.setState({ timers: newTimers });
  };

  validateTimerObject = (timerObject) => {
    if (isNaN(parseInt(timerObject.seconds))) {
      timerObject.seconds = 0;
    } else if (timerObject.seconds > 59) {
      timerObject.seconds = 59;
    } else if (isNaN(parseInt(timerObject.minutes))) {
      timerObject.minutes = 0;
    }
    return timerObject;
  };

  onCountdownComplete = () => {
    this.setState(
      (previousState) => ({
        currentTimerIdx: previousState.currentTimerIdx + 1,
      }),
      () => {
        this._timer.updateTimer(
          this.state.timers[
            this.state.currentTimerIdx % this.state.timers.length
          ]
        );
      }
    );
  };

  startStopButtonPress = () => {
    if (this.state.isTimerPaused && !this.state.isTimerRunning) {
      this.startTimer();
    } else if (this.state.isTimerRunning) {
      this.stopTimer();
    } else {
      // fresh start
      this.resetTimer();
      this.startTimer();
    }
  };

  resetTimer = () => {
    if (this.state.isTimerRunning) {
      this.stopTimer();
      this.setState({ currentTimerIdx: 0, isTimerPaused: false });
    }
    this._timer.updateTimer(this.state.timers[0]);
  };

  startTimer = () => {
    this.setState({ isTimerRunning: true });
    this._timer.startCountdown();
  };

  stopTimer = () => {
    this.setState({ isTimerRunning: false, isTimerPaused: true });
    this._timer.stopCountdown();
  };

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView>
          <ScrollView contentContainerStyle={styles.scrollviewContentContainer}>
            <Text style={styles.appHeaderText}>Pomodoro Timer</Text>
            <CountdownTimer
              time={this.state.timers[this.state.currentTimerIdx]}
              onCountdownComplete={this.onCountdownComplete}
              ref={(ref) => {
                this._timer = ref;
              }}
            />
            <Controls
              onStartPausePress={this.startStopButtonPress}
              onResetPress={this.resetTimer}
              isTimerRunning={this.state.isTimerRunning}
            />
            <View style={styles.container}>
              {this.state.timers.map((e, idx) => {
                return (
                  <ConfigTimerInput
                    key={idx}
                    data={e}
                    onUpdate={this.onUpdateTimerConfig}
                  />
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5,
  },
  scrollviewContentContainer: {
    paddingTop: Constants.statusBarHeight,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  appHeaderText: {
    fontWeight: "bold",
    fontSize: 40,
    margin: 7,
    padding: 5,
    alignSelf: "center",
    color: "#000",
  },
});