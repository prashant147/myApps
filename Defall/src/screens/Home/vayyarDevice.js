import * as React from "react";
import { useState,useContext,useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import screenSty from "../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import AppHeader from "../common/AppHeader";
import Loader from "../common/Loader";
import { color } from "../../config/configuration";
import { Unit } from "../Unit";
import { rebootConfiguration, room_measurement } from "../../redux/Actions/auth";
import VeviceInfo from "../common/deviceInfo";
import ContactListScreen from "./contact/contactDetailsList";
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const VayyarDeviceScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice,roomType } = useContext(StateContext)
  const [selView, setSelView] = useState(true);

  const [roomInfo, setRoomInfo] = useState(null);
  const [isLodering, setIsLodering] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {

    if (selDevice) {
      fetchData();
    }
    return () => { }
  }, [roomInfo == null, isFocused]);

  const fetchData = async () =>{ 
    try {
      setIsLodering(true)
      let roomInfo = await room_measurement(selDevice.roomType, selDevice.subroom_id, auth?.token)

      setIsLodering(false)
      if (roomInfo.data != "No record found") {
        setRoomInfo(roomInfo.data.result);
      } else {
        setRoomInfo(null);
      }
    } catch (error) {
      setIsLodering(false)
    }
   
  }

  const rebootDevice = async ()=>{
    
    try{
      setIsLodering(true)
      await rebootConfiguration(selDevice.deviceId, auth?.token);
      setTimeout(()=>{
        setIsLodering(false);
        Unit.alertMes("Reboot device command executed successfully")
      },3000);
    }catch(e){
      setIsLodering(true)
      Unit.alertMes("Reboot device command executed unsuccessfully")
    }
  } 
  const updateNetwork = ()=>{
    BluetoothStateManager.getState().then((bluetoothState) => {
      switch (bluetoothState) {
          case 'Unknown':
          case 'Resetting':
          case 'Unsupported':
          case 'Unauthorized':
          case 'PoweredOff':
              Unit.alertMes('Please start Bluetooth');
              break;
          case 'PoweredOn':
            navigation.navigate("updateNetWork")
          default:
              break;
      }
    });
  }
  const setRoomSize = async()=>{ 
    await fetchData()
    if( selDevice.sensor_mount==0){
      navigation.navigate("roomSize", { roomInfo: roomInfo })
    }else{
      navigation.navigate("roomSizeCeiling", { roomInfo: roomInfo })
    } 
  }
  return ( 
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} title='Device Configure' backPage='deviceList' isResident={true}></AppHeader>
      <View style={[screenSty.row,styles.boxVal]}>
            <View style={[screenSty.contant,selView?screenSty.selLine:screenSty.empLine]}>
                <TouchableOpacity style={screenSty.contant} onPress={()=>setSelView(true)}>
                    <Text style={[screenSty.centerTxt,selView?screenSty.selDevice:screenSty.empDevice]} >{t('Devices')}</Text>
                </TouchableOpacity>
            </View>
            <View style={[screenSty.contant,!selView?screenSty.selLine:screenSty.empLine]}>
                <TouchableOpacity style={screenSty.contant} onPress={()=>setSelView(false)}>
                    <Text style={[screenSty.centerTxt,selView?screenSty.selDevice:screenSty.empDevice]}>{t('Contacts')}</Text>
                </TouchableOpacity>
            </View>
        </View>
      {
          selView && <ScrollView style={[screenSty.contant,screenSty.padding15H]} >
              <VeviceInfo></VeviceInfo>
          
              <View style={screenSty.box}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("generalDetails")}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>{t('General Details')}</Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={setRoomSize}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>{t('Sensor Detection Area Size')}</Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {

                    if (roomInfo != null && roomInfo.user_room_measurements_id) {
                      navigation.navigate("subRegions", {
                        user_room_measurements_id: roomInfo.user_room_measurements_id,
                      });
                    } else {
                      Unit.alertMes("Please add Sensor Detection Area size then enter sub regions")
                      return;
                    }
                  }}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>{t('Sub Regions')}</Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("assignRoom")}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.row]}>
                  {t('Assign Sensor Detection Area')} - <Text>
                      {selDevice && roomType.filter(e=>e.value==selDevice.roomType)[0].label}
                      </Text>

                  </Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("addSubRegionsPhotoUp")}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>
                  {t('Upload Sensor Detection Area Photos')}
                  </Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => rebootDevice()}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>
                  {t('Reboot Device')}
                  </Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>

                
                <TouchableOpacity
                  onPress={updateNetwork}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>
                  {t('Connect Device to a different Wi-Fi')}
                  </Text> 
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>
                   
                <TouchableOpacity
                  onPress={()=>navigation.navigate("learningMode")}
                  style={[screenSty.row, styles.optionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>
                  {t('Learning Mode')}
                  </Text> 
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("instructional", { page: "vayyarDevice" })}
                  style={[screenSty.row, styles.lastOptionBox]}
                >
                  <Text style={[screenSty.font14, screenSty.contant]}>
                  {t('Instructional Videos')}
                  </Text>
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                </TouchableOpacity>

          
              </View>
          </ScrollView>
      }
      {
          !selView && <View style={[screenSty.contant]} >
            <ContactListScreen pageName={"vayyarDevice"} navigation={navigation} style={[screenSty.contant]}></ContactListScreen>
            </View>
      }
      <Loader loading={isLodering} />
    </View>
  );
};
const styles = StyleSheet.create({
  boxVal:{
    height:45,
    paddingTop:15,
    marginBottom:20,
    marginHorizontal:15
},
  optionBox: {
    paddingVertical: 12,
    marginHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.theme3,
  },
  lastOptionBox: {
    paddingVertical: 12,
    marginHorizontal: 10,
  }
});

export default VayyarDeviceScreen;
