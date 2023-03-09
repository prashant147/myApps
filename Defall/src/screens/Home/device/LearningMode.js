import * as React from "react";
import { useState,useContext } from "react";
import { TouchableOpacity, Text, View, Switch, ScrollView } from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import buttonSty from "../../../style/buttonSty";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { color } from "../../../config/configuration";
import { Unit } from "../../Unit"; 
import { getGenralDetails, LearningModeSave } from "../../../redux/Actions/auth";
import VeviceInfo from "../../common/deviceInfo";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import StateContext from "../../../context/stateContext";
import { useIsFocused } from "@react-navigation/native";

const LearningModeScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice } = useContext(StateContext)

  const [isLodering, setIsLodering] = useState(false);


  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  React.useEffect(() => {
    async function fetchData() {  
      setIsLodering(true);
      let res = await getGenralDetails(selDevice.deviceId, auth?.token);
      if(res.appConfig.learningModeEndTs > 0){
        setIsEnabled(true);
      }
      setIsLodering(false);
    }
    fetchData();
    return () => {};
  }, [useIsFocused()]);

  const saveGenralDetail = async () => {
    setIsLodering(true);
    let res = await LearningModeSave(selDevice.deviceId,isEnabled,auth?.token)

    if(res){
      Unit.alertMes("Learning Mode saved successfully");
      setIsLodering(false);
      navigation.navigate("vayyarDevice");
    }
  };

  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation}
        backPop={()=>navigation.navigate("vayyarDevice")}
        title={"Learning Mode"}
        backPage={"vayyarDevice"}
        isResident={true}
      ></AppHeader>
      <View style={[screenSty.contant,screenSty.padding15H]}>
        <ScrollView>
          <VeviceInfo></VeviceInfo>
          <View style={screenSty.box}>
            <View style={[screenSty.HeaderBoxVal, screenSty.row]}>
              <Text style={[screenSty.font16, screenSty.contant]}>
              {t('Learning Mode')}
              </Text>
            </View>

            <View style={[screenSty.row, screenSty.margin20Top]}>
              <Text style={[screenSty.font14, screenSty.contant]}>
                {t('Learning Mode')}
              </Text>
              <Switch
                trackColor={{ false: color.lightPeriwinkle, true: color.primary }}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
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
                onPress={() => saveGenralDetail()}
              >
                <Text style={buttonSty.buttonBoxTxt}>{t('Save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <Loader loading={isLodering} />
    </View>
  );
};

export default LearningModeScreen;
