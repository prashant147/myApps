import * as React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import ResidentListScreen from "../screens/Home/residentList";
import AddResidentScreen from "../screens/Home/resident/addResidents";
import ResidentAddressScreen from "../screens/Home/resident/ResidentAddress";
import UpdateResidentScreen from "../screens/Home/resident/updateResidents";
import DeviceListScreen from "../screens/Home/deviceList";

import AddContactScreen from "../screens/Home/contact/addContactDetails";
import UpdateContactScreen from "../screens/Home/contact/updateContact";

import VayyarDeviceScreen from "../screens/Home/vayyarDevice";
import GeneralDetailsScreen from "../screens/Home/device/generalDetails";
import RoomSizeScreen from "../screens/Home/device/roomSize";
import SubRegionsScreen from "../screens/Home/device/subRegions"; 
import AssignRoomScreen from "../screens/Home/device/assignRoom";
import AddSubRegionsPhotoUpScreen from "../screens/Home/device/addSubRegionsPhotoUp";
import AddSubRegionsScreen from "../screens/Home/device/addSubRegions";
import AddSubRegionsResizeScreen from "../screens/Home/device/addSubRegionsResize";
import LearningModeScreen from "../screens/Home/device/LearningMode";
import RoomSizeCeilingScreen from "../screens/Home/device/roomSizeCeiling";
import DeviceTypeScreen from "../screens/Home/addDevice/deviceType";
import VayyarTypeScreen from "../screens/Home/addDevice/vayyarType";
import AddroomDeviceScreen from "../screens/Home/addDevice/addroomDevice";
import AddNewDeviceScreen from "../screens/Home/addDevice/addNewDevice";
import StepsaddBluetooth from "../screens/Home/addDevice/stepsaddBluetooth";
import RebootDeviceScreen from "../screens/Home/addDevice/rebootDevice";

import InstructionalScreen from "../screens/Home/instructional";
import UpdateNetWorkScreen from "../screens/Home/updateNetWork";
const Stack = createStackNavigator();
export default function Navigation(props) {


  return <Stack.Navigator screenOptions={{ headerTransparent: true }} options={{ backgroundColor: "#dfe0e5" }}  >
  <Stack.Screen options={{ headerShown: false }} name="ResidentList" component={ResidentListScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addResidents" component={AddResidentScreen} />
  <Stack.Screen options={{ headerShown: false }} name="ResidentsAddress" component={ResidentAddressScreen} />
  <Stack.Screen options={{ headerShown: false }} name="updateResidents" component={UpdateResidentScreen} />
  <Stack.Screen options={{ headerShown: false }} name="deviceList" component={DeviceListScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addContactDetails" component={AddContactScreen} />
  <Stack.Screen options={{ headerShown: false }} name="updateContactDetails" component={UpdateContactScreen} />

  <Stack.Screen options={{ headerShown: false }} name="vayyarDevice" component={VayyarDeviceScreen} />
  <Stack.Screen options={{ headerShown: false }} name="generalDetails" component={GeneralDetailsScreen} />
  <Stack.Screen options={{ headerShown: false }} name="roomSize" component={RoomSizeScreen} />
  <Stack.Screen options={{ headerShown: false }} name="roomSizeCeiling" component={RoomSizeCeilingScreen} />
  <Stack.Screen options={{ headerShown: false }} name="subRegions" component={SubRegionsScreen} />
  <Stack.Screen options={{ headerShown: false }} name="assignRoom" component={AssignRoomScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addSubRegionsPhotoUp" component={AddSubRegionsPhotoUpScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addSubRegions" component={AddSubRegionsScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addSubRegionsResize" component={AddSubRegionsResizeScreen} />
  <Stack.Screen options={{ headerShown: false }} name="learningMode" component={LearningModeScreen} />

  <Stack.Screen options={{ headerShown: false }} name="deviceType" component={DeviceTypeScreen} />
  <Stack.Screen options={{ headerShown: false }} name="vayyarType" component={VayyarTypeScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addroomDevice" component={AddroomDeviceScreen} />
  <Stack.Screen options={{ headerShown: false }} name="addNewDevice" component={AddNewDeviceScreen} />
  <Stack.Screen options={{ headerShown: false }} name="stepsaddBluetooth" component={StepsaddBluetooth} />
  <Stack.Screen options={{ headerShown: false }} name="rebootDevice" component={RebootDeviceScreen} />
  
  <Stack.Screen options={{ headerShown: false }} name="instructional" component={InstructionalScreen} />
  <Stack.Screen options={{ headerShown: false }} name="updateNetWork" component={UpdateNetWorkScreen} /> 

  </Stack.Navigator>;
}