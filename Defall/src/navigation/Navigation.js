import * as React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Splashscreen from "../screens/Splash";
import signUpScreen from "../screens/login/signUp";
import LoginScreen from "../screens/login/login";

import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";
import ProfileScreen from "../screens/menu/profile";
import SupportScreen from "../screens/menu/supportScreen";

import InstallNavigator from "./InstallNavigation";

import Mainscreen from "../screens/main";


const Stack = createStackNavigator();
export default function Navigation(props) {

  if (Platform.OS == "android") {
    AndroidKeyboardAdjust.setAdjustPan();
  }

  return <Stack.Navigator screenOptions={{ headerTransparent: true }} options={{ backgroundColor: "#dfe0e5",gestureEnabled: false }} initialRouteName="splash" >
    <Stack.Screen options={{ headerShown: false,gestureEnabled: false }} name="splash" component={Splashscreen} />
    <Stack.Screen options={{ headerShown: false,gestureEnabled: false }} name="signUp" component={signUpScreen} />
    <Stack.Screen options={{ headerShown: false,gestureEnabled: false }} name="login" component={LoginScreen} />
    <Stack.Screen options={{ headerShown: false }} name="profile" component={ProfileScreen} />
    <Stack.Screen options={{ headerShown: false }} name="support" component={SupportScreen} />
    <Stack.Screen options={{ headerShown: false }} name="installDevice" component={InstallNavigator} />
 
    <Stack.Screen options={{ headerShown: false }} name="main" component={Mainscreen} />

   {
    /*
   
    <Stack.Screen options={{ headerShown: false }} name="companymain" component={DrawerCompanyNavigator} />
    <Stack.Screen options={{ headerShown: false }} name="thirdRdPartymain" component={DrawerThirdRdPartyNavigator} />
  
    */
   }
 
   
 </Stack.Navigator>;
}
