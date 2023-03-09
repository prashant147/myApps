import * as React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import CompanyListScreen from "../screens/Home/compantList";
import MainNavigator from "./MainNavigation";

const Stack = createStackNavigator();
export default function Navigation(props) {


  return <Stack.Navigator screenOptions={{ headerTransparent: true }} options={{ backgroundColor: "#dfe0e5" }}  >
     
   <Stack.Screen options={{ headerShown: false }} name="companyList" component={CompanyListScreen} />
    <Stack.Screen options={{ headerShown: false }} name="mainScreen" component={MainNavigator} />      

  </Stack.Navigator>;
}