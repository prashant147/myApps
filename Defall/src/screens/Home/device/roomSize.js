import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  StyleSheet,
  Text, View,
  ScrollView,
  Image, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard  ,
  useColorScheme
} from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import buttonSty from "../../../style/buttonSty";
import { Overlay } from "@rneui/themed";
import InputScrollView from "react-native-input-scroll-view";
import { addRoomSizeData } from "../../../redux/Actions/auth";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { useIsFocused } from "@react-navigation/native";
import { color } from "../../../config/configuration";
import { Unit } from "../../Unit";
import VeviceInfo from "../../common/deviceInfo";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import TextFieldUI from "../../common/TextFieldUI";
import StateContext from "../../../context/stateContext";

const RoomSizeScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();
  const theme = useColorScheme();
  const { auth, resident,selDevice } = useContext(StateContext)
  const { roomInfo } = route.params;


  const [roomSizeLeft, setRoomSizeLeft] = useState(null);
  const [roomSizeWidth, setRoomSizeWidth] = useState(null);
  const [roomSizeLength, setRoomSizeLength] = useState(null);

  const [roomSizeLeft1, setRoomSizeLeft1] = useState(null);
  const [roomSizeWidth1, setRoomSizeWidth1] = useState(null);
  const [roomSizeLength1, setRoomSizeLength1] = useState(null);


  const [visible, setVisible] = useState(false);
  const [isLodering, setIsLodering] = useState(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {

    if (roomInfo != null) {
      setRoomSizeLeft(parseInt(roomInfo.far_from_left / 12) + "");
      setRoomSizeWidth(parseInt((roomInfo.room_width - roomInfo.far_from_left) / 12) + "");
      setRoomSizeLength(parseInt(roomInfo.room_length / 12) + "");
      setRoomSizeLeft1(
        roomInfo.far_from_left - parseInt(roomInfo.far_from_left / 12) * 12 + ""
      );
      setRoomSizeWidth1(
        (roomInfo.room_width - roomInfo.far_from_left) - parseInt((roomInfo.room_width - roomInfo.far_from_left) / 12) * 12 + ""
      );
      setRoomSizeLength1(
        roomInfo.room_length - parseInt(roomInfo.room_length / 12) * 12 + ""
      );
    } else {
      setRoomSizeLeft(null);
      setRoomSizeWidth(null);
      setRoomSizeLength(null);
      setRoomSizeLeft1(null);
      setRoomSizeWidth1(null);
      setRoomSizeLength1(null);
    }
    return () => { }
  }, [roomInfo, isFocused]);


  const ref_left1 = useRef();
  const ref_right1 = useRef();
  const ref_left2 = useRef();
  const ref_right2 = useRef();
  const ref_left3 = useRef();
  const ref_right3 = useRef();

  const addRoomSize = () => {
    if (Unit.isEmpty(roomSizeLeft,"Please enter Sensor Detection Area left feet ")) { return }
    if (Unit.isEmpty(roomSizeLeft1)) { setRoomSizeLeft1("0"); }
    if (roomSizeLeft > 6) {
      Unit.alertMes("Sensor Detection Area left can not be more than 6 feet"); return 
    }
    if (roomSizeLeft1 > 12) {
      Unit.alertMes("Sensor Detection Area left can not be more than 12 inch ");
      return true;
    }

    if (Unit.isEmpty(roomSizeWidth,"Please enter Sensor Detection Area width feet ")) { return }
    if (Unit.isEmpty(roomSizeWidth1)) {  setRoomSizeWidth1("0"); }
    if (roomSizeWidth > 6) {
      Unit.alertMes("Sensor Detection Area right can not be more than 6 feet"); return 
    }
    if (roomSizeWidth1 > 12) {
      Unit.alertMes("Sensor Detection Area right can not be more than 12 inch");
      return ;
    }

    let roomWith = (parseInt(roomSizeWidth) + parseInt(roomSizeLeft)) * 12 + (parseInt(roomSizeLeft1) + parseInt(roomSizeWidth1));
    if (roomWith > 156) {
      Unit.alertMes("Sensor Detection Area Width can not be more than 13 feet"); return 
    }
    if (Unit.isEmpty(roomSizeLength,"Please enter Sensor Detection Area length feet ")){  return }
    if (Unit.isEmpty(roomSizeLength1)) {  setRoomSizeLength1("0"); }

    let Length = roomSizeLength * 12 + (roomSizeLength1 == null ? 0 : parseInt(roomSizeLength1));
    if (Length > 156) {
      Unit.alertMes("Sensor Detection Area length can not be more than 13 feet"); return 
    }
    if (roomSizeLength1 > 12) {
      Unit.alertMes("Sensor Detection Area length can not be more than 12 inch"); return 
    }
    let right = parseInt(roomSizeWidth * 12) +  parseInt(roomSizeWidth1);
    let left = parseInt(roomSizeLeft * 12) + parseInt(roomSizeLeft1);

    if (right != left) {
      Unit.confirmMeg("Please note, the device is not in the middle of the Sensor Detection Area and it may not be able to scan the entire room.", () => {
        saveRoomData();
      }, () => {
        return true;
      });
    } else {
      saveRoomData();
    }

  };
  const saveRoomData = async () => {
    setIsLodering(true);
    try{

      await addRoomSizeData(
        selDevice.roomType,selDevice.subroom_id,selDevice.deviceId,
        roomSizeLeft,roomSizeLeft1,roomSizeWidth,roomSizeWidth1,
        roomSizeLength,roomSizeLength1,auth?.token,roomInfo != null ? roomInfo.user_room_measurements_id : 0,
        selDevice
      ).then(e=>{
        setIsLodering(false);
        if(e){
          selDevice.region_configured = true;
          navigation.navigate("vayyarDevice");
        }
        
      }) 
      
    }catch(e){
      Unit.alertMes("Incorrect values in WalabotConfig");
      setIsLodering(false);
      return
    }
  }
  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} backPop={()=>navigation.navigate("vayyarDevice")} title='Sensor Detection Area Size' backPage='vayyarDevice' isResident={true}></AppHeader>

      <Overlay isVisible={visible}>
        <View>
         
         
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
      <View style={[screenSty.contant,screenSty.padding15H]}>

        <ScrollView>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <InputScrollView keyboardOffset={200} useAnimatedScrollView={true}>
              <VeviceInfo></VeviceInfo>
              <View style={[screenSty.box, screenSty.margin30Bottom]}>
                <View style={[screenSty.HeaderBoxVal]}>
                  <Text style={[screenSty.font16]}>{t('Sensor Detection Area Size')}</Text>
                </View>

                <View style={[screenSty.centerItem, screenSty.margin20Top]}>
                  <TouchableOpacity onPress={() => {
                    setVisible(true);
                  }}
                  >
                    <Image source={require("../../../assets/room.png")}></Image>
                  </TouchableOpacity>
                </View>
                <View style={[screenSty.row, screenSty.margin20Top]}>
                  
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.marginLeft10]}>
                  {t('Left')}
                  </Text>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                    <TextFieldUI
                    onChangeText={(txt) => setRoomSizeLeft(txt)}
                    placeholder=""
                    value={roomSizeLeft}
                    keyboardType={"numeric"}
                    rightTxt={'Ft.'}
                  />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                     <TextFieldUI
                    onChangeText={(txt) => setRoomSizeLeft1(txt)}
                    placeholder=""
                    value={roomSizeLeft1}
                    keyboardType={"numeric"}
                    rightTxt={'In.'}
                  />
                  </View>
                  
                </View>
                <View style={[screenSty.row]}>
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.marginLeft10]}>
                  {t('Right')} 
                  </Text>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeWidth(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        value={roomSizeWidth}
                        rightTxt={'Ft.'}
                      />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeWidth1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        value={roomSizeWidth1}
                        rightTxt={'In.'}
                      />
                  </View>

                </View>
                <View style={[screenSty.row]}>
                  <Text style={[screenSty.font14, screenSty.contant, screenSty.marginLeft10]}>
                  {t('Length')}
                  </Text>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeLength(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        value={roomSizeLength}
                        rightTxt={'Ft.'}
                      />
                  </View>
                  <View style={[screenSty.contant, screenSty.marginLeft10]}>
                      <TextFieldUI
                        onChangeText={(txt) => setRoomSizeLength1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        value={roomSizeLength1}
                        rightTxt={'In.'}
                      />
                  </View>

                </View>
                <View style={[screenSty.centerItem, screenSty.margin20TopBottom]}>
                  <TouchableOpacity
                    style={buttonSty.buttonBox}
                    onPress={addRoomSize}
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

export default RoomSizeScreen;
