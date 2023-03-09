import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { useState,useContext } from 'react';
import {  SafeAreaView, StatusBar, Text, View } from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import { DrawerContent } from '../navigation/DrawerContent';
import screenSty from '../style/screenSty';
import MainNavigator from '../navigation/MainNavigation';
import StateContext from '../context/stateContext';
import ThirdRdPartyNavigator from '../navigation/ThirdRdPartyNavigator';
import CompanyNavigator from '../navigation/CompanyNavigator';

const Mainscreen = ({ navigation }) => {

    const { auth,company,isOpenDrawer,setisOpenDrawer } = useContext(StateContext)
    const menu = <DrawerContent navigation={navigation}  />;
    console.log(company) 
    return (
        <View style={[screenSty.contant]}>
            <StatusBar
                animated={true}
                backgroundColor="#fff"
                barStyle={'default'}
                showHideTransition={'fade'}
                hidden={true} />
                 <SafeAreaView style={[screenSty.contant]}>
                    <SideMenu
                    menu={menu}
                    isOpen={isOpenDrawer}
                    onChange={Open => setisOpenDrawer(Open)}
                    >
                    {
                        auth?.user_details.terms_and_condition!=null && <View style={screenSty.contant}>
                        {
                            auth?.user_details.role_id==9 && <ThirdRdPartyNavigator></ThirdRdPartyNavigator>
                        }
                        {
                            auth?.user_details.role_id!=9 && <View style={screenSty.contant}>
                
                                {
                                    company?.length >1 && auth?.user_details.role_id > 5 && <CompanyNavigator></CompanyNavigator>
                                }
                                {
                                    (company==null || company?.length == 1) && <MainNavigator></MainNavigator>
                                }
                            </View>
                            
                        }
                        
                        </View>
                    }
                    </SideMenu>
                 </SafeAreaView>
            
        </View>

    )
}
export default Mainscreen;