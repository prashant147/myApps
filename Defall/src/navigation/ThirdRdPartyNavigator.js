import * as React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import ThirdRdPartyScreen from "../screens/thirdRdParty/thirdRdParty";
import IndividualCompanyScreen from "../screens/thirdRdParty/individualCompany";
import CompanyListScreen from "../screens/Home/compantList";
import MainNavigator from "./MainNavigation";

const Stack = createStackNavigator();
export default function Navigation(props) {


  return <Stack.Navigator screenOptions={{ headerTransparent: true }} options={{ backgroundColor: "#dfe0e5" }}  >
     
     <Stack.Screen options={{ headerShown: false }} name="thirdRdParty" component={ThirdRdPartyScreen} />
    <Stack.Screen options={{ headerShown: false }} name="individualCompany" component={IndividualCompanyScreen} />
    <Stack.Screen options={{ headerShown: false }} name="companyList" component={CompanyListScreen} />
    <Stack.Screen options={{ headerShown: false }} name="mainScreen" component={MainNavigator} />

  </Stack.Navigator>;
}