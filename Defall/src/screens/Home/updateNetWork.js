import * as React from 'react';
import { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Platform, NativeModules,NativeEventEmitter, ScrollView, Dimensions } from 'react-native';
import screenSty from '../../style/screenSty';
import { SafeAreaView } from 'react-native-safe-area-context';
import buttonSty from '../../style/buttonSty';
import AppHeader from '../common/AppHeader';
import {
    vayyar,
    VayyarEvent, 
    vayyarEventListener,
  } from "react-native-bridgera-vayyar";
import VeviceInfo from '../common/deviceInfo';
import { RFValue } from 'react-native-responsive-fontsize';
import { BASE_URL, CLOUD_REGION, color, MQTT_PASSWORD, MQTT_PORT, MQTT_URL, MQTT_USER_NAME, screen_size } from '../../config/configuration';
import { Unit } from '../Unit';
import ConnectivityManager from 'react-native-connectivity-status';
import Loader from '../common/Loader';
import '../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { Icon, Overlay } from "@rneui/themed";
import TextFieldUI from '../common/TextFieldUI';

  if (Platform.OS === "ios") {
    var vayyarIos = NativeModules.ReactNativeBridgeraVayyar;
    var _eventEmitter = new NativeEventEmitter(
      NativeModules.ReactNativeBridgeraVayyar
    );
  }
  const configurationData = {
    cloudBaseUrl: BASE_URL,
    cloudRegion: CLOUD_REGION,
    mqttUrl: MQTT_URL,
    mqttPort: MQTT_PORT,
    mqttUserName: MQTT_USER_NAME,
    mqttPassword: MQTT_PASSWORD,
    ssid: "",
    wifiPassword: "",
  };
const UpdateNetWorkScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();

  const [isWifi,setIsWifi] = useState([]);
  const [isLodering,setIsLodering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [itemsPass, setItemsPass] = useState('');
  const [itemsName, setItemsName] = useState('');
  const [itemsRssi, setItemsRssi] = useState('');
  const [itemsBssid, setItemsBssid] = useState('');

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const checkIOSConnect = ()=>{
    if(Unit.isEmpty(itemsName,"Please enter SSid")){ return }
    if(Unit.isEmpty(itemsPass,"Please enter Password")){ return }
   try {
         let wifi = isWifi.map((e)=>{
            return {
               ...e,
               isConnected:(e.ssid==itemsName && e.bssid==itemsBssid)?true:false,
               password:(e.ssid==itemsName && e.bssid==itemsBssid)?itemsPass:""
            }
         })
         setIsWifi(wifi)
         toggleOverlay()
         if (Platform.OS == "android") { 
          vayyar.resumeConnection(itemsName,itemsPass);
        }else if (Platform.OS == "ios") { 
          vayyarIos.resumeConnection(JSON.stringify({"wifiName":itemsName,"wifiPass":itemsPass}));
        }

   } catch (error) {
      console.warn(error)
   }
  }
  if (Platform.OS == "android") {
    React.useEffect(() => {
      vayyar.initializeVayyar();
      vayyar.checkPermission();
      const permissionListner = vayyarEventListener().addListener(
        VayyarEvent.permissionChangeListener,
        (event) => {
  
        }
      );

      const connectionListner = vayyarEventListener().addListener(
        VayyarEvent.deviceConnectionListener,
        (event) => {
            //|| event.data=="Pairing"
            if(event.data=="CONNECTED" ){
              setIsLodering(false);
              Unit.alertMes("connect device to wifi successfully!")
              setIsWifi([])
            }else if(event.data=="device are Connected"){
            }else if(event.data=="wifi Error"){
              setIsLodering(false);
              setIsWifi([]); 
              Unit.alertMes("Please check wifi password")
              vayyar.closeVayyarDevice();
            }else if(event.data=="false"){
              setIsLodering(false);
              Unit.alertMes("Please check device, device not get any response.")
            }else {
              if(event.data.indexOf("bssid")>0){
                let da = JSON.parse(event.data);
                const unique = [...new Map(da.map((m) => [m.ssid, m])).values()];
                let data = unique.map(e=>{
                  return{
                    ...e, 
                    isConnected:false,
                    password:""
                  }
                })
  
                setIsWifi(data); 
                setIsLodering(false);
              }
             
            }
          
        }
      );
      return () => {
        permissionListner.remove();
        connectionListner.remove(); 
      };
    }, []);
  }else if (Platform.OS == "ios") {
    React.useEffect(() => {

      vayyarIos.initializeVayyar();
      const connectionListner = _eventEmitter.addListener(
        "deviceConnectionListener",
        (event) => {

          console.warn("Cloud Message",event.data)

          if(event.data=="CONNECTED"){
            //updateCompany();
            setIsLodering(false);
            Unit.alertMes("connect device to wifi successfully!")
            setIsWifi([])
          }else if(event.data=="Cloud details missing"){
            setIsLodering(false);
            Unit.alertMes("Please check device, device not get any response.")
          }else if(event.data=="wifi Error"){
            setIsLodering(false);
            setIsWifi([]); 
            Unit.alertMes("Please check wifi password")
            if (Platform.OS == "android") { 
              vayyar.closeVayyarDevice();
            }else if (Platform.OS == "ios") { 
              vayyarIos.closeVayyarDevice();
            }
          }else if(event.data.indexOf("bssid")>0){
            if(event.data.indexOf("bssid")>0){
              let da = JSON.parse(event.data);
              const unique = [...new Map(da.map((m) => [m.ssid, m])).values()];
              let data = unique.map(e=>{
                return{
                  ...e, 
                  isConnected:false,
                  password:""
                }
              })

              setIsWifi(data); 
              setIsLodering(false);
            }
           
          }else if(event.data.indexOf("Pairing")>-1){
            setIsLodering(false);
            Unit.alertMes(event.data)
          }

        }
      );
      return () => {
        connectionListner.remove();
      };
    }, []);
  }
  const setConnection = (items)=>{
    setIsLodering(true);
    setItemsName(items.ssid);
    setItemsRssi(items.rssi);
    setItemsBssid(items.bssid);
    setItemsPass('')
    toggleOverlay();
  }
  const connectDevice = async()=>{
    const locationServicesAvailable = await ConnectivityManager.areLocationServicesEnabled()
    if (locationServicesAvailable) {
      
      setIsLodering(true);
      if (Platform.OS == "android") { 
        vayyar.connectVayyarDevice(JSON.stringify(configurationData));
      }else if (Platform.OS == "ios") { 
        vayyarIos.connectVayyarDevice(JSON.stringify(configurationData));
      }
    } else {
        Unit.alertMes('Please enable location');
    } 
  }

    return (
        <View style={[screenSty.contant,screenSty.backgroundColor]}>
          <AppHeader title={'Connect Device to Wi-Fi'} navigation={navigation} currentPage={'wifiNewDevice'} backPage={'vayyarDevice'} isResident={true}></AppHeader>
          <View  style={[screenSty.contant,screenSty.padding15H]} >
              <VeviceInfo></VeviceInfo>
              {
                isWifi.length ==0 && <View style={[screenSty.box, screenSty.padding20Bottom]}>
                  <View style={[screenSty.margin15H, screenSty.padding10TopBottom]}>
                      <View style={screenSty.centerItem}>
                          <Image source={require("../../assets/vayyarIcon.png")} style={{height:100}} resizeMode={'contain'} ></Image>
                      </View>
                      <Text style={[screenSty.font15, screenSty.centerTxt, screenSty.margin20TopBottom]}>
                        step 1: factory reset the device (hold the button on the top of the device for 30 seconds)
                      </Text>
                      <Text
                        style={[screenSty.font15,screenSty.colorSemiBold, screenSty.centerTxt]}
                      >
                        step 2: Press on the button located on the top of the device for 5 seconds,
                        then release and wait for the blue light to flash after that click
                        on the Connect button
                      </Text>
                      <View style={[screenSty.centerItem, screenSty.margin30Top]}>
                          <TouchableOpacity style={[buttonSty.buttonBox,{width:'95%'}, screenSty.margin10Top]} onPress={connectDevice} >
                              <Text style={[buttonSty.cameraButTxt,screenSty.colorW]}>Connect New Vayyar Wifi</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
                </View>
              }
              {
                isWifi.length >0 && <View style={screenSty.contant}>
                    <View style={[ screenSty.margin30Bottom,screenSty.margin20H]}>
                        <View style={screenSty.centerContent}>
                            <Image source={require("../../assets/wifi.png")} resizeMode={'contain'} style={[screenSty.installImage,{height:100}]}></Image>
                        </View>

                        <Text style={[screenSty.font16, screenSty.centerTxt, screenSty.margin10TopBottom]}>
                          {t("The device needs a Wi-Fi connection for connecting to the cloud. Please connect your phone to the Wi-Fi the device will be using Otherwise, you can enter the Wi-Fi details manually.")}</Text>
                        <View style={[screenSty.row]}>
                            <Text style={[screenSty.font16]}>{t("Available networks")}</Text>
                            <View
                                style={{
                                flex: 1,
                                borderBottomWidth: 0.5,
                                borderBottomColor: "rgb(167,157,255)",
                                }}
                            ></View>
                        </View>
                        <ScrollView style={{height:Dimensions.get('screen').height / 5}}>
                            {
                                isWifi.map((item) => (
                                <TouchableOpacity key={item.wifiName} onPress={() => setConnection(item)}>
                                    <View style={[screenSty.row, screenSty.margin10Top]}>
                                        <Icon type="font-awesome" name="wifi" style={{ marginRight: 15, alignItems: 'flex-end' }} size={20} color={color.primary} />
                                        <View>
                                            <Text style={screenSty.font12}>{item.ssid} {
                                              /*
                                            item.isConnected && <Text style={screenSty.colorPrimary}>-	 {t("Credentials Entered")}</Text>
                                            */ }
                                            </Text>
                                        </View>
                                        <View style={{ right: 0, position: 'absolute' }}>
                                            {
                                            item.isConnected && <Icon type="font-awesome" name="check" style={{ marginRight: 15, alignItems: 'flex-end' }} size={20} color={color.primary} />
                                            }
                                            {
                                            !item.isConnected && <Icon type="font-awesome" name="lock" style={{ marginRight: 15, alignItems: 'flex-end' }} size={20} color="rgb(237,45,0)" />
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                            <View style={[screenSty.margin20H, screenSty.padding10TopBottom]}>
                                <Text style={[screenSty.headerDesc, screenSty.margin30Bottom]}>{itemsName}</Text>
                                <TextFieldUI
                                onChangeText={(txt) => setItemsPass(txt)}
                                placeholder="Password"
                                isSecure={true}
                                value={itemsPass}
                                />
                                <View style={[screenSty.row, screenSty.margin20TopBottom,screenSty.centerContent]}>
                                <TouchableOpacity style={styles.cancelBut} onPress={() => setVisible(false)}>
                                    <Text style={{ color: color.primary }}>{t("CANCEL")}</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.connectBut} onPress={checkIOSConnect}>
                                    <Text style={{ color: color.font }}>{t("ENTER")}</Text></TouchableOpacity>
                                </View>
                            </View>
                        </Overlay>
                    </View>
                </View>
              }
              <Loader loading={isLodering} />
          </View>
        </View>
    )
}
export const styles = StyleSheet.create({
    cancelBut: {
        marginRight: 20, backgroundColor: color.paleLavender,
        paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20
    },
    connectBut: {
        marginRight: 20, backgroundColor: color.primary, 
        paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20
    },
    loderTxt: {
        fontSize: RFValue(15,screen_size),
        color: "#000",
        marginTop: 12,
        fontFamily: "OpenSans-Semibold",
    },
});

export default UpdateNetWorkScreen;