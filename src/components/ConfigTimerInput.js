import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const ConfigTimerInput = (props) => {
  return (
    <View style={style.configInputContainer}>
      <Text style={style.typeText}>{props.data.type} Time(MM:SS): </Text>
      <TextInput
        style={style.inputField}
        defaultValue={`${props.data.minutes}`}
        onChangeText={(text) => {
          props.data.minutes = parseInt(text);
          props.onUpdate(props.data);
        }}
        placeholder="Minutes"
        keyboardType="numeric"
      />
      <Text> : </Text>
      <TextInput
        style={style.inputField}
        defaultValue={`${props.data.seconds}`}
        onChangeText={(text) => {
          props.data.seconds = parseInt(text);
          props.onUpdate(props.data);
        }}
        maxLength={2}
        placeholder="Seconds"
        keyboardType="numeric"
      />
    </View>
  );
};

ConfigTimerInput.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }),
};

const style = StyleSheet.create({
  configInputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 5,
    padding: 5,
  },
  inputField: {
    margin: 4,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#000",
    padding: 5,
  },
  typeText: {
    fontWeight: "bold",
    marginHorizontal: 5,
    color: "#000000",
  },
});

export default ConfigTimerInput;