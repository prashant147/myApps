import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "./DrawerContent";
import CompanyListScreen from "../screens/Home/compantList";
import MainNavigator from "./MainNavigation";

const Drawer = createDrawerNavigator();

const DrawerCompanyNavigator = () => {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen options={{ headerShown: false }} name="companyList" component={CompanyListScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="mainScreen" component={MainNavigator} />      
        </Drawer.Navigator>
    );
}
export default DrawerCompanyNavigator;