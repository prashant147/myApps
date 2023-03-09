import * as React from "react";
import { useState,useContext } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import screenSty from "../../style/screenSty";
import buttonSty from "../../style/buttonSty";
import InstalHeader from "../common/instalProgress";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { getCompanyDetails, getResidents } from "../../redux/Actions/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import Loader from "../common/Loader";
import { color, screen_size } from "../../config/configuration";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const CompletedScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const [isLodering, setIsLodering] = useState(false);
  const { auth,setSelCompany,resident} = useContext(StateContext)

  const toggleOverlay = async () => {
    setIsLodering(true)
  //  Unit.confirmMeg("Activate your device: Before you can use this fall detector, you must perform a power cycle by removing the power cord for 10 seconds and then plugging it back in. Once done, click continue.",async ()=>{
      await getCompanyDetails( auth?.token,auth?.user_details.company_id).then(async (com)=>{ 
        setSelCompany(com.data)
        getResidents(auth?.token, auth?.user_details.company_id).then(async (residentList)=>{
          setIsLodering(false)
          let UserInfo = await AsyncStorage.getItem('userInfo');
          let user = JSON.parse(UserInfo);
          user.user_details.terms_and_condition = true;
          user.user_details.company_id = auth?.user_details.company_id;
          await AsyncStorage.setItem('userInfo',JSON.stringify(user) );
          navigation.navigate("main",{screen:'ResidentList'});
        })

        
      });
     
  //  })
  };
 
  return (
    <SafeAreaView style={screenSty.contant}>
      <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
        <InstalHeader navigation={navigation} progress={1} />
        <ScrollView style={[screenSty.contant]}>
          <View style={[screenSty.margin20H, screenSty.margin30Bottom]}>
            <Image source={require("../../assets/congratulations.png")} style={screenSty.installImage}></Image>
            <Text style={[screenSty.font20, screenSty.margin20TopBottom, screenSty.colorPrimary, screenSty.centerTxt]}>
              {t('CONGRATULATIONS')}
            </Text>
            <Text style={[screenSty.font17, screenSty.centerTxt]}>
              {t("Your device is now online. Nice job!")}
              {t("Next we will set the size of the Sensor Detection Area .")}
            </Text>
          </View>
          <View style={[screenSty.centerItem]}>
              <TouchableOpacity
                style={[buttonSty.buttonBox, { width: 250 }]}
                onPress={() => toggleOverlay()}
              >
                <Text style={buttonSty.buttonBoxTxt}>{t("FINISH")}</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[screenSty.row,screenSty.margin20Top, styles.videoBox,{ width: 250 }]}
                onPress={() => navigation.navigate("instructional", { page: "completed" })}
              >
                <Icon type="font-awesome" name="youtube-play" style={screenSty.marginRight10}
                  size={25} color="#ff0000" />
                <Text style={styles.videoBoxTxt}>{t("Instructional Videos")}</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  videoBoxTxt: {
    color: "#ff0000",
    fontSize: RFValue(16,screen_size),
    fontFamily: "OpenSans-SemiBold",
  },
  videoBox: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderColor: "#ff0000",
    borderWidth: 1,
    borderRadius: 50,
    height: 50,
    flexDirection: "row",
  },
});

export default CompletedScreen;
