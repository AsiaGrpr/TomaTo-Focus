import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/HomeScreen.js';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignUpScreen';
import test from '../screens/test.js';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
    test: test
  },
  {
    initialRouteName: 'test',
  }
);

export default createAppContainer(AppNavigator);