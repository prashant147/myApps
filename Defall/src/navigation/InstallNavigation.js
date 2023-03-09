import * as React from "react";
import { createStackNavigator } from '@react-navigation/stack';


import SartScreen from "../screens/installation/start";

import TermsAndConditionsScreen from "../screens/installation/termsAndConditions";
import AddressScreen from "../screens/installation/address";
import ResidentScreen from "../screens/installation/residentInfo";
import ContactScreen from "../screens/installation/contact";
import AddRoomScreen from "../screens/installation/addRooms";
import DeviceInfoScreen from "../screens/installation/deviceInfo"; 
import StepsBluetoothScreen from "../screens/installation/stepsBluetooth";
import CompletedScreen from "../screens/installation/completed";


const Stack = createStackNavigator();
export default function Navigation(props) {

  return <Stack.Navigator screenOptions={{ headerTransparent: true }} options={{ backgroundColor: "#dfe0e5" }}  >

    <Stack.Screen options={{ headerShown: false }} name="start" component={SartScreen} />
    
    <Stack.Screen options={{ headerShown: false }} name="TermsAndConditions" component={TermsAndConditionsScreen} />
    <Stack.Screen options={{ headerShown: false }} name="address" component={AddressScreen} />
    <Stack.Screen options={{ headerShown: false }} name="resident" component={ResidentScreen} />
    <Stack.Screen options={{ headerShown: false }} name="contact" component={ContactScreen} />
    <Stack.Screen options={{ headerShown: false }} name="addRoom" component={AddRoomScreen} />
    <Stack.Screen options={{ headerShown: false }} name="deviceInfo" component={DeviceInfoScreen} />
    <Stack.Screen options={{ headerShown: false }} name="stepsBluetooth" component={StepsBluetoothScreen} />
    <Stack.Screen options={{ headerShown: false }} name="completed" component={CompletedScreen} />

  </Stack.Navigator>;
}