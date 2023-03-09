import * as React from "react";
import { useState,useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import buttonSty from "../../../style/buttonSty";
import inputSty from "../../../style/inputSty";
import VeviceInfo from "../../common/deviceInfo";
import AppHeader from "../../common/AppHeader";
import Loader from "../../common/Loader";
import { useIsFocused } from "@react-navigation/native";
import { color, pickerSelectStyles, pickerSelectStyles1 } from "../../../config/configuration";
import { Unit } from "../../Unit";
import { getRegionSize, getRegionType } from "../../../redux/Actions/auth";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import TextFieldUI from "../../common/TextFieldUI";
import SelectFieldUI from "../../common/SelectFieldUI";
import StateContext from "../../../context/stateContext";

const AddSubRegionsScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice  } = useContext(StateContext)
  const [user_room_measurements_id, setUser_room_measurements_id] = useState(route.params.user_room_measurements_id);
  const room_sub = route.params.room_sub ? route.params.room_sub : null;
  const [isLodering, setIsLodering] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [OtherType, setOtherType] = useState(false);
  const [custom_length, setCustom_length] = useState(null);
  const [custom_width, setCustom_width] = useState(null);
  const [roomSize, setRoomSize] = useState(null);
  const [SubRegionTypeList, setSubRegionTypeList] = useState([]);
  const [SubRegionSizeList, setSubRegionSizeList] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [FallDetection, setFallDetection] = useState(false);
  const isFocused = useIsFocused();


  React.useEffect(() => {

    if (room_sub != null) {
      setRoomName(room_sub.sub_region_name);
      setCustom_length(room_sub.furniture_custom_length + "");
      setCustom_width(room_sub.furniture_custom_width + "");
      setIsEnabled(room_sub.presence_detection == 1 ? true : false);
      setFallDetection(room_sub.fall_detection == 1 ? true : false);
      setRoomType(room_sub.room_furniture_type_id);
      setRoomSize(room_sub.furniture_type_size_id);
      setTimeout(function () {
        setRoomSize(room_sub.furniture_type_size_id);
      }, 200)

    } else {
      setRoomName(null);
      setCustom_length(null);
      setCustom_width(null);
      setIsEnabled(true);
      setFallDetection(false);
      setRoomType("");
      setRoomSize("");
    }

    async function fetchData() {
      setIsLodering(true)
      let region = await getRegionType(selDevice.roomType, auth?.token)
      let SubRegionType = region.data.map(element => ({
        ...element, 
        "label": element.Furniture, 
        "value": element.id 
      }));
      setSubRegionTypeList(SubRegionType);
      setIsLodering(false)
    }

    fetchData()
    return () => { }
  }, [user_room_measurements_id, room_sub, isFocused]);


  const fillRoomSizeType = async (val, subSize = null) => {

    setRoomType(val);
    if (val != "") {

      setIsLodering(true)
      let regionSize = await getRegionSize(selDevice.roomType, val, auth?.token);
      let SubRegionType = regionSize.data.map(e => ({
          ...e, 
          label: e.length == null ? e.commercial_name : e.commercial_name + "  (" + e.length + "*" + e.width + ")",
          width: e.width,
          length: e.length,
          value: e.furniture_type_size_id,
        }));
        setSubRegionSizeList(SubRegionType);
        setIsLodering(false)
    } else {
      setSubRegionSizeList([]);
    }

  };

  const nextSubRegionsAdd = () => {

    if (Unit.isEmpty(roomName,"Please enter Sensor Detection Area name")) {  return true; }
    if (Unit.isNumberVal(roomType,"Please select Sensor Detection Area Type")) {  return true; }
    if (Unit.isNumberVal(roomSize,"Please select Sensor Detection Area size")){  return true; }
    if (OtherType) {
      if (Unit.isNumberVal(custom_length,"Please enter custom length")) {  return true; }
      if (Unit.isNumberVal(custom_width,"Please enter custom width")) {  return true; }
    }

    let d = {
      user_room_measurements_id: user_room_measurements_id,
      furniture_type_size_id: roomSize,
      sub_region_name: roomName,
      room_furniture_type_id: roomType,
      furniture_custom_length: custom_length,
      furniture_custom_width: custom_width,
      presence_detection: isEnabled,
      fall_detection: FallDetection,
      user_room_sub_region_details_id: room_sub != null ? room_sub.user_room_sub_region_details_id : 0,
      user_room_sub_region_id: room_sub != null ? room_sub.user_room_sub_region_id : 0
    };

    navigation.navigate("addSubRegionsResize", {
      "user_room_sub_region_details_id":
        room_sub != null ? room_sub.user_room_sub_region_details_id : 0, "sub_region": d
    });
  };
  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} title={'Sub Regions'} backPage={'subRegions'} itemsData={{
        user_room_measurements_id: user_room_measurements_id,
      }} isResident={true}></AppHeader>
      <View style={[screenSty.contant,screenSty.padding15H]}>

        <KeyboardAvoidingView
          style={screenSty.contant}
          behavior={Platform.OS === "android" ? "" : "padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView>
            <VeviceInfo></VeviceInfo>

            <View style={[screenSty.box, screenSty.margin30Bottom]}>
              <View style={[screenSty.HeaderBoxVal, screenSty.row]}>
                <Text style={[screenSty.font16, screenSty.contant]}>{t("Sub Regions")}</Text>
              </View>
              <View>
                <View style={[screenSty.margin20H,screenSty.margin10Top]}>
                  <TextFieldUI
                    onChangeText={(txt) => setRoomName(txt)}
                    placeholder=""
                    inputTitle="Name of Sub Region"
                  />

                  <SelectFieldUI
                    inputTitle={'Type of Sub Region'}
                    onChangeText={(txt) => fillRoomSizeType(txt)}
                    placeholder={{ label: "Please select type", value: "" }}
                    value={roomType}
                    items={SubRegionTypeList}
                  />

                  <SelectFieldUI
                    inputTitle={'Size of Sub Region'}
                    onChangeText={(value) => {
                      setRoomSize(value);
                      let ty = SubRegionSizeList.filter((e) => {
                        return (
                          e.label.toLowerCase() == "other" &&
                          e.value == value
                        )
                      });
                      if (ty.length > 0) {
                        setOtherType(true);
                      } else {
                        setOtherType(false);
                      }
                    }}
                    placeholder={{ label: "Please select size", value: "" }}
                    value={roomSize}
                    items={SubRegionSizeList}
                  />            
                </View>


                {OtherType && (
                  <View style={screenSty.margin20H}>
                    <Text style={inputSty.TextLab}>Custom Size</Text>
                    <View
                      style={[
                        screenSty.row, screenSty.contant
                      ]}
                    >
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setCustom_length(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                      />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setCustom_width(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                     />
                  </View>


                    </View>
                  </View>
                )}

                <View style={[ screenSty.margin10Top]}>
                  <View style={screenSty.row}>
                    <Text style={[inputSty.TextLab, screenSty.contant]}>
                    {t("Presence Detection")}
                    </Text>
                    <Switch
                      trackColor={{ false: "#e0dcff", true: color.primary }}
                      thumbColor={isEnabled ? color.primary : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() =>
                        setIsEnabled((previousState) => !previousState)
                      }
                      value={isEnabled}
                    />
                  </View>
                </View>

                <View style={[ screenSty.margin10Top]}>
                  <View style={screenSty.row}>
                    <Text style={[inputSty.TextLab, screenSty.contant]}>
                    {t("Fall Detection")}
                    </Text>
                    <Switch
                      trackColor={{ false: "#e0dcff", true: color.primary }}
                      thumbColor={FallDetection ? color.primary : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() =>
                        setFallDetection((previousState) => !previousState)
                      }
                      value={FallDetection}
                    />
                  </View>
                </View>
              </View>

              <View style={[screenSty.centerItem, screenSty.margin20Top]}>
                <TouchableOpacity
                  style={buttonSty.buttonBox}
                  onPress={() => nextSubRegionsAdd()}
                >
                  <Text style={buttonSty.buttonBoxTxt}>{t("Continue")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>


        <Loader loading={isLodering} />
      </View>
    </View>
  );
};

const pickerStyles = StyleSheet.create({
  inputIOS: {
    flex:1,
    color: color.primary,
    fontWeight: "400",
    paddingTop: 0,
    height: 40,
    borderBottomWidth: 0,
  },
  inputAndroid: {
    flex:1,
    color: color.primary,
    fontWeight: "400",
    paddingTop: 0,
    height: 40,
    paddingHorizontal: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
});

export default AddSubRegionsScreen;
