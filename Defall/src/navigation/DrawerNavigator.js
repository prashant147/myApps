import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "./DrawerContent";

import { MainNavigator } from "./MainNavigation";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen options={{ headerShown: false }} name="mainScreen" component={MainNavigator} />
       </Drawer.Navigator>
    );
}

export default DrawerNavigator;