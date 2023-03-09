import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "./DrawerContent";
import ThirdRdPartyScreen from "../screens/thirdRdParty/thirdRdParty";
import IndividualCompanyScreen from "../screens/thirdRdParty/individualCompany";
import CompanyListScreen from "../screens/Home/compantList";

import MainNavigator from "./MainNavigation";

const Drawer = createDrawerNavigator();

const DrawerThirdRdPartyNavigator = () => {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen options={{ headerShown: false }} name="thirdRdParty" component={ThirdRdPartyScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="individualCompany" component={IndividualCompanyScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="companyList" component={CompanyListScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="mainScreen" component={MainNavigator} />
        </Drawer.Navigator>
    );
}

export default DrawerThirdRdPartyNavigator;