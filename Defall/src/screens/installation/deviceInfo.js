import * as React from 'react';
import { useState,useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, TextInput, View, Platform, ScrollView, PermissionsAndroid } from 'react-native';
import buttonSty from '../../style/buttonSty';
import inputSty from '../../style/inputSty';
import screenSty from '../../style/screenSty';
import InstalHeader from '../common/instalProgress';
import ButtonGroup from '../common/nextButton';
import { RNCamera } from "react-native-camera";
import { SafeAreaView } from 'react-native-safe-area-context';
import BarcodeMask from 'react-native-barcode-mask';
import { Device } from '../../redux/Actions/auth';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from "@rneui/themed";
import { color } from '../../config/configuration';
import { useIsFocused } from '@react-navigation/native';
import { Unit } from '../Unit';
import TextFieldUI from '../common/TextFieldUI';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';
import StateContext from '../../context/stateContext';

const DeviceInfoScreen = ({ navigation }) => {
   const {t, i18n} = useTranslation();
   const [deviceInfo, setdeviceInfo] = useState('')
   const [isBarBox, setIsBarBox] = useState(false)
   const { setSelDevice} = useContext(StateContext)
   const nextBut = async () => {
      if (Unit.isEmpty(deviceInfo,'Please enter device code or Serial Number')) { return }
      await setSelDevice(deviceInfo);
      navigation.navigate('stepsBluetooth');
   }

   const closeBarCode = () => {
      setIsBarBox(false);
   }
   const onSucessScan = (barcodes) => {
      try{
         if (barcodes.length > 0) {
            if (barcodes[0].type == "CONTACT_INFO" || barcodes[0].type == "QR_CODE") {
               setdeviceInfo(barcodes[0].data)
               setIsBarBox(false)
               //EAN_13
            }
         }
      }catch(e){
         return
      }
   }
   const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "DeFall Camera Permission",
            message:
            "DeFall needs access to your camera to scan QR code and help to get information to Sensor Detection Area using the app.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        } else {

        }
      } catch (err) {
        console.warn(err);
      }
    };
   const scanBarcodeResult = (scanResult) => {
      if (scanResult.type == "org.iso.Code128" || scanResult.type == "org.iso.QRCode") {
         setdeviceInfo(scanResult.data);
         setIsBarBox(false);
      }
   }
   const isFocused = useIsFocused();
   React.useEffect(() => {
      if(Platform.OS=="android"){
         requestCameraPermission();
       }
      return () => { }
  }, [isFocused]);
   return (
      <SafeAreaView style={screenSty.contant}>
         {
                isBarBox && <View style={screenSty.contant}>

                    {
                        Platform.OS == "android" ?
                            (<RNCamera
                               
                                defaultTouchToFocus
                                flashMode={RNCamera.Constants.FlashMode.off}
                                mirrorImage={false}
                                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                                    onSucessScan(barcodes);
                                }}
                                barCodeTypes={["CODE_128", "CODE_39", "QR_CODE"]}

                                onFocusChanged={() => { }}
                                onZoomChanged={() => { }}
                                captureAudio={false}
                                androidCameraPermissionOptions={{
                                    title: "Camera Permission",
                                    message:
                                        "eResearch needs access to your camera to verify your identity and capture images you send using the app",
                                    buttonPositive: "Ok",
                                    buttonNegative: "Cancel",
                                }}
                                style={styles.preview}
                                type={RNCamera.Constants.Type.back}
                            >
                                <BarcodeMask />
                                <TouchableOpacity onPress={() => closeBarCode()} style={styles.barCodeClose}>
                                    <Icon type="font-awesome" name="times" color={'#fff'} size={20}></Icon>
                                </TouchableOpacity>
                            </RNCamera>) :
                            (<RNCamera
                               
                                defaultTouchToFocus
                                flashMode={RNCamera.Constants.FlashMode.off}
                                mirrorImage={false}
                                barCodeTypes={["org.iso.Code128","org.iso.Code39", 'org.iso.QRCode']}
                                onBarCodeRead={scanBarcodeResult}
                                onFocusChanged={() => { }}
                                onZoomChanged={() => { }}
                                captureAudio={false}
                                style={styles.preview}
                                type={RNCamera.Constants.Type.back}
                            >
                                <BarcodeMask />
                                <TouchableOpacity onPress={() => closeBarCode()} style={styles.barCodeClose}>
                                    <Icon type="font-awesome" name="times" color={'#fff'} size={20}></Icon>
                                </TouchableOpacity>
                            </RNCamera>
                            )
                    }</View>
            }
         { 
            !isBarBox && <View style={screenSty.contant}>
               <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >

                  <InstalHeader navigation={navigation} progress={0.6} backPage={"addRoom"} />
                  <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
                     <View style={[screenSty.centerContent]}>
                        <Image source={require("../../assets/deviceInfo.png")} style={screenSty.installImage} ></Image>
                     </View>
                     <Text style={[
                        screenSty.font15,
                        screenSty.margin20H,
                        screenSty.margin20TopBottom,
                        screenSty.centerTxt
                     ]}>
                        Let's onboard the device. Please enter the serial number of the device or scan the QR code on top of the device.</Text>
                     <View style={screenSty.margin10TopBottom}>
                        <TextFieldUI
                           onChangeText={(txt) => setdeviceInfo(txt)}
                           placeholder=""
                           inputTitle="Enter Serial Number"
                           autoCapitalize = {'characters'}
                           value={deviceInfo}
                           borderViews={[deviceInfo != "" ? inputSty.TextInput : inputSty.empityTxt]}
                        />

                     </View>
                     <View style={[screenSty.row, screenSty.centerContent]}>
                        <View style={styles.border}></View>
                        <Text style={{ textAlign: 'center', width: '20%' }}>OR</Text>
                        <View style={styles.border}></View>
                     </View>
                     <View style={[screenSty.margin10Top, screenSty.centerItem, screenSty.margin30Bottom]}>
                        <TouchableOpacity style={buttonSty.buttonBox} onPress={() => setIsBarBox(true)} >
                           <Text style={buttonSty.buttonBoxTxt}>Scan Code</Text>
                        </TouchableOpacity>
                     </View>
                  </ScrollView>

               </LinearGradient>
               <ButtonGroup onClickNext={nextBut} onClickBack={()=>navigation.navigate('addRoom')} />
            </View>
         }
      </SafeAreaView>
   )
}
const styles = StyleSheet.create({
   barCodeClose: {
      position: 'absolute',
      top: 10,
      right: 20
   },
   border: {
      width: '20%', borderBottomColor: color.primary, 
      paddingTop:8,
      borderBottomWidth: .5, marginBottom: 8
   },
   preview: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
   }
});

export default DeviceInfoScreen;