import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainMenu = ({ navigation }) => {
  const handleTimerButtonPress = () => {
    navigation.navigate('Timer');
    console.log('Timer button pressed');
  };

  const handleSetUpTaskButtonPress = () => {
    navigation.navigate('TaskCalendar');
    console.log('Set Up a Task button pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTimerButtonPress}>
        <Text style={styles.buttonText}>Timer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSetUpTaskButtonPress}>
        <Text style={styles.buttonText}>Set Up a Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainMenu;