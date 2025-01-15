import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SketchPad from './components/SketchPad';
import Home from './components/Home';
import Glyphs from './components/Glyphs';
import Practice from './components/Practice';

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Glyphs"
          component={Glyphs}
        ></Tab.Screen>
        <Tab.Screen name="Practice" component={Practice}></Tab.Screen>
        {/* <Tab.Screen
          name="SketchPad"
          component={SketchPad}
          options={{title: 'hello'}}
          style={styles.container}
        /> */}
      </Tab.Navigator>
    {/* <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Glyphs"
        component={Glyphs}
      ></Stack.Screen>
      <Stack.Screen
        name="SketchPad"
        component={SketchPad}
        options={{title: 'hello'}}
        style={styles.container}
      />
    </Stack.Navigator> */}
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
