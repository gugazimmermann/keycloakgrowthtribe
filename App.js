import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {getDeepLink} from './src/keycloack/';

import Splash from './src/Splash';
import Login from './src/Login';
import Home from './src/Home';
import Callback from './src/Callback';

const Stack = createStackNavigator();

export default function App() {
  const linking = {
    prefixes: [getDeepLink()],
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Splash" headerMode="none">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Growth Tribe'}}
        />
        <Stack.Screen name="Callback" component={Callback} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
