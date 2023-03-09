import React, { useState,useContext } from "react";
import { FlatList, Image, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import screenSty from "../../../style/screenSty";
import AppHeader from "../../common/AppHeader";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import Loader from "../../common/Loader";
import { Unit } from "../../Unit";
import StateContext from "../../../context/stateContext";

const DeviceTypeScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();
    const { auth, selCompany } = useContext(StateContext)
    const [isLodering, setIsLodering] = useState(false);
    const onSelectDevice = (type)=>{
        if(type==1){
            navigation.navigate("vayyarType");
        }
        else{
            Unit.alertMes("Currently not available");
        }
    }
    return (
        <SafeAreaView style={[screenSty.contant,screenSty.backgroundColor]}>
                 
            <AppHeader title={selCompany.name}  navigation={navigation} backPage={'ResidentList'} isResident={true} ></AppHeader>
         
            <View style={[screenSty.contant,{paddingTop:30}]}>
                <View style={[screenSty.row,screenSty.centerContent,screenSty.padding15H]}>
                    <View style={[screenSty.contant]}>
                        <TouchableOpacity style={styles.boxVal}  onPress={()=>onSelectDevice(1)}>
                            <Image style={styles.IconBox} resizeMode={'contain'} source={require("../../../assets/Vayyar.png")}></Image>
                            <Text style={[styles.TxtBox,screenSty.font15]}>Vayyar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:"5%"}}></View>
                    <View style={screenSty.contant}>
                        <TouchableOpacity style={styles.boxVal} onPress={()=>onSelectDevice(2)}>
                            <Image style={styles.IconBox} resizeMode={'contain'} source={require("../../../assets/Withings.png")}></Image>
                            <Text style={[styles.TxtBox,screenSty.font15]}>Withings</Text>
                        </TouchableOpacity>
                    </View>
                    
                    
                </View>
            </View>
            <Loader loading={isLodering} />
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    IconBox:{
        width:'50%',
        height:100
    },
    TxtBox:{
        textAlign:'center',
        fontWeight:'bold'
    },
    boxVal:{
        paddingVertical:20,
        backgroundColor:"#fff",
        alignItems:'center',
        borderRadius:20
  },
  });
export default DeviceTypeScreen;