import * as React from 'react';
import {useState,useContext,useEffect} from 'react';
import { Alert, Dimensions, Image, NativeEventEmitter, NativeModules, Platform, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import screenSty from '../../style/screenSty';
import InstalHeader from '../common/instalProgress';
import ButtonGroup from '../common/nextButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import ConnectivityManager from 'react-native-connectivity-status';
import { BASE_URL, CLOUD_REGION, color, MQTT_PASSWORD, MQTT_PORT, MQTT_URL, MQTT_USER_NAME, screen_size } from "../../config/configuration";
import { Unit } from '../Unit';
import { Icon, Overlay } from '@rneui/themed';
import YoutubePlayer from "react-native-youtube-iframe";
import {
   vayyar,
   VayyarEvent,
   vayyarEventListener,
 } from "react-native-bridgera-vayyar";
 import TextFieldUI from '../common/TextFieldUI';
import Loader from '../common/Loader';
import inputSty from '../../style/inputSty';
import { addRoomData, addRoomInfo, assignRooms, deleteRoomConfig, Device, getCompanyDetails, getDeviceBySN, sendParent_email, sensorMount, setCompanySettings, syncDeviceById } from '../../redux/Actions/auth';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';
import StateContext from '../../context/stateContext';

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

const StepsBluetoothScreen = ({ navigation }) => {
   const {t, i18n} = useTranslation();
   const { auth,resident,setSelDevice,selDevice,room,residentAdd} = useContext(StateContext)
  const [isLodering,setIsLodering] = useState(false);
  const [isWifi,setIsWifi] = useState([]);
  const [visibleVideo, setVisibleVideo] = useState(false);
  const [youtubeId, setyYoutubeId] = useState(null);

  const [visible, setVisible] = useState(false);
  const [itemsName, setItemsName] = useState('');
  const [itemsPass, setItemsPass] = useState('');
  const [itemsRssi, setItemsRssi] = useState('');
  const [itemsBssid, setItemsBssid] = useState('');


  const onStateChange = React.useCallback((state) => {
    if (state === "ended") {
     Unit.alertMes("video has finished playing!");
    }
  }, []);

  if (Platform.OS == "android") {
    useEffect(() => {
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
              updateCompany();
            }else if(event.data=="device are Connected"){
            }else if(event.data=="false"){
              setIsLodering(false);
              Unit.alertMes("Please check device, device not get any response.")
            }else if(event.data=="wifi Error"){
              setIsLodering(false);
              setIsWifi([]); 
              Unit.alertMes("Please check wifi password")
              vayyar.closeVayyarDevice();
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
    useEffect(() => {

      vayyarIos.initializeVayyar();
      const connectionListner = _eventEmitter.addListener(
        "deviceConnectionListener",
        (event) => {

          console.warn("Cloud Message",event.data)

          if(event.data=="CONNECTED"){
            updateCompany();
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
  const toggleOverlay = () => {
    setVisible(!visible);
 };

  const nextBut = () => {
    BluetoothStateManager.getState().then((bluetoothState) => {
       switch (bluetoothState) {
          case 'Unknown':
          case 'Resetting':
          case 'Unsupported':
          case 'Unauthorized':
          case 'PoweredOff':
             Unit.alertMes('Please enable bluetooth');
             break;
          case 'PoweredOn':
             checkLocation();
          default:
             break;
       }
    });
  } 
  const checkLocation = async () => {
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
  const connectDevice = async ()=>{
    setIsLodering(true)
   if (Platform.OS == "android") { 
     vayyar.resumeConnection(itemsName,itemsPass);
   }else if (Platform.OS == "ios") { 
     vayyarIos.resumeConnection(JSON.stringify({"wifiName":itemsName,"wifiPass":itemsPass}));
   }
 
  }
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
   } catch (error) {
      console.warn(error)
   }
  }
  const updateCompany = async () => {

   let res = await getDeviceBySN(selDevice, auth?.token)
   if (res.data.length > 0) { 
     await sensorMount(res.data[0].deviceId,1,auth?.token)
     await deleteRoomConfig(res.data[0].deviceId,auth?.token)

     let res12 = await addRoomData(resident.id, room.roomTypeId, room.sub_room_name, auth?.user_details.company_id, auth?.token, room.apartment_name,null,`${resident.last_name} Residence`)

    if(res12){
       await getCompanyDetails(auth?.token, auth?.user_details.company_id).then( async res2=>{
        if(res2){
         let com = res2.data;
         await sendParent_email(auth?.user_details.company_id, com.name, com.address + " " + com.address_line_2 + " " + com.city + " " +
         com.state + " " + com.zip + " " + com.country, resident.first_name + " " + resident.last_name,
         residentAdd.address + " " + residentAdd.address_line_2 + " " + residentAdd.city + " " +
         residentAdd.state + " " + residentAdd.zip + " " + residentAdd.country, resident.phone,
         auth?.user_details.user_name, auth?.user_details.phone, auth?.token)

         let res1 = await addRoomInfo(room.sub_room_name, res12.data.apartment_id, res12.data.room_id, res12.data.apartment_name, auth?.user_details.company_id, auth?.token)
         if(res1){
           await assignRooms(res.data[0].deviceId, res1.id, auth?.token)
           await syncDeviceById(res.data[0].deviceId, auth?.user_details.company_id, auth?.token)
           await setCompanySettings(auth?.token,auth?.user_details.company_id)
           setSelDevice(null);
           setVisible(false);
           setIsLodering(false)
           navigation.navigate('completed');
         }else{
           setIsLodering(false)
           Unit.alertMes('try again not create room');
         }
        
        }else{
         setIsLodering(false)
         Unit.alertMes('try again not found company detail');
       }
     })
    }else{
       setIsLodering(false)
       Unit.alertMes('try hain room id not update');
    }
    
   }else {
     setIsLodering(false);
     Unit.alertMes('The S/N you’ve enter is incorrect. Please check it and reenter.');
     return
   }
 }
  const setConnection = (items)=>{
    setItemsName(items.ssid);
    setItemsRssi(items.rssi);
    setItemsBssid(items.bssid);
    setItemsPass('')
    toggleOverlay();
  }

   return (
      <SafeAreaView style={[screenSty.contant]}>
        {
          isWifi.length ==0 && <View style={screenSty.contant}>
             <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
              <InstalHeader navigation={navigation} progress={0.7} backPage={"deviceInfo"} />
              <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
               <View style={[screenSty.centerContent]}>
                  <Image source={require("../../assets/stepsList.png")} style={screenSty.installImage} ></Image>
               </View>
               <View style={[screenSty.padding20H, screenSty.margin20Top]}>
                  
                    <Text style={[screenSty.font20, screenSty.centerTxt,screenSty.margin20H, screenSty.margin20TopBottom]}>Device Vayyar Home needs permission to use your Bluetooth</Text>
                   
                  
                  <Text style={[screenSty.font16, screenSty.centerTxt,screenSty.margin20H]}>Please turn on your phone Bluetooth if it is not turned on.</Text>
                 
                   <Text style={[screenSty.font15,screenSty.colorSemiBold, screenSty.centerTxt]}>
                     Please use the power cable to connect the device to a power outlet
                  </Text>
                  <Text
                     style={[screenSty.font15,screenSty.colorSemiBold, screenSty.centerTxt]}
                  >
                     Press on the button located on the top of the device for 5 seconds,
                     then release and wait for the blue light to flash after that click
                     on the Next button
                  </Text>

               </View>
               <View style={[screenSty.centerItem,screenSty.margin20Top]}>
                  <TouchableOpacity style={[screenSty.centerContent,{borderBottomWidth:1,borderBottomColor:color.primary}]} onPress={() => {setyYoutubeId('VKecdhNOolM');setVisibleVideo(true);  }} >
                     <Text style={[screenSty.font15,screenSty.colorPrimary]}>
                     Help
                     </Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>

 
             </LinearGradient>
              <ButtonGroup onClickNext={nextBut} onClickBack={()=>navigation.navigate('deviceInfo')} />
          </View>
        }
        {
          isWifi.length >0 && <View style={screenSty.contant}>
             <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
              <InstalHeader navigation={navigation} progress={0.8} backPage={"stepsBluetooth"} />
              <View style={[screenSty.margin20H, screenSty.margin30Bottom]}>
                  <View style={screenSty.centerContent}>
                     <Image source={require("../../assets/wifi.png")} style={screenSty.installImage}></Image>
                  </View>

                  <Text style={[screenSty.font16, screenSty.centerTxt, screenSty.margin10TopBottom]}>The device needs a Wi-Fi connection
                     for connecting to the cloud. Please connect
                     your phone to the Wi-Fi the device
                     will be using Otherwise, you can enter
                     the Wi-Fi details manually.</Text>
                  <View
                     style={[
                        screenSty.row
                     ]}
                  >
                     <Text style={[screenSty.font16]}>Available networks</Text>
                     <View
                        style={{
                           flex: 1,
                           borderBottomWidth: 0.5,
                           borderBottomColor: "rgb(167,157,255)",
                        }}
                     ></View>
                  </View>
                  <ScrollView style={{height:Dimensions.get('screen').height / 4}}>
                     {
                        isWifi.map((item) => (
                           <TouchableOpacity key={item.ssid} onPress={() => setConnection(item)}>
                              <View style={[screenSty.row, screenSty.margin10Top]}>
                                 <Icon type="font-awesome" name="wifi" style={{ marginRight: 15, alignItems: 'flex-end' }} size={20} color={color.primary} />
                                 <View>
                                    <Text style={screenSty.font12}>{item.ssid} {
                                      /*
                                       item.isConnected && <Text style={screenSty.colorPrimary}>-	 Credentials Entered</Text>
                                    */
                                    }
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
                  <View style={screenSty.centerItem}>
                     <TouchableOpacity style={[screenSty.centerContent,screenSty.margin20Top,{borderBottomWidth:1,borderBottomColor:color.primary}]} onPress={() => {setyYoutubeId('m2y9Bnrl42s');setVisibleVideo(true);  }} >
                        <Text style={[screenSty.font15,screenSty.colorPrimary]}>
                        Help
                        </Text>
                     </TouchableOpacity>
                  </View>
                  <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                    <View style={[screenSty.margin20H, screenSty.padding10TopBottom]}>
                        <Text style={[screenSty.headerDesc, screenSty.margin30Bottom]}>{itemsName}</Text>
                        <TextFieldUI
                          onChangeText={(txt) => setItemsPass(txt)}
                          placeholder="Password"
                          isSecure={true}
                          value={itemsPass}
                          borderViews={[itemsPass != "" ? inputSty.PassInput : inputSty.empityPass]}
                        />
                        <View style={[screenSty.row, screenSty.margin20TopBottom,screenSty.centerContent]}>
                          <TouchableOpacity style={styles.cancelBut} onPress={() => setVisible(false)}>
                              <Text style={{ color: color.primary }}>CANCEL</Text></TouchableOpacity>
                          <TouchableOpacity style={styles.connectBut} onPress={checkIOSConnect}>
                              <Text style={{ color: color.font }}>ENTER</Text></TouchableOpacity>
                        </View>
                    </View>
                  </Overlay>
               </View>
             </LinearGradient>
             <ButtonGroup onClickNext={connectDevice} onClickBack={()=>setIsWifi([])} />
          </View>
        }
        <Loader loading={isLodering} />
        <Overlay isVisible={visibleVideo} >
               <View style={{alignItems:'flex-end'}}>
                  <TouchableOpacity onPress={()=>{setVisibleVideo(false);setyYoutubeId(null)}}>
                     <Icon type="font-awesome" name="close" size={25} color={color.primary} />
                  </TouchableOpacity>
               </View>

               <YoutubePlayer
                     height={200}
                     width={Dimensions.get('screen').width - 40}
                     videoId={youtubeId}
                     onChangeState={onStateChange}
                  />
            </Overlay>
      </SafeAreaView>
   )
}
export const styles = StyleSheet.create({
  cancelBut: {
      marginRight: 20, backgroundColor: color.paleLavender,
      paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20
  },
  connectBut: {
      marginRight: 20, backgroundColor: color.primary, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20
  },
  borderline:{
      borderTopColor:color.primary,
      borderTopWidth:1,
      paddingBottom:15,
      paddingTop:5
  },
});

export default StepsBluetoothScreen;