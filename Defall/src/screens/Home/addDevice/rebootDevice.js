import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from "react-native";
import { Icon } from "@rneui/themed";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";

import buttonSty from "../../../style/buttonSty";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppHeader from "../../common/AppHeader";
import { screen_size } from "../../../config/configuration";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import StateContext from "../../../context/stateContext";
 
const RebootDeviceScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { resident } = React.useContext(StateContext)
  
  const toggleOverlay = async () => {
    //Unit.confirmMeg("Activate your device: Before you can use this fall detector, you must perform a power cycle by removing the power cord for 10 seconds and then plugging",()=>{
      if(resident.apartment_id!=null && resident.apartment_id!=0){ 
        navigation.navigate("deviceList",{isLoad:true});
      }else{
        navigation.navigate('ResidentList'); 
      }
       

   // })
   
  };
 
  return (
    <View style={[screenSty.contant,screenSty.backgroundColor]}>
      <AppHeader title={'Add New Device'} navigation={navigation} backPop={()=>navigation.navigate("home")} backPage={'home'} isResident={true}></AppHeader>
     <View  style={[screenSty.contant,screenSty.padding15H]} >

        <ScrollView style={screenSty.contant}>
          <View style={[screenSty.centerItem, screenSty.margin20H]}>
            <Image source={require("../../../assets/rebootnew.png")} style={screenSty.installImage}></Image>
            <Text style={[screenSty.font20, screenSty.colorPrimary]}>
              {t("CONGRATULATIONS")}
            </Text>
            <Text style={[screenSty.font17, screenSty.margin20TopBottom, screenSty.centerTxt]}>
             {t(" Your device is now online. Nice job!")}
              {t("Next we will set the size of the Sensor Detection Area.")}
            </Text>
          </View>
          <View style={[screenSty.centerItem]}>
            <TouchableOpacity
              style={[buttonSty.buttonBox, { width: 250 }]}
              onPress={toggleOverlay}
            >
              <Text style={buttonSty.buttonBoxTxt}>{t("FINISH")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[screenSty.row,screenSty.margin20Top, styles.videoBox,{ width: 250 }]}
              onPress={() => navigation.navigate("instructional", { page: "rebootDevice" })}
            >
              <Icon
                type="font-awesome"
                name="youtube-play"
                style={{ marginRight: 10 }}
                size={25}
                color="#ff0000"
              />
              <Text style={styles.videoBoxTxt}>{t("Instructional Videos")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
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


export default RebootDeviceScreen;
