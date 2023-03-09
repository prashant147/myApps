import * as React from "react";
import { useState, useEffect,useContext } from "react";
import {
  Text, View,ScrollView,Image, TouchableOpacity,TouchableWithoutFeedback,Keyboard  
} from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import buttonSty from "../../../style/buttonSty";
import { Overlay } from "@rneui/themed";
import InputScrollView from "react-native-input-scroll-view";
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
import { addRoomCellSizeData } from "../../../redux/Actions/auth";

const RoomSizeCeilingScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice } = useContext(StateContext)
  const { roomInfo } = route.params;


  const [roomSizeA, setRoomSizeA] = useState(null);
  const [roomSizeB, setRoomSizeB] = useState(null);
  const [roomSizeC, setRoomSizeC] = useState(null);
  const [roomSizeD, setRoomSizeD] = useState(null);
  const [roomSizeHeight, setRoomSizeHeight] = useState(null);

  const [roomSizeA1, setRoomSizeA1] = useState(null);
  const [roomSizeB1, setRoomSizeB1] = useState(null);
  const [roomSizeC1, setRoomSizeC1] = useState(null);
  const [roomSizeD1, setRoomSizeD1] = useState(null);
  const [roomSizeHeight1, setRoomSizeHeight1] = useState(null);


  const [isLodering, setIsLodering] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {

    if (roomInfo != null) {
      setRoomSizeA(parseInt(roomInfo.ceiling_top_from_device / 12) + "")
      setRoomSizeA1(roomInfo.ceiling_top_from_device - parseInt(roomInfo.ceiling_top_from_device / 12) * 12 + "")
      setRoomSizeB(parseInt(roomInfo.ceiling_bottom_from_device / 12) + "")
      setRoomSizeB1(roomInfo.ceiling_bottom_from_device - parseInt(roomInfo.ceiling_bottom_from_device / 12) * 12 + "")
      setRoomSizeC(parseInt(roomInfo.ceiling_room_left / 12) + "")
      setRoomSizeC1(roomInfo.ceiling_room_left - parseInt(roomInfo.ceiling_room_left / 12) * 12 + "")
      setRoomSizeD(parseInt(roomInfo.ceiling_room_right / 12) + "")
      setRoomSizeD1(roomInfo.ceiling_room_right - parseInt(roomInfo.ceiling_room_right / 12) * 12 + "")
      setRoomSizeHeight(parseInt(roomInfo.ceiling_height / 12) + "")
      setRoomSizeHeight1(roomInfo.ceiling_height - parseInt(roomInfo.ceiling_height / 12) * 12 + "")
    } else {
      setRoomSizeA(null)
      setRoomSizeA1(null)
      setRoomSizeB(null)
      setRoomSizeB1(null)
      setRoomSizeC(null)
      setRoomSizeC1(null)
      setRoomSizeD(null)
      setRoomSizeD1(null)
      setRoomSizeHeight(null)
      setRoomSizeHeight1(null)
    }
    return () => { }
  }, [roomInfo, isFocused]);


  const addRoomSize = () => {

    if (Unit.isEmpty(roomSizeA,"Please enter Sensor Detection Area A")) { return }
    if (Unit.isEmpty(roomSizeA1)) { setRoomSizeA1("0"); }
    if (roomSizeA > 6) {
      Unit.alertMes("Sensor Detection Area A left can not be more than 6 ft ");
      return true; 
    }
    if (roomSizeA1 > 12) {
      Unit.alertMes("Sensor Detection Area A left can not be more than 12 inch ");
      return true; 
    }
    if (Unit.isEmpty(roomSizeB,"Please enter Sensor Detection Area B")) { return }
    if (Unit.isEmpty(roomSizeB1)) {  setRoomSizeB1("0"); }
    if (roomSizeB > 6) {
      Unit.alertMes("Sensor Detection Area B left can not be more than 6 ft ");
      return true; 
    }
    if (roomSizeB1 > 12) {
      Unit.alertMes("Sensor Detection Area B Width can not be more than 12 inch");
      return ;
    }

    if (Unit.isEmpty(roomSizeC,"Please enter Sensor Detection Area C")) { return }
    if (Unit.isEmpty(roomSizeC1)) {  setRoomSizeC1("0"); }
    if (roomSizeC > 8) {
      Unit.alertMes("Sensor Detection Area C left can not be more than 8 ft ");
      return true; 
    }
    if (roomSizeC1 > 12) {
      Unit.alertMes("Sensor Detection Area C Width can not be more than 12 inch");
      return ;
    }
    if (Unit.isEmpty(roomSizeD,"Please enter Sensor Detection Area D")) { return }
    if (Unit.isEmpty(roomSizeD1)) {  setRoomSizeD1("0"); }
    if (roomSizeD > 8) {
      Unit.alertMes("Sensor Detection Area D left can not be more than 8 ft ");
      return true; 
    }
    if (roomSizeD1 > 12) {
      Unit.alertMes("Sensor Detection Area D Width can not be more than 12 inch");
      return ;
    }

    if (Unit.isEmpty(roomSizeHeight,"Please enter Sensor Detection Area Height")) { return }
    if (Unit.isEmpty(roomSizeHeight1)) {  setRoomSizeHeight1("0"); } 
    if (roomSizeHeight1 > 12) {
      Unit.alertMes("Sensor Detection Area Height can not be more than 12 inch");
      return ;
    }
    let Width3 = roomSizeHeight * 12 + (roomSizeHeight1 == null ? 0 : parseInt(roomSizeHeight1));
    if (Width3 > 120) {
      Unit.alertMes("Sensor Detection Area Height can not be more than 10 feet"); return 
    }
   
    saveRoomData();
  };
  const saveRoomData = async () => {
    setIsLodering(true);
    try{

      await addRoomCellSizeData(
        selDevice.roomType,selDevice.subroom_id,selDevice.deviceId,
        roomSizeA,roomSizeA1,roomSizeB,roomSizeB1,
        roomSizeC,roomSizeC1,roomSizeD,roomSizeD1,roomSizeHeight,roomSizeHeight1,auth?.token,roomInfo != null ? roomInfo.user_room_measurements_id : 0,
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
                  <TouchableOpacity >
                    <Image source={require("../../../assets/roomimg.png")}></Image>
                  </TouchableOpacity>
                </View>

                <View style={[screenSty.row, screenSty.margin20Top]}>
                  <View style={[screenSty.contant,{marginRight:5}]}>
                      <Text style={[screenSty.font10, screenSty.contant, screenSty.marginLeft10]}>
                        {t('“A” : Max distance is 6 ft 6 in')}
                      </Text>
                    <View style={screenSty.row}>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeA(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeA}
                      />
                      </View>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeA1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeA1}
                      />
                      </View>
                    </View>
                  </View>
                  <View style={[screenSty.contant,{marginLeft:5}]}>
                    <Text style={[screenSty.font10, screenSty.contant, screenSty.marginLeft10]}>
                        {t('“B” : Max distance is 6 ft 6 in')}
                      </Text>
                    <View style={screenSty.row}>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeB(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeB}
                      />
                      </View>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeB1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeB1}
                      />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[screenSty.row, screenSty.margin5Top]}>
                  <View style={[screenSty.contant,{marginRight:5}]}>
                      <Text style={[screenSty.font10, screenSty.contant, screenSty.marginLeft10]}>
                        {t('“C” : Max distance is 8 ft 0 in')}
                      </Text>
                    <View style={screenSty.row}>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeC(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeC}
                      />
                      </View>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeC1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeC1}
                      />
                      </View>
                    </View>
                  </View>
                  <View style={[screenSty.contant,{marginLeft:5}]}>
                    <Text style={[screenSty.font10, screenSty.contant, screenSty.marginLeft10]}>
                        {t('“D” : Max distance is 8 ft 0 in')}
                      </Text>
                    <View style={screenSty.row}>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeD(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeD}
                      />
                      </View>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeD1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeD1}
                      />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[screenSty.row, screenSty.margin5Top]}>
                  <View style={[screenSty.contant,{marginRight:5}]}>
                      <Text style={[screenSty.font10, screenSty.contant, screenSty.marginLeft10]}>
                        {t('“Height: Max height is 10 ft 0 in')}
                      </Text>
                    <View style={screenSty.row}>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeHeight(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'Ft.'}
                        value={roomSizeHeight}
                      />
                      </View>
                      <View style={[screenSty.contant, screenSty.marginLeft10]}>
                        <TextFieldUI
                        onChangeText={(txt) => setRoomSizeHeight1(txt)}
                        placeholder=""
                        keyboardType={"numeric"}
                        rightTxt={'In.'}
                        value={roomSizeHeight1}
                      />
                      </View>
                    </View>
                  </View>
                  <View style={[screenSty.contant]}>
  
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

export default RoomSizeCeilingScreen;
