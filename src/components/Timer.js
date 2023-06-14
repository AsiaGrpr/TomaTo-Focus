import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Svg, Circle, G, Text as SvgText, Path } from 'react-native-svg';


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
      <View style={styles.labelContainer}>
        <Text style={styles.timerLabel}>{isWorkTime ? 'Work Time' : 'Break Time'}</Text>
      </View>
      <Svg width="200" height="200" style={styles.timerContainer}>
        <Circle
          cx="100"
          cy="100"
          r="90"
          fill="transparent"
          stroke={isWorkTime ? '#de463f' : '#00bf63'}
          strokeWidth="12"
        />
        <Path
          d="M100 10 A 90 90 0 1 0 100 190"
          fill="transparent"
          stroke='#ddd'
          strokeWidth="13"
          strokeDasharray="565.48"
          strokeDashoffset={calculateProgress() * 5.6548}
        />
        <G transform={{ translate: '100, 100' }}>
          <SvgText
            x="0"
            y="0"
            fill="#000"
            fontSize="48"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {formatTime(remainingTime)}
          </SvgText>
        </G>
      </Svg>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isWorkTime ? '#de463f' : '#00bf63' }]}
        onPress={isPlaying ? handlePauseTimer : handleStartTimer}
      >
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isWorkTime ? '#de463f' : '#00bf63' }]}
        onPress={handleResetTimer}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#999' }]}
        onPress={handleSettingsPress}
      >
        <Text style={styles.buttonText}>Settings</Text>
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
                minimumTrackTintColor={isWorkTime ? '#de463f' : '#00bf63'}
                thumbTintColor={isWorkTime ? '#de463f' : '#00bf63'}
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
                minimumTrackTintColor={isWorkTime ? '#de463f' : '#00bf63'}
                thumbTintColor={isWorkTime ? '#de463f' : '#00bf63'}
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
                minimumTrackTintColor={isWorkTime ? '#de463f' : '#00bf63'}
                thumbTintColor={isWorkTime ? '#de463f' : '#00bf63'}
              />
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleSettingsClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
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
  closeButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Timer;
