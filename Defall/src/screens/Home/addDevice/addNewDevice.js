import * as React from 'react';
import { useState, useContext } from 'react';
import { TouchableOpacity, Keyboard, TouchableWithoutFeedback, StatusBar, StyleSheet, Text, View, TextInput, Image, Platform,  ScrollView, PermissionsAndroid } from 'react-native';
import screenSty from '../../../style/screenSty';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from "@rneui/themed";
import buttonSty from '../../../style/buttonSty';
import ButtonGroup from '../../common/nextButton';
import { RNCamera } from "react-native-camera";
import BarcodeMask from 'react-native-barcode-mask';
import InputScrollView from 'react-native-input-scroll-view';
import AppHeader from '../../common/AppHeader';
import { useIsFocused } from '@react-navigation/native';
import { color } from '../../../config/configuration';
import { Unit } from '../../Unit';
import TextFieldUI from '../../common/TextFieldUI';
import { useTranslation } from 'react-i18next';
import '../../../i18n/i18n';
import StateContext from '../../../context/stateContext';

const AddNewDeviceScreen = ({ navigation }) => {
    const {t, i18n} = useTranslation();
    const { auth,setSelDevice } = useContext(StateContext)

    const [deviceInfo, setdeviceInfo] = useState('')
    const [isBarBox, setIsBarBox] = useState(false)


    const isFocused = useIsFocused();
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
    React.useEffect(() => {

        setdeviceInfo('')
        if (auth.deviceInfo != null) {
            setdeviceInfo(auth.deviceInfo)
        }
        if(Platform.OS=="android"){
            requestCameraPermission();
          }
        return () => { }
    }, [isFocused]);


    const nextBut = async () => {
        if (Unit.isEmpty(deviceInfo,'Please enter device code or Serial Number ')) { return}
        await setSelDevice(deviceInfo);
        navigation.navigate('stepsaddBluetooth');
    }
    const backBut = () => {
        navigation.navigate('addroomDevice')
    }
    const onSucessScan = (barcodes) => {
        if (barcodes.length > 0) {

            if (barcodes[0].type == "CONTACT_INFO" || barcodes[0].type == "QR_CODE") {
                setdeviceInfo(barcodes[0].data)
                setIsBarBox(false)
                //EAN_13
            }
        }


    }
    const scanBarcodeResult = (scanResult) => {

        if (scanResult.type == "org.iso.Code128" || scanResult.type == "org.iso.QRCode") {
            setdeviceInfo(scanResult.data);
            setIsBarBox(false);
        }
    }
    const closeBarCode = () => {
        setIsBarBox(false);
    } 
    return (
        <View style={[screenSty.contant,screenSty.backgroundColor]}>
            <AppHeader  title={'Add New Device'} navigation={navigation} currentPage={'addroomDevice'} backPage={'addroomDevice'} isResident={true}></AppHeader>
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

                    <View  style={[screenSty.contant]} >
                        <InputScrollView keyboardOffset={100} useAnimatedScrollView={true} >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <ScrollView style={[{ marginBottom: 100 }, screenSty.padding15H]}>
                                    <Text style={[screenSty.font17, screenSty.margin10TopBottom, screenSty.colorBold, screenSty.centerTxt, { color: color.primary }]}>{t("Step 2 of 5")}</Text>
                                    <View style={screenSty.centerItem}>
                                        <Image source={require("../../../assets/homedevice.png")} style={screenSty.installImage} ></Image>
                                    </View>

                                    <Text style={[screenSty.font15,
                                    screenSty.margin20H,
                                    screenSty.margin20TopBottom,
                                    screenSty.centerTxt]}>
                                        {t("Let's onboard the device. Please enter the serial number of the device or scan the QR code on top of the device.")}</Text>
                                    <View style={[screenSty.margin10Top, screenSty.padding10H]}>
                                        <TextFieldUI
                                            onChangeText={(txt) => setdeviceInfo(txt)}
                                            placeholder=""
                                            inputTitle="Enter Serial Number"
                                            autoCapitalize = {'characters'}
                                            value={deviceInfo}
                                           />

                                    </View>

                                    <View style={[screenSty.row, screenSty.margin10Top,screenSty.centerContent]}>
                                        <View style={styles.border}></View>
                                        <Text style={{ textAlign: 'center', width: '20%' }}>OR</Text>
                                        <View style={styles.border}></View>
                                    </View>
                                    <View style={[screenSty.margin20TopBottom, screenSty.centerItem]}>
                                        <TouchableOpacity style={buttonSty.buttonBox} onPress={() => setIsBarBox(true)} >
                                            <Text style={buttonSty.buttonBoxTxt}>{t("Scan Code")}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </TouchableWithoutFeedback>
                        </InputScrollView>

                        <ButtonGroup onClickBack={backBut} onClickNext={nextBut} />
                    </View>
                </View>
            }
        </View>
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

export default AddNewDeviceScreen;