import React, { useState,useContext,useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text,  TouchableOpacity, View } from "react-native";
import screenSty from "../../style/screenSty";
import AppHeader from "../common/AppHeader";
import { Icon } from "@rneui/themed";
import { color } from "../../config/configuration";
import { useIsFocused } from "@react-navigation/native";
import { deleteApartment, deleteRoom, deleteRoomConfig, getDeviceConfig,  unassignRoomResident } from "../../redux/Actions/auth";
import Loader from "../common/Loader";
import { Image } from "react-native";
import ContactListScreen from "./contact/contactDetailsList";
import { Unit } from "../Unit";
import { Alert } from "react-native";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const DeviceListScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();
    const { auth,resident,selCompany,roomType,setSelDevice } = useContext(StateContext)
    const [deviceList,setDeviceList] =useState(null)
    const [device,setDevice] =useState(null)
    const [isLodering, setIsLodering] = useState(false);
    const [selView, setSelView] = useState(true);

    const reloadDevice = async () => {
        if(resident.apartment_id!=null && resident.apartment_id!=0){
            setIsLodering(true);
            getDeviceConfig(auth?.token, selCompany.id,resident.id, resident.apartment_id).then(async (dev)=>{
                setIsLodering(false)
                setDeviceList(dev)
                setDevice(dev)  
              })
        }else{
            setDeviceList(null)
            setDevice(null)  
        }
    }

    useEffect(() => {
        reloadDevice();
    }, [useIsFocused()]);
    useEffect(() => { 
        const willFocusSubscription = navigation.addListener('focus', () => {
            reloadDevice();
        });
        return willFocusSubscription;
    },[]);
    const searchCom = (txt)=>{

        if(Unit.isEmpty(txt) ){
            setDeviceList(device);
        }else{
            if(device){
                let c = device.filter(e=>e.serial_number.indexOf(txt) >= 0 )
                setDeviceList(c)
            }

        }
    }
    const deleteDevice = (item)=>{
        Alert.alert("", "Are you sure you want to delete the device? (Y/N)", [
            {
                text: "Yes", onPress: async() => {
                    setIsLodering(true);

                    let res5 = await deleteRoom(item.deviceId,item.vayyar_room_id,auth?.token);

                    if(res5){
                        let res6 = await deleteRoomConfig(item.deviceId,auth?.token);

                        if(deviceList.length == 1){
                            let res10 = await deleteApartment(item.apartment_id,auth?.token);
       
                            let res1 = await unassignRoomResident(resident.id,auth?.token);
    
                            navigation.navigate("ResidentList") 
                        }else{
                            reloadDevice();
                        }
                    }else{
                        setIsLodering(false);
                    }
                }
            },
            { text: "No", style: "cancel", },

        ], { cancelable: true });
    }
    const addRoomDevice = ()=>{
        navigation.navigate("deviceType");
        /*
      if(auth?.user_details.role_id==9 ){
       
      }else{
        navigation.navigate("addroomDevice");
      }*/
    }
    return (
        <SafeAreaView onLayout={reloadDevice} style={[screenSty.contant,screenSty.backgroundColor]}>
            <AppHeader title={selCompany.name}  navigation={navigation} backPage={'ResidentList'} isResident={true} ></AppHeader>
            <View style={[screenSty.row,styles.boxVal]}>
                <View style={[screenSty.contant,selView?screenSty.selLine:screenSty.empLine]}>
                    <TouchableOpacity style={screenSty.contant} onPress={()=>setSelView(true)}>
                        <Text style={[screenSty.centerTxt,selView?screenSty.selDevice:screenSty.empDevice]} >{t("Devices")}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[screenSty.contant,!selView?screenSty.selLine:screenSty.empLine]}>
                    <TouchableOpacity style={screenSty.contant} onPress={()=>setSelView(false)}>
                        <Text style={[screenSty.centerTxt,!selView?screenSty.selDevice:screenSty.empDevice]}>{t("Contacts")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                selView && <View style={[screenSty.contant,screenSty.padding15H]} >
                    <View style={[screenSty.margin20H]}>
                        <TextFieldUI
                            
                            onChangeText={(txt) => searchCom(txt)}
                            isSearch={true}
                            placeholder={t("Search by device serial no")}
                        />
                    </View>

                    <FlatList style={screenSty.contant} data={deviceList}
                        renderItem={({ item }) =>
                            <View style={screenSty.box}>
                                <TouchableOpacity style={[styles.boder,screenSty.row]}  onPress={() => {  setSelDevice(item); navigation.navigate('vayyarDevice') }} >
                                    <Text style={[screenSty.contant,screenSty.font14]}>{t('Device')}</Text>
                                    <Icon type="font-awesome" style={[screenSty.margin8Top,screenSty.marginRight10]} name="chevron-right" color={color.primary} size={15}></Icon>
                                </TouchableOpacity> 
                                <View style={[screenSty.row, screenSty.margin5Top]}>
                                    <View style={screenSty.marginRight10}>

                                        {
                                            (item.sensor_mount==0) && <Image source={require("../../assets/Vayyar.png")} resizeMode={'contain'} style={{ width: 50, height: 50 }} ></Image>
                                        }
                                        {
                                            item.sensor_mount!=0 && <Image source={require("../../assets/VayyarCeiling.png")} resizeMode={'contain'} style={{ width: 50, height: 50 }} ></Image>
                                        }
                                   
                                    </View>
                                    <View style={[screenSty.contant]}>
                                        <TouchableOpacity   >
                                            <Text style={[screenSty.font12, screenSty.contant,{color:color.font4}]}>{t('Serial No')} -  <Text style={{color:color.font1}}>{item.serial_number}</Text></Text>
                                            <Text style={[screenSty.font12,screenSty.margin5Top,{color:color.font4}]}>{t('Assigned')} - <Text style={{color:color.font1}}>{roomType.filter(e=>e.value==item.roomType)[0].label}</Text></Text>
                                        </TouchableOpacity> 
                                        <View style={[screenSty.row,screenSty.margin5Top]}>
                                            <TouchableOpacity style={[screenSty.contant, screenSty.row]} onPress={() => {  setSelDevice(item); navigation.navigate('vayyarDevice') }} >
                                                <Text style={[screenSty.font12,{color:color.font4}]}>{t('Configuration')} - </Text>
                                                {
                                                    item.region_configured && item.sub_region_configured && <View style={[screenSty.ConfiguredBox]}>
                                                        <Text style={[screenSty.font10, screenSty.colorW]} >  {t('Configured')} </Text>
                                                    </View>
                                                }
                                                {
                                                    item.region_configured && !item.sub_region_configured && <View style={screenSty.ConfiguredBox}>
                                                        <Text style={[screenSty.font10, screenSty.colorW]} >  {t('Configured')} </Text>
                                                    </View>
                                                }
                                                {
                                                    !item.region_configured && !item.sub_region_configured && <View style={screenSty.NotConfiguredBox}>
                                                        <Text style={[screenSty.font10, screenSty.colorW]} >  {t('Not Configured')} </Text>
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity  onPress={() => {  setSelDevice(item); navigation.navigate('vayyarDevice') }}>
                                        {
                                            !item.region_configured && !item.sub_region_configured &&
                                            <Text style={[screenSty.font8, screenSty.colorR]}>{t('Click here to configure the device')}</Text>
                                        }
                                        {
                                            item.region_configured && !item.sub_region_configured &&
                                            <Text style={[screenSty.font8, screenSty.colorY]}>{t('Click here to configure the device')}</Text>
                                        }
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.deleteIcon } onPress={() => deleteDevice(item)}  >
                                            <Icon type="font-awesome" name="trash" size={20} style={screenSty.padding10H} color="rgb(219,0,0)" />
                                        </TouchableOpacity>
                                    </View>
                                </View>  
                            </View>
                            } >
                    </FlatList>  

                    <TouchableOpacity onPress={addRoomDevice} style={styles.addButt}>
                        <Image source={require("../../assets/btnIcon.png")} resizeMode={'contain'} style={{ width: 50, height: 50 }} ></Image>
                    </TouchableOpacity>
                </View>
            }
            {
                !selView && <View style={[screenSty.contant]} >
                    <ContactListScreen pageName={"deviceList"}  navigation={navigation}></ContactListScreen>
                </View>
            }
            <Loader loading={isLodering} />
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({ 
    deleteIcon:{
        position: 'absolute', right: -10, top:0, paddingTop: 10,paddingLeft: 10
    },
    boxVal:{
        height:45,
        paddingTop:15,
        marginBottom:20,
        marginHorizontal:15
    },
    boder: { 
        paddingBottom: 5, 
        borderBottomWidth: 1, flex: 1, 
        borderColor: "#bfb8fa" 
    },
    addButt:{
        position:'absolute',
        justifyContent:'center',
        paddingLeft:5,
        bottom:0,
        right:0,
        padding:8
    },
    IconBox:{
        backgroundColor:color.paleLavender,
        borderRadius:10,
        paddingLeft:10,
        paddingTop:3,
        marginRight:10,
        width:40,
        height:40
    },
    headerbox:{
        borderBottomWidth:.5,
        borderBottomColor:color.lightPeriwinkle,
        paddingVertical:5,
        marginBottom:10
    },
    editIcon:{
        borderWidth:1,
        borderColor:color.primary,
        borderRadius:20,
        padding:5
    }   
});
export default DeviceListScreen;