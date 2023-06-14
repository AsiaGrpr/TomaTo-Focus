import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const test = () => {
  return (
    <View style={styles.container}>
      <Text>Login</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default test;