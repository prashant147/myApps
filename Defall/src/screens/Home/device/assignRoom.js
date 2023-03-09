import * as React from "react";
import { useState,useContext,useEffect } from "react";
import {TouchableOpacity, StyleSheet,Text, View, TouchableWithoutFeedback,Keyboard, TextInput } from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import buttonSty from "../../../style/buttonSty";
import inputSty from "../../../style/inputSty";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { useIsFocused } from "@react-navigation/native";
import InputScrollView from "react-native-input-scroll-view";
import { Unit } from "../../Unit"; 
import { addRoomData, addRoomInfo, assignRooms, deleteApartment, deleteRoom, deleteRoomConfig, setApartmentName, setCompanySettings, syncDeviceById } from "../../../redux/Actions/auth";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import TextFieldUI from "../../common/TextFieldUI";
import SelectFieldUI from "../../common/SelectFieldUI";
import StateContext from "../../../context/stateContext";

const AssignRoomScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice,roomType,resident,selCompany  } = useContext(StateContext)
  const [room_name, setRoom_name] = useState(null);
  const [selroomType, setSelroomType] = useState(0);
  const [oldRoomId, setOldRoomId] = useState(0);
  const [isLodering, setIsLodering] = useState(false);
  const isFocused = useIsFocused();

  useEffect( () => {
    async function fetchData() {
      setSelroomType(selDevice.roomType);
        setOldRoomId(selDevice.roomType);
        setRoom_name(selDevice.apartment_name)
    }
    fetchData();
    return () => { }
  }, [isFocused]);

  const SaveDeviceRoom = async () => {
    if (Unit.isNumberVal(selroomType,"Please enter sensor detection area type")) { return }
    if (Unit.isEmpty(room_name,"Please enter sensor detection area name")) { return }
    let room = roomType.filter((e) => e.value == selroomType);
    if (oldRoomId == selroomType) {
      setIsLodering(true);
      let res = await setApartmentName(selDevice.apartment_id,room_name,selDevice.vayyar_room_id,auth?.token)
      setIsLodering(false);
      if(res.status){
        Unit.alertMes("Sensor Detection Area name updated successfully")
      }
        
    } else {
      setIsLodering(true);

      await deleteRoom(selDevice.deviceId,selDevice.vayyar_room_id,auth?.token)
      await deleteRoomConfig(selDevice.deviceId,auth?.token)
      //await deleteApartment(selDevice.apartment_id,auth?.token)

      let res12 = await addRoomData(resident.id,selroomType,room[0].label,selCompany.id,auth?.token,room_name,resident.apartment_id,`${resident.lastName} Residence`)
      if(res12){

        let res2 = await addRoomInfo(room[0].label,res12.data.apartment_id,res12.data.room_id,res12.data.apartment_name,selCompany.id,auth?.token)

        await assignRooms(selDevice.deviceId,res2.id,auth?.token)
        await syncDeviceById(selDevice.deviceId,selCompany.id,auth?.token)
        await setCompanySettings(auth?.token,selCompany.id)
        navigation.navigate("ResidentList");
      }
   
      setIsLodering(false);
    }

  };
  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} backPop={()=>navigation.navigate("vayyarDevice")} title={'Assign Sensor Detection Area'} backPage={'vayyarDevice'} isResident={true}></AppHeader>
      <View style={[screenSty.contant,screenSty.padding15H]}>
        <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[screenSty.box, screenSty.margin30Top]}>
              <View style={[screenSty.HeaderBoxVal]}>
                <Text style={[screenSty.font16]}>{t("Assign Sensor Detection Area")}</Text>
              </View>
              <View style={screenSty.margin10H}>
              <Text
                style={[screenSty.font13, screenSty.margin10Top, screenSty.margin20H, screenSty.centerTxt]}
              >
                {t("Please select the rooms where you want to install the Fall Detector devices. You can select multiple bedrooms, bathrooms.")}
              </Text>
              <View style={[screenSty.margin20Top]}>

                <SelectFieldUI
                    inputTitle={'Select Sensor Detection Area'}
                    onChangeText={(txt) => setSelroomType(txt)}
                    placeholder={{ label: "Select a Sensor Detection Area type..", value: "" }}
                    value={selroomType}
                    items={roomType}
                  />
                <TextFieldUI
                    onChangeText={(txt) => setRoom_name(txt)}
                    placeholder=""
                    value={room_name}
                    inputTitle="Sensor Detection Area Name"
                  />

              </View>

              <View style={[screenSty.centerItem, screenSty.margin20TopBottom]}>
                <TouchableOpacity
                  style={buttonSty.buttonBox}
                  onPress={() => {
                    SaveDeviceRoom();
                  }}
                >
                  <Text style={buttonSty.buttonBoxTxt}>Update</Text>
                </TouchableOpacity>
              </View>

              </View>

            </View>
          </TouchableWithoutFeedback>
        </InputScrollView>
      </View>
      <Loader loading={isLodering} />
    </View>
  );
};


export default AssignRoomScreen;
