import React,{useContext} from "react";
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import screenSty from "../style/screenSty";
import { Icon } from "@rneui/themed";
import { APP_VERSION, color, screen_size } from "../config/configuration";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import '../i18n/i18n';
import StateContext from "../context/stateContext";
import { logout } from "../redux/Actions/auth";

export function DrawerContent({ navigation }) {
    const {t, i18n} = useTranslation();
    const { auth,setAuth,setCompanyType,setisOpenDrawer,isOpenDrawer } = useContext(StateContext)
    const logoutFun = async () => { 
        if(auth){
            logout(auth?.user_details.email).then(async e=>{
                await AsyncStorage.removeItem('userInfo');
                setAuth(null)
                setCompanyType(null)
                navigation.navigate('login')
            })
        }else{
            navigation.navigate('login')
        }
    }
    return (
        <View style={[screenSty.contant]}>
            <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding20H]} >
                <View style={[styles.border]}>
                    <TouchableOpacity style={[screenSty.marginLeft10]} onPress={() => setisOpenDrawer(!isOpenDrawer)}>
                        <Icon type="font-awesome" name="long-arrow-left" size={25} color={color.primary} />
                    </TouchableOpacity>
                    <View style={screenSty.contant}>
                    {
                        auth!=null &&  <Text style={[screenSty.font18, styles.DrawerName]}>{t("Hello")}, { auth?.user_details.user_name} </Text>
                    }
                    </View>
                    
                    
                </View>
                <TouchableOpacity onPress={() => {navigation.navigate('profile');setisOpenDrawer(false)}} >
                    <View style={styles.border}>
                        <Text style={styles.boxTxt}>{t("Profile")}</Text>
                        <Icon type="font-awesome" name="angle-right" size={15} color="rgb(90,81,174)" />
                    </View>
                </TouchableOpacity>
             

                <TouchableOpacity onPress={() => {navigation.navigate( 'support');setisOpenDrawer(false)}} >
                    <View style={styles.border}>
                        <Text style={styles.boxTxt}>{t("Support")}</Text>
                        <Icon type="font-awesome" name="angle-right" size={15} color={color.primary} />
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => logoutFun()} >
                    <View style={styles.border}>
                        <Text style={styles.boxTxt}>{t("Sign Out")}</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <Text style={[screenSty.centerTxt, screenSty.font14, screenSty.margin20Top]}>Ver {APP_VERSION}</Text>
                </View>
            </LinearGradient>
        </View>
    );
}
const styles = StyleSheet.create({

    DrawerName: {
        paddingLeft: 10
    },
    border: {
        flexDirection: 'row', padding: 10,
        borderBottomColor: 'rgb(191,184,250)', borderBottomWidth: 0.5
    },
    boxTxt: {
        flex: 1, 
        color: color.primary, 
        fontSize: RFValue(16,screen_size),
        fontFamily: "OpenSans-SemiBold",
    }
});