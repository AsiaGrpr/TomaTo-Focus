import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Svg, Circle, G, Text as SvgText, Path } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


const Timer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [sessionCount, setSessionCount] = useState(4);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  useEffect(() => {
    setRemainingTime(workDuration);
  }, []);

  useEffect(() => {
    let timerInterval;

    if (isPlaying && remainingTime > 0) {
      timerInterval = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (isPlaying && remainingTime === 0) {
      setIsPlaying(false);
      handleTimerComplete();
    }

    return () => clearInterval(timerInterval);
  }, [isPlaying, remainingTime]);

  const handleStartTimer = () => {
    setIsPlaying(true);
  };

  const handlePauseTimer = () => {
    setIsPlaying(false);
  };

  const handleResetTimer = () => {
    setIsPlaying(false);
    setIsWorkTime(true);
    setRemainingTime(workDuration);
  };

  const handleTimerComplete = () => {
    setIsWorkTime(prev => !prev);

    if (isWorkTime) {
      setRemainingTime(breakDuration);
    } else {
      setSessionCount(prevCount => prevCount - 1);

      if (sessionCount === 1) {
        setSessionCount(4);
        setRemainingTime(workDuration);
      } else {
        setRemainingTime(workDuration);
      }
    }
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const totalDuration = isWorkTime ? workDuration : breakDuration;
    return (remainingTime / totalDuration) * 100;
  };

  const handleSettingsPress = () => {
    setIsSettingsModalVisible(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsModalVisible(false);
  };

  const handleWorkDurationChange = value => {
    setWorkDuration(value);
    setRemainingTime(value);
  };

  const handleBreakDurationChange = value => {
    setBreakDuration(value);
    if (!isWorkTime) {
      setRemainingTime(value);
    }
  };

  const handleSessionCountChange = value => {
    setSessionCount(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.circularButton}
        onPress={handleSettingsPress}
      >
        <AntDesign name="setting" size={45} color="white" />
      </TouchableOpacity>

      <Modal visible={isSettingsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Settings</Text>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Work Duration: {workDuration / 60} minutes</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={60}
                step={1}
                value={workDuration / 60}
                onValueChange={value => handleWorkDurationChange(value * 60)}
                minimumTrackTintColor={isWorkTime ? '#eb6956' : '#00bf63'}
                thumbTintColor={isWorkTime ? '#eb6956' : '#00bf63'}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Break Duration: {breakDuration / 60} minutes</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={60}
                step={1}
                value={breakDuration / 60}
                onValueChange={value => handleBreakDurationChange(value * 60)}
                minimumTrackTintColor={isWorkTime ? '#eb6956' : '#00bf63'}
                thumbTintColor={isWorkTime ? '#eb6956' : '#00bf63'}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Session Count: {sessionCount}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={sessionCount}
                onValueChange={value => handleSessionCountChange(value)}
                minimumTrackTintColor={isWorkTime ? '#eb6956' : '#00bf63'}
                thumbTintColor={isWorkTime ? '#eb6956' : '#00bf63'}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleSettingsClose}
              >
                <AntDesign name="closecircleo" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Svg width="200" height="200" style={styles.timerContainer}>
        <Circle
          cx="100"
          cy="100"
          r="90"
          fill="transparent"
          stroke="#ddd"
          strokeWidth="12"
        />
        <Circle
          cx="100"
          cy="100"
          r="90"
          fill="transparent"
          stroke={isWorkTime ? '#E60012' : '#00bf63'}

          strokeWidth="13"
          strokeDasharray="565.48"
          strokeDashoffset={565.48 - calculateProgress() * 5.6548}
          transform="rotate(-90 100 100)"
        />
      </Svg>
      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={isPlaying ? handlePauseTimer : handleStartTimer}
      >
        <View style={styles.buttonContainer}>
          {isPlaying ? (
            <Image source={require('../../assets/tomato-pause.png')} style={styles.buttonImage} />
          ) : (
            <Image source={require('../../assets/tomato-play.png')} style={styles.buttonImage} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.labelContainer}>
        <Text style={styles.timerLabel}>{formatTime(remainingTime)}</Text>
      </View>

      <View style={styles.periodContainer}>
        <Text style={styles.periodLabel}>{isWorkTime ? 'Work Time' : 'Break Time'}</Text>
      </View>


      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetTimer}
      >
        <MaterialIcons name="loop" size={45} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 250,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center'
  },
  timerLabel: {

    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd'
  },
  periodContainer: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    marginBottom: 10,
  },
  periodLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },

  timerContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginBottom: 20,
  },

  playPauseButton: {
    position: 'absolute',
    width: 61,
    height: 61,
    borderRadius: 30,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    elevation: 5,
  },
  circularButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    elevation: 5,
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    elevation: 5,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center'
  },
  modalContent: {
    flex: 0.5,
    margin: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Timer;
