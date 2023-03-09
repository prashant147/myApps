import React, { Component, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon, Overlay } from "@rneui/themed";
import screenSty from "../../style/screenSty";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
const PermissionDialog = (props) => {
  const {t, i18n} = useTranslation();
  const [isF, setIsF] = useState(true);
  React.useEffect(() => {
    _checkAllPermissions()
}, [isF]);

  const _requestCameraPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      if (Platform.Version > 30) {
      _checkBluetoothPermissions()
      }else{
        _checkAllPermissions();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const _checkCameraPermissions = async () => {
    const cameraStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'DeFall needs access to your Camera',
      }
    );

    if (cameraStatus) {

      if (Platform.Version > 30) {
        _checkBluetoothPermissions()
      }else{
        _checkAllPermissions();
      }
    
    } else {
      _requestCameraPermission();
    }
  
  };
  const _checkBluetoothPermissions = async () => {
    const readPhonestatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    );
    if (readPhonestatus ) {
      _checkAllPermissions();
    } else {
      _requestBluetoothPermission();
    }
  };
  const _requestBluetoothPermission= async () => {
    try {
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'DeFall needs access to your Bluetooth',
          }
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        );

        checkLocationPermissions();
        
        _checkAllPermissions();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const checkLocationPermissions = async () => {
    const readLocationStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    console.log(readLocationStatus)
    if (readLocationStatus) {
      _checkCameraPermissions();
    } else {
      _requestLocationPermission();
    }
  };
  const _requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'DeFall needs access to your location',
          }
        );
        if(granted){
          _checkCameraPermissions();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  

  _checkAllPermissions = async () => {
    const cameraStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    const readLocationStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (
      cameraStatus &&
      readLocationStatus
    ) {
     
      props.closeModal();
    }else{
      _requestLocationPermission();
    }
  };

  showModalContent = () => {
    return (
      <View>
        <Overlay isVisible={true} overlayStyle={{width:'90%',height:'60%'}}>
          <View >
            <View style={styles.crossIcon}>
              <TouchableOpacity onPress={props.closeModal}>
                <Icon name="close-circle-outline" type='ionicon'  ></Icon>
              </TouchableOpacity>
            </View>
            <View style={{ paddingBottom: 5 }}>
              <Text style={styles.contactUsText}>
                {t("Required Permission")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "center",
                height: 5,
              }}
            >
              <View style={styles.line} />
              <View style={styles.dot} />
              <View style={styles.line} />
            </View>

            <View style={{ padding: 10, marginTop: 10, width: "100%" }}>
            <View>
                <TouchableOpacity
                  onPress={checkLocationPermissions}
                >
                  <View
                    style={[
                      screenSty.row,
                      { marginTop: 8, backgroundColor: "#f0f0f0" },
                    ]}
                  >
                    <View style={styles.studiesMenuIconContainer}>
                      <View>
                        <Icon name="location" type='ionicon'  ></Icon>
                      </View>
                    </View>
                    <View
                      style={[screenSty.contant,styles.studiesMenuContainer]}
                    >
                      <Text  style={[{ color: "#2b3235" }]} >
                        {t("DeFall needs access to your location to scan connected wifi networks using the app")}
                        
                      </Text>
                    </View>
                    <View  style={[styles.studiesMenuArrowBox]} >
                       <Icon name="arrowright" type='antdesign'  ></Icon>
                    </View>
                  </View>
                </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={_checkCameraPermissions}
              >
                <View
                  style={[
                    screenSty.row,
                    { marginTop: 8, backgroundColor: "#f0f0f0" },
                  ]}
                >
                  <View style={styles.studiesMenuIconContainer}>
                    <View>
                      <Icon name="camerao" type='antdesign'  ></Icon>
                    </View>
                  </View>
                  <View
                    style={[screenSty.contant,styles.studiesMenuContainer]}
                  >
                    <Text  style={[{ color: "#2b3235" }]} >
                      {t("DeFall needs access to your camera to scan QR code and help to get information to Sensor Detection Area using the app")}
                    </Text>
                  </View>
                  <View  style={[styles.studiesMenuArrowBox]} >
                      <Icon name="arrowright" type='antdesign'  ></Icon>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={_checkBluetoothPermissions}>
                <View
                  style={[
                    screenSty.row,
                    { marginTop: 8, backgroundColor: "#f0f0f0" },
                  ]}
                >
                  <View style={styles.studiesMenuIconContainer}>
                    <View>
                      <Icon name="bluetooth" type='font-awesome'  ></Icon>
                    </View>
                  </View>
                  <View  style={[screenSty.contant,styles.studiesMenuContainer]} >
                    <Text
                      style={[
                        screenSty.subMenuListItemsText,
                        { color: "#2b3235" },
                      ]}
                    >
                      {t("DeFall needs access to your Bluetooth to connect devices using the app")}
                     
                    </Text>
                  </View>
                  <View style={[ styles.studiesMenuArrowBox  ]}>
                    <Icon name="arrowright" type='antdesign'  ></Icon>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            </View>
          </View>
        </Overlay>
      </View>
    );
  };
  return (
    <View>{props.showModal ? showModalContent() : null}</View>
  )
}

const styles = StyleSheet.create({
  studiesMenuContainer:{
    paddingVertical:10
  },
  studiesMenuIconContainer:{
    justifyContent:'center',
    paddingHorizontal:10
  },
  studiesMenuArrowBox:{
    justifyContent:'center',
    paddingHorizontal:10
  },
  contactUsText: {
    fontWeight: "700",
    color: "#263b43",
    textAlign: "center",
    marginTop: -5,
    fontSize: RFValue(18),
  },
  contentText: {
    fontSize: RFValue(14),
    color: "#546166",
    textAlign: "center",
    paddingBottom: 15,
    fontWeight: "400",
  },
  crossIcon: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 5,
    marginTop: 8,
  },
  dot: {
    height: 4,
    width: 4,
    justifyContent: "center",
    borderRadius: 4 / 2,
    backgroundColor: "#263b43",
  },
  line: {
    height: 1,
    width: 40,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 1.5,
    justifyContent: "center",
    backgroundColor: "#d9d9d9",
  },
});
export default PermissionDialog;
