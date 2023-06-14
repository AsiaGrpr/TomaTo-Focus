import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

const ClockView = (props) => {
  return (
    <View style={styles.clockviewContainer}>
      <Text style={styles.clockViewHeader}>{props.time.type} Time</Text>
      <Text style={styles.timeText}>
        {props.time.minutes}:{padZero(props.time.seconds)}
      </Text>
    </View>
  );
};

ClockView.propTypes = {
  time: PropTypes.shape({
    type: PropTypes.string.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
};

ClockView.defaultProps = {
  time: {
    type: "Default",
    minutes: 0,
    seconds: 0,
  },
};

const padZero = (number) => {
  if (number.toString().length === 1) {
    return "0" + number.toString();
  } else {
    return number;
  }
};

const styles = StyleSheet.create({
  clockviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },

  clockViewHeader: {
    textAlign: "center",
    fontSize: 30,
    margin: 2,
    color: "#000000",
  },

  timeText: {
    fontSize: 35,
    margin: 1,
    color: "#000000",
  },
});

export default ClockView;