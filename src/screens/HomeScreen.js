import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainMenu = ({ navigation }) => {
  const handleTimerButtonPress = () => {
    navigation.navigate('Timer');
    console.log('Timer button pressed');
  };

  const handleSetUpTaskButtonPress = () => {
    navigation.navigate('Task');
    console.log('Set Up a Task button pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity  onPress={handleTimerButtonPress}>
        <Image source={require('../../assets/Tomato-simple.png')} />
      </TouchableOpacity>

      <TouchableOpacity  onPress={handleSetUpTaskButtonPress}>
        <Image source={require('../../assets/Tomato-task-b.png')} />
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
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  Text: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    marginBottom: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainMenu;