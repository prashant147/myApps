import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from "./src/navigation/Navigation";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import screenSty from './src/style/screenSty';

export default function App() {

  return (
      <SafeAreaProvider style={screenSty.contant}>
        <NavigationContainer > 
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>      
  );
}