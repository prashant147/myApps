import * as React from "react";
import { useState, useEffect,useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions, 
} from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import inputSty from "../../../style/inputSty";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { openComposer } from "react-native-email-link";
import { APP_VERSION, color, screen_size } from "../../../config/configuration";
import { useIsFocused } from "@react-navigation/native";
import InputScrollView from "react-native-input-scroll-view";
import { Unit } from "../../Unit";
import { RFValue } from "react-native-responsive-fontsize";
import SelectFieldUI from "../../common/SelectFieldUI";
import TextFieldUI from "../../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import StateContext from "../../../context/stateContext";
import ButtonGroup from "../../common/nextButton";
import { getRooms, getWingList } from "../../../redux/Actions/auth";

const AddroomDeviceScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, resident,roomType,selCompany,companyType,setRoom } = useContext(StateContext)
  const [selroomType, setSelroomType] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [wingName, setWingName] = useState("");
  const [wingList, setWingList] = useState([]);
  const [isLodering, setIsLodering] = useState(false);
  const isFocused = useIsFocused();
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    setSelroomType(null);
    console.log(resident)
    if(companyType=="2"){
      getWingsList();
      setRoomName(null);
    }else{
      setWingName(resident.wing_id?resident.wing_id:0)
      setRoomName(resident?`${resident.first_name} ${resident.last_name}`:null);
    }
    getRoomList()
  }, [isFocused]);

  const getWingsList = async()=>{
    let Wings  = await getWingList(auth?.token, selCompany.id);
    setWingList(Wings);
    if(resident.wing_id){
      setWingName(resident.wing_id)
    }
  }
  const getRoomList = async()=>{
    let room  = await getRooms(auth?.token, selCompany.id);
    setRoomList(room.data);
    if(resident.apartment_id){
      setRoomName(resident.apartment_name)
    }
  }
  const nextBut = () => {

    if(companyType=="2"){
      if (Unit.isEmpty(wingName,"Please select wing")) { return }
    }
    if (Unit.isNumberVal(selroomType,"Please enter sensor detection area type")) { return }
    if (Unit.isEmpty(roomName,"Please enter sensor detection area name")) { return }

    if(roomList){
      let isRoom = roomList.filter((e)=>e.apartment_name==roomName && e.bedroom_count==selroomType==1?true:false && e.living_room_count==selroomType==2?true:false && e.kitchen_count==selroomType==4?true:false && e.bathroom_count==selroomType==3?true:false );
      if(isRoom.length==0){
        let room = roomType.filter((e) => e.value == selroomType);
        setRoom({
          wingName:wingName,
          sub_room_name:room[0].label,
          roomTypeId:selroomType,
          apartment_name:roomName
        } );
        setIsLodering(false);
        navigation.navigate("addNewDevice");
      }else{
        Unit.alertMes("Sensor detection area name already exists");
        return;
      }
    }else{
      let room = roomType.filter((e) => e.value == selroomType);
      setRoom({
        sub_room_name:room[0].label,
        roomTypeId:selroomType,
        apartment_name:roomName
      } );
      setIsLodering(false);
      navigation.navigate("addNewDevice");
    }
    
    

  };
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
  return (
    <View style={[screenSty.contant,screenSty.backgroundColor]}>

       <AppHeader title={'Add New Device'} navigation={navigation} currentPage={'addNewDevice'} backPage={'deviceList'} isResident={true}></AppHeader>
       


      <View  style={[screenSty.contant]} >

        <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={[{ marginBottom: 100 }, screenSty.padding15H]}>

              <Text style={[screenSty.font17, screenSty.margin10TopBottom, screenSty.colorBold, screenSty.centerTxt, { color: color.primary }]}>{t("Step 1 of 5")}</Text>
              <View style={[screenSty.centerItem]}>
                <Image source={require("../../../assets/addnewroom.png")} style={screenSty.installImage}></Image>
              </View>

              <Text style={[
                screenSty.font15,
                screenSty.colorSemiBold,
                screenSty.margin20H,
                screenSty.margin20TopBottom,
                screenSty.centerTxt]}>
                {t("Device can scan a Sensor Detection Area up to 13 foot long and 13 foot wide. You may need multiple devices if your Sensor Detection Area is bigger than this. Please")}{" "}
                <TouchableOpacity onPress={() => openMailBox()}>
                  <Text
                    style={[{
                      fontSize: RFValue(17,screen_size),
                      color: "rgb(108,96,222)",
                      marginBottom: -5,
                      textDecorationLine: "underline",
                    }]}
                  >
                    {t("contact us")}
                  </Text>
                </TouchableOpacity>
                {" "}
                {t("for support")}.
              </Text>
             <View 
                  style={[
                    screenSty.row,
                    screenSty.margin20Bottom
                  ]}
                >
                  <Text style={[inputSty.TextLab]}>{t("Select Sensor Detection Area")}</Text>
                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "rgb(167,157,255)",
                    }}
                  ></View>
              </View>
           
            <View style={screenSty.margin20Top}>
                {
                  companyType=="2" && <SelectFieldUI
                    placeholder={{ label: "Select a wing", value: null }}
                    onChangeText={(txt) => setWingName(txt)}
                    isRequired={true}
                    inputTitle="Wing"
                    value={wingName}
                    items={wingList} 
                   />
                }

                <TextFieldUI
                    onChangeText={(txt) => setRoomName(txt)}
                    placeholder=""
                    inputTitle={(companyType=="1" || companyType==null)?"Sensor Detection Area Name":"Room Number"}
                    isRequired={true}
                    value={roomName}
                    editable={!resident.apartment_name}
                  />
                <SelectFieldUI
                    onChangeText={(txt) => setSelroomType(txt)}
                    placeholder={{ label: "Select a Sensor Detection Area type..", value: null }}
                    isRequired={true}
                    inputTitle="Room Type"
                    value={selroomType}
                    items={roomType}
                  />
          
            
                </View>
               
              </ScrollView>
            </TouchableWithoutFeedback>
          </InputScrollView>
          
    
        <ButtonGroup
          isBack={true}
          onClickNext={nextBut}
        />
      </View> 
      <Loader loading={isLodering} />
    </View>
  );
};
const styles = StyleSheet.create({
  marginTop30: {
    marginTop: 20,
  },
  image: {
    height: 150,
    resizeMode: "contain",
  },
  videoBoxTxt: {
    color: "#ff0000",
  },
  videoBox: {
    borderColor: "#ff0000",
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    width: "60%",
    marginLeft: "20%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    flexDirection: "row",
  },
});
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

export default AddroomDeviceScreen;
