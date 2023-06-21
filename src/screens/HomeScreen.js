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
      <TouchableOpacity
        style={styles.images}
        onPress={handleTimerButtonPress}>
        <Image source={require('../../assets/Tomato-simple.png')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.images}
        onPress={handleSetUpTaskButtonPress}>
        <Image source={require('../../assets/Tomato-task-b.png')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#ffffff',
  },
  images:{
    alignSelf: 'center'
  },
});

export default MainMenu;