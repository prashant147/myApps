import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  TouchableOpacity, StyleSheet, Text, View,
  Image, TextInput,  TouchableWithoutFeedback, Keyboard, ScrollView
} from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import buttonSty from "../../../style/buttonSty";
import inputSty from "../../../style/inputSty";
import { Overlay } from "@rneui/themed";
import InputScrollView from "react-native-input-scroll-view";
import VeviceInfo from "../../common/deviceInfo";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader"; 
import { addRoomSubRegion,  sub_region_details } from "../../../redux/Actions/auth";
import { color } from "../../../config/configuration";
import { Unit } from "../../Unit";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import TextFieldUI from "../../common/TextFieldUI";
import StateContext from "../../../context/stateContext";

const AddSubRegionsResizeScreen = ({ route, navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice  } = useContext(StateContext)
  const { sub_region } = route.params;
  let user_room_sub_region_details_id = route.params
    .user_room_sub_region_details_id
    ? route.params.user_room_sub_region_details_id
    : 0;

  const [roomSizeLeft, setRoomSizeLeft] = useState(null);
  const [roomSizeLeft1, setRoomSizeLeft1] = useState(null);

  const [roomSizeRight, setRoomSizeRight] = useState(null);
  const [roomSizeRight1, setRoomSizeRight1] = useState(null);

  const [roomSizeFront, setRoomSizeFront] = useState(null);
  const [roomSizeFront1, setRoomSizeFront1] = useState(null);

  const [visible, setVisible] = useState(false);
  const [isLodering, setIsLodering] = useState(false);
  const ref_left1 = useRef();
  const ref_right1 = useRef();
  const ref_left2 = useRef();
  const ref_right2 = useRef();
  const ref_left3 = useRef();
  const ref_right3 = useRef();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    async function fetchData() { 
      setIsLodering(true);
      let res1 = await sub_region_details(user_room_sub_region_details_id, auth?.token)
      setIsLodering(false);
      let val = res1.data.result;
      setRoomSizeLeft(val.far_from_left_feet + "");
      setRoomSizeLeft1(val.far_from_left_inches + "");
      setRoomSizeRight(val.far_from_right_feet + "");
      setRoomSizeRight1(val.far_from_right_inches + "");
      setRoomSizeFront(val.far_from_front_feet + "");
      setRoomSizeFront1(val.far_from_front_inches + "");
    }
    if (user_room_sub_region_details_id != 0) {
      fetchData();
    } else {
      setRoomSizeLeft(null);
      setRoomSizeLeft1(null);
      setRoomSizeRight(null);
      setRoomSizeRight1(null);
      setRoomSizeFront(null);
      setRoomSizeFront1(null);
    }
    return () => { }
  }, [selDevice, user_room_sub_region_details_id, isFocused]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const saveSubRegionsData = async () => {
    if (Unit.isEmpty(roomSizeLeft,"Please enter sensor detection area left feet ")) { return }
    if (Unit.isEmpty(roomSizeLeft1)) {  setRoomSizeLeft1("0"); }
    if (roomSizeLeft1 > 12) { Unit.alertMes("Sensor Detection Area left can not be more than 12 inch");
      return ;
    }
    if (Unit.isEmpty(roomSizeRight,"Please enter sensor detection area right feet ")){  return  }
    if (Unit.isEmpty(roomSizeRight1)) { setRoomSizeRight1("0"); }
    let right = roomSizeRight * 12 + (roomSizeRight1 == null ? 0 : parseInt(roomSizeRight1));
    if (right > 156) {
      Unit.alertMes("Sensor Detection Area right can not be more than 13 feet");
      return true;
    }
    if (roomSizeRight1 > 12) {
      Unit.alertMes("Sensor Detection Area right can not be more than 12 inch");
      return true;
    }
    if (Unit.isEmpty(roomSizeFront,"Please enter sensor detection area front feet ")) { return }
    if (Unit.isEmpty(roomSizeFront1)) {  setRoomSizeFront1("0"); }
    let front = roomSizeFront * 12 + (roomSizeFront1 == null ? 0 : parseInt(roomSizeFront1));
    if (front > 156) {
      Unit.alertMes("Sensor Detection Area front can not be more than 13 feet");
      return 
    }
    if (roomSizeFront1 > 12) {
      Unit.alertMes("Sensor Detection Area front can not be more than 12 inch");
      return 
    }
    try{
      setIsLodering(true);
      await addRoomSubRegion(
        selDevice.deviceId,
        selDevice.subroom_id,
        sub_region.furniture_type_size_id,
        sub_region.user_room_measurements_id,
        sub_region.sub_region_name.trim(),
        sub_region.furniture_custom_length,
        sub_region.furniture_custom_width,
        sub_region.presence_detection,
        sub_region.fall_detection,
        roomSizeLeft,
        roomSizeLeft1,
        roomSizeRight,
        roomSizeRight1,
        roomSizeFront,
        roomSizeFront1,
        auth?.token,
        sub_region.user_room_sub_region_id,
        selDevice
      ).then( res=>{
        setIsLodering(false);
        if (res.status) {
          selDevice.sub_region_configured = true;
          let mes = user_room_sub_region_details_id == 0 ? "Sub-region saved successfully" : "Sub-region updated successfully";
          Unit.alertMes(mes);
          navigation.navigate("vayyarDevice");
        } else {
          Unit.alertMes(res.message);
        }
      })
    
    }catch(e){

      Unit.alertMes("Incorrect values in WalabotConfig");
      setIsLodering(false);
      return
    }
  };

  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} backPop={()=>navigation.navigate("addSubRegions",{
        "user_room_measurements_id": sub_region.user_room_measurements_id,
        "room_sub": sub_region
      })} title={'Sub Regions'} backPage={'addSubRegions'} itemsData={{
        "user_room_measurements_id": sub_region.user_room_measurements_id,
        "room_sub": sub_region
      }} isResident={true}></AppHeader>
      <View style={[screenSty.contant,screenSty.padding15H]}>
        <Overlay isVisible={visible}>
          <View>
         {
           /*
            <ImageZoom
              cropWidth={Dimensions.get("window").width}
              cropHeight={Dimensions.get("window").height}
              imageWidth={200}
              imageHeight={200}
            >
              <Image source={bg}></Image>
            </ImageZoom>
           */
         }  
            <TouchableOpacity
              style={{ position: "absolute", right: 20, top: 100 }}
              onPress={() => {
                setVisible(false);
              }}
            >
              <Icon type="font-awesome" name="times-circle" size={30} color={color.primary} />
            </TouchableOpacity>
          </View>
        </Overlay>
        <ScrollView style={{paddingBottom:50}}>
          <VeviceInfo></VeviceInfo>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
              <View style={[screenSty.box, screenSty.margin30Bottom]}>
                <View style={[screenSty.HeaderBoxVal]}>
                  <Text style={[screenSty.font16]}>
                  {t("Sub Regions")} - {sub_region.sub_region_name}
                  </Text>
                </View>

                <View style={[screenSty.centerItem, screenSty.margin20Top]}>
                  <TouchableOpacity onPress={() => {
                    setVisible(true);
                  }}
                  >
                    <Image source={require("../../../assets/subItems.png")}></Image>
                  </TouchableOpacity>
                </View>
                <View style={[screenSty.margin20Top,screenSty.margin10H]}>


                <View style={[screenSty.row, screenSty.margin20Top]}>
                  
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.marginLeft10]}>
                  {t('Left')}
                  </Text>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                    <TextFieldUI
                    onChangeText={(txt) => setRoomSizeLeft(txt)}
                    placeholder=""
                    keyboardType={"numeric"}
                    rightTxt={'Ft.'}
                    value={roomSizeLeft}
                  />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                     <TextFieldUI
                    onChangeText={(txt) => setRoomSizeLeft1(txt)}
                    placeholder=""
                    keyboardType={"numeric"}
                    rightTxt={'In.'}
                    value={roomSizeLeft1}
                  />
                  </View>
                  
                </View>
                <View style={[screenSty.row]}>
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.marginLeft10]}>
                  {t('Right')}
                  </Text>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeRight(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeRight}
                      />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeRight1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeRight1}
                      />
                  </View>

                </View>
                <View style={[screenSty.row]}>
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.marginLeft10]}>
                  {t('Front')}
                  </Text>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeFront(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeFront}
                      />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeFront1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeFront1}
                      />
                  </View>

                </View>

                </View>


                <View style={[screenSty.centerItem, screenSty.margin20TopBottom]}>
                  <TouchableOpacity
                    style={buttonSty.buttonBox}
                    onPress={saveSubRegionsData}
                  >
                    <Text style={buttonSty.buttonBoxTxt}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </InputScrollView>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
      <Loader loading={isLodering} />
    </View>
  );
};
const styles = StyleSheet.create({
  marginTop30: {
    marginTop: 30,
  },
  image: {
    width: "100%",
    resizeMode: "stretch",
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

export default AddSubRegionsResizeScreen;
