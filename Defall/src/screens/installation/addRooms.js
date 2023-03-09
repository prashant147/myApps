import * as React from "react";
import { useState,useContext } from "react";
import {
  Image,  Text, TextInput,
  View, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet
} from "react-native";
import screenSty from "../../style/screenSty";
import InstalHeader from "../common/instalProgress";
import inputSty from "../../style/inputSty";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import ButtonGroup from "../common/nextButton";
import Loader from "../common/Loader";
import { openComposer } from "react-native-email-link";
import { ScrollView } from "react-native-gesture-handler";
import InputScrollView from "react-native-input-scroll-view";
import { APP_VERSION, color } from "../../config/configuration";
import { useIsFocused } from "@react-navigation/native";
import { Unit } from "../Unit";
import SelectFieldUI from "../common/SelectFieldUI";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const AddRoomScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth,roomType,resident,setRoom} = useContext(StateContext)
  const [selRoomType, setselRoomType] = useState(null);
  const [roomName, setRoomName] = useState(resident?`${resident.first_name} ${resident.last_name}`:null);

  const [isLodering, setIsLodering] = useState(false);

  const isFocused = useIsFocused();

  const openMailBox = async () => {
    let Ubody = `Information needed:\n
    \nInstaller’s Name (First and Last):
    \nInstaller’s Email address:
    \nInstaller’s Phone number:
    \nOS Software Platform: ${Platform.OS}
    \nOS Software Version:${Platform.Version}
    \nWellAware Care App Software version :${APP_VERSION}
    \nWhat issue are you having?
    \nPlease include screen shots of the issue.`
    openComposer({
      to: "support@leiots.com",
      subject: "Setup Help",
      body: Ubody,
    });
  }
  const addRoomFun = async () => {

    if (Unit.isNumberVal(selRoomType,"Please enter Sensor Detection Area type")) { return; }
    if (Unit.isEmpty(roomName,"Please enter Sensor Detection Area name")){  return; }
   
    try{
      let room = roomType.filter((e) => e.value == selRoomType);

      await setRoom({
        sub_room_name:room[0].label,
        roomTypeId:selRoomType,
        apartment_name:roomName
      } );
        navigation.navigate("deviceInfo");
    }catch(e){ return ; }
  };
  return ( 
    <SafeAreaView style={screenSty.contant}>
      <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
        <InstalHeader navigation={navigation} progress={0.6} backPage={"contact"} />
        <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
          <InputScrollView keyboardOffset={150} useAnimatedScrollView={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[ screenSty.margin30Bottom]}>
                <View style={[screenSty.centerContent]}>
                  <Image source={require("../../assets/addRoom.png")} style={[screenSty.installImage]}></Image>
                </View>
                <Text
                  style={[
                    screenSty.font15,
                    screenSty.colorSemiBold,
                    screenSty.margin20H,
                    screenSty.margin20TopBottom,
                    screenSty.centerTxt
                  ]}
                >
                  Device can scan a sensor detection area up to 13 foot long and 13 foot wide. You
                  may need multiple devices if your sensor detection area is bigger than this.
                  Please{" "}
                  <TouchableOpacity onPress={() => openMailBox()}>
                    <Text
                      style={[ screenSty.font17,screenSty.colorBold,screenSty.colorPrimary,{
                        marginBottom: -5,
                        textDecorationLine: "underline",
                      }]}
                    >
                      contact us
                    </Text>
                  </TouchableOpacity>
                  {" "}
                  for support.
                </Text>
                <View 
                  style={[
                    screenSty.row,
                    screenSty.margin20Bottom
                  ]}
                >
                  <Text style={inputSty.TextLab}>Select Sensor Detection Area</Text>
                  <View
                    style={{ 
                      flex: 1,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "rgb(167,157,255)",
                    }}
                  ></View>
                </View>
                <View style={screenSty.margin20Top}>
                  <SelectFieldUI
                    onChangeText={(txt) => setselRoomType(txt)}
                    placeholder={{ label: "Select a Sensor Detection Area type..", value: "" }}
                    isRequired={true}
                    value={selRoomType}
                    items={roomType}
                  />
                  <TextFieldUI
                    onChangeText={(txt) => setRoomName(txt)}
                    placeholder=""
                    inputTitle="Sensor Detection Area Name"
                    isRequired={true}
                    value={roomName}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </InputScrollView>
        </ScrollView>
      </LinearGradient>
      <Loader loading={isLodering} />
      <ButtonGroup onClickNext={addRoomFun} onClickBack={()=>navigation.navigate("contact")} />
    </SafeAreaView>
  );
};

const pickerStyles = StyleSheet.create({
  inputIOS: {
    flex:1,
    color: color.primary,
    fontWeight: "400",
    paddingTop: 0,
    marginLeft: 0,
    height: 40,
    marginTop: 0,
  },
  inputAndroid: {
    flex:1,
    color: color.primary,
    fontWeight: "400",
    paddingTop: 0,
    marginLeft: 0,
    height: 40,
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginTop: 0,
  },
});
export default AddRoomScreen;
