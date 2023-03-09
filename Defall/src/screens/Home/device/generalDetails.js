import * as React from "react";
import { useState,useContext } from "react";
import { TouchableOpacity, Text, View, Switch, ScrollView, Alert } from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import buttonSty from "../../../style/buttonSty";
import { ButtonGroup, Overlay, Slider } from "@rneui/themed";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { useIsFocused } from "@react-navigation/native";
import { color } from "../../../config/configuration";
import { Icon } from "@rneui/themed";
import { Unit } from "../../Unit"; 
import { deleteRoomConfig, GenralDetailSave, getGenralDetails, sensorMount } from "../../../redux/Actions/auth";
import VeviceInfo from "../../common/deviceInfo";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import StateContext from "../../../context/stateContext";

const GeneralDetailsScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice } = useContext(StateContext)
  const buttons = ["Wall", "Ceiling", "Ceiling45Deg"];
  const [selectedIndex, setselectedIndex] = useState(0);
  const [isLodering, setIsLodering] = useState(false);
  const [isInfoBox, setIsInfoBox] = useState(false);
  const [isVideoInfoBox, setisVideoInfoBox] = useState(false);
  const [Volume, setVolume] = useState(0);
  const updateIndex = (index) => {
    setselectedIndex(index);
  };
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    async function fetchData() {  
      setIsLodering(true);
      let res = await getGenralDetails(selDevice.deviceId, auth?.token);

      setselectedIndex(res.walabotConfig.sensorMounting)
      setVolume(res.appConfig.volume);
      setIsEnabled(res.appConfig.silentMode);
      setIsLodering(false);
    }
    fetchData();
    return () => {};
  }, [isFocused]);

  const toggleOverlay = () => {
    setIsInfoBox(!isInfoBox);
  };
  const toggleVideoOverlay = () => {
    setisVideoInfoBox(!isVideoInfoBox);
  };
  const saveGenralDetail = async () => { 
    if(selectedIndex==selDevice.sensor_mount || (selDevice.sensor_mount!=0 && selectedIndex>0)){
      setIsLodering(true);
      let res = await GenralDetailSave(selDevice.deviceId,Volume,isEnabled,selectedIndex,auth?.token)
      if(res){
        if(selectedIndex==selDevice.sensor_mount){
          Unit.alertMes("General Details saved successfully");
          setIsLodering(false);
          navigation.navigate("vayyarDevice");
        }else{
          await sensorMount(selDevice.deviceId,parseInt(selectedIndex) + 1,auth?.token)
          Unit.alertMes("General Details saved successfully");
          setIsLodering(false);
          navigation.navigate("deviceList");
        }
      }
    }else{
      changeWallTOCell();
    }
  };
   const changeWallTOCell = (item)=>{
        Alert.alert("", "You are changing the device mount type. Your previous saved configuration data will be lost. Do you want to continue ?", [
            {
                text: "Yes", onPress: async() => {
                  setIsLodering(true);
                  await deleteRoomConfig(selDevice.deviceId,auth?.token);
                  let res = await GenralDetailSave(selDevice.deviceId,Volume,isEnabled,selectedIndex,auth?.token);
                  if(res){
                    await sensorMount(selDevice.deviceId,parseInt(selectedIndex) + 1,auth?.token)
                    Unit.alertMes("General Details saved successfully");
                    setIsLodering(false);
                    navigation.navigate("deviceList");
                  }
                }
            },
            { text: "No", style: "cancel", },

        ], { cancelable: true });
    }
  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation}
        backPop={()=>navigation.navigate("vayyarDevice")}
        title={"General Details"}
        backPage={"vayyarDevice"}
        isResident={true}
      ></AppHeader>
      <View style={[screenSty.contant,screenSty.padding15H]}>
        <ScrollView>
          <VeviceInfo></VeviceInfo>
          <View style={screenSty.box}>
            <View style={[screenSty.HeaderBoxVal, screenSty.row]}>
              <Text style={[screenSty.font16, screenSty.contant]}>
              {t('General Details')}
              </Text>
            </View>

            <ButtonGroup
              selectedButtonStyle={{ backgroundColor: color.primary }}
              buttonStyle={{ backgroundColor: "#D9D9D9" }}
              onPress={updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={[screenSty.margin20Top]}
            />

            <View style={[screenSty.row, screenSty.margin20Top]}>
              <Text style={[screenSty.font14, screenSty.contant]}>
                {t('Silent Mode')}
              </Text>
              <Switch
                trackColor={{ false: color.lightPeriwinkle, true: color.primary }}
                thumbColor={ "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <TouchableOpacity onPress={() => setIsInfoBox(true)}>
                <Icon type="font-awesome" name="info-circle" color={color.primary} size={25}></Icon>
              </TouchableOpacity>
            </View>
            <View style={[screenSty.row, screenSty.margin20Top]}>
              <Text style={[screenSty.font14]}>{t('Volume')}</Text>
              <View style={[screenSty.contant, { paddingLeft: 10 }]}>
                <Slider
                  value={Volume}
                  minimumTrackTintColor={color.primary}
                  step={1}
                  maximumValue={100}
                  thumbStyle={{
                    width: 15,
                    height: 15,
                    backgroundColor: color.primary,
                  }}
                  style={{ width: "90%" }}
                  onValueChange={(value) => setVolume(value)}
                />
              </View>
              <TouchableOpacity onPress={() => toggleVideoOverlay()}>
                <Icon type="font-awesome" name="info-circle" color={color.primary} size={25}></Icon>
              </TouchableOpacity>
            </View>
            <View
              style={[
                screenSty.centerItem,
                screenSty.margin20Top,
                screenSty.margin10Bottom,
              ]}
            >
              <TouchableOpacity
                style={buttonSty.buttonBox}
                onPress={saveGenralDetail}
              >
                <Text style={buttonSty.buttonBoxTxt}>{t('Save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <Overlay isVisible={isInfoBox} onBackdropPress={toggleOverlay}>
        <View style={[screenSty.margin20H, screenSty.padding10TopBottom]}>
          <Text
            style={[
              screenSty.font17,
              screenSty.centerTxt,
              {
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: color.primary,
              },
            ]}
          >
            {t('Slider info')}
          </Text>
          <Text
            style={[
              screenSty.font14,
              screenSty.margin10Top,
              screenSty.padding5TopBottom,
              { width: 250 },
            ]}
          >
             {t('Silent Mode Des')}
          </Text>
        </View>
      </Overlay>

      <Overlay isVisible={isVideoInfoBox} onBackdropPress={toggleVideoOverlay}>
        <View style={[screenSty.margin20H, screenSty.padding10TopBottom]}>
          <Text
            style={[
              screenSty.font17,
              screenSty.centerTxt,
              {
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: color.primary,
              },
            ]}
          >
            {t('Volume info')}
          </Text>
          <Text
            style={[
              screenSty.font14,
              screenSty.margin10Top,
              screenSty.padding5TopBottom,
              { width: 250 },
            ]}
          >
             {t('Volume info Des')}
            
          </Text>
        </View>
      </Overlay>
      <Loader loading={isLodering} />
    </View>
  );
};

export default GeneralDetailsScreen;
