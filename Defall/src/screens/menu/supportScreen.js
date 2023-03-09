import * as React from "react";
import { useState,useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import screenSty from "../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import buttonSty from "../../style/buttonSty";
import Loader from "../common/Loader";
import AppHeader from "../common/AppHeader";
import { Icon, Overlay } from "@rneui/themed";
import inputSty from "../../style/inputSty";
import { launchImageLibrary } from "react-native-image-picker";
import { PermissionsAndroid } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { color } from "../../config/configuration";
import YoutubePlayer from "react-native-youtube-iframe";
import { Unit } from "../Unit";
import { sendReport, sendSupport } from "../../redux/Actions/auth";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import TextFieldUI from "../common/TextFieldUI";
import StateContext from "../../context/stateContext";

const SupportScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();

  const { auth,company } = useContext(StateContext)
  const [isLodering, setIsLodering] = useState(false);

  const [isSupport, setIsSupport] = useState(true);
  const [isRequest, setIsRequest] = useState(false);
  const [isHelpful, setHelpful] = useState(false);
  const [supportTxt, setSupportTxt] = useState(null);
  const [requestTxt, setRequestTxt] = useState(null);
  const [youtubeId, setyYoutubeId] = useState(null);
  const [visible, setVisible] = useState(false);
  
  const wifiListVal = [
    { url: "VKecdhNOolM", img:require("../../assets/VKecdhNOolM.png"), lab: "Placement of the Fall Detector 1","id":1 },
    { url: "m2y9Bnrl42s", img:require("../../assets/m2y9Bnrl42s.png"), lab: "Connecting to BlueTooth","id":2 },
    { url: "5dHYY7kUzds", img:require("../../assets/5dHYY7kUzds.png"), lab: "DeFall the Measuring the Left Side of the Detector","id":3 },
    { url: "1q_QBSUwhKw", img:require("../../assets/1q_QBSUwhKw.png"), lab: "DeFall Width and Length of the Room","id":4 },
  ];

  const [selectImg, setSelectImg] = useState(null);
  const isFocused = useIsFocused();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "DeFall Camera Permission",
          message: "DeFall needs access to your camera to scan QR code and help to get information to Sensor Detection Area using the app.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      } else {

      }
    } catch (err) {
      console.warn(err);
    }
  };
  React.useEffect(() => {
    setSupportTxt(null);
    setRequestTxt(null);
    setSelectImg(null);
    if(Platform.OS=="android"){
      requestCameraPermission();
    }
    return () => { }
  }, [isFocused]);
  const sendSupportEmail = async () => {
    if (Unit.isEmpty(supportTxt,"Please enter your message")) { return; }
    setIsLodering(true);
    let res = await sendSupport(supportTxt,auth?.user_details, auth?.token)
    setIsLodering(false);
    if (res.status) {
      Unit.alertMes("Mail sent successfully.");
      setSupportTxt(null);
    }
  };
  const sendReportEmail = async () => {
    if ( Unit.isEmpty(requestTxt,"Please enter message")) { return; }
    if(selectImg){
      if (Unit.isEmpty(selectImg.uri,"Please select screenshot")) { return; }
    }else{  Unit.alertMes("Please select screenshot"); return; }
    
    setIsLodering(true);
    sendReport(requestTxt,auth?.user_details, selectImg).then((res)=>{
      setIsLodering(false);
      if (res.status) {
        setRequestTxt("");
        setSelectImg(null);
        Unit.alertMes("Mail sent successfully.");
        setSupportTxt(null);
      }
    })
    
  };
  const attachImage = () => {
    let options = {
      selectionLimit: 1,
      mediaType: "photo",
      includeBase64: false,
      quality: 1,
    }; 
    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
      } else if (res.error) {
      } else {
        uploadImg(res);
      }
    });
  };

  const uploadImg = (selImg) => {
    setSelectImg(selImg.assets[0]);
  };
  const onStateChange = React.useCallback((state) => {
    if (state === "ended") {
     Unit.alertMes("video has finished playing!");
    }
  }, []);
  const setPopup = (item)=>{
    setyYoutubeId(item.url);
    setVisible(true)
  }
  return (
    <SafeAreaView style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation}
        title={"Support"}
        backPage={ (auth!=null && auth?.user_details.role_id==9 )?"thirdRdParty":(company!=null && company.length>1)?'companyList':'ResidentList'}
        isResident={false}
      ></AppHeader>
      <ScrollView style={screenSty.contant}>
        <View style={[screenSty.contant,screenSty.padding15H,screenSty.margin20Top ]}>
          <View style={screenSty.box}>
            <View style={[isSupport?screenSty.HeaderBoxVal:null,screenSty.row]}>
              <TouchableOpacity
                style={[screenSty.contant, screenSty.padding20H]}
                onPress={() => {
                  setIsSupport(!isSupport);
                  setIsRequest(false);
                }}
              >
                <Text style={[screenSty.font12,screenSty.padding10H, screenSty.colorBold]}>
                  Support via Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 5, marginRight: 10 }}
                onPress={() => {
                  setIsSupport(!isSupport);
                  setIsRequest(false);
                }}
              >
                {isSupport && (
                  <Icon type="font-awesome" name="angle-down" size={20} color={color.primary} />
                )}
                {!isSupport && (
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                )}
              </TouchableOpacity>
            </View>
            {isSupport && (
              <View
                style={[
                  screenSty.padding10H,
                  screenSty.padding10TopBottom,
                  { height: 200 },
                ]}
              >
                <TextFieldUI
                            onChangeText={(txt) => setSupportTxt(txt)}
                            placeholder="Please enter your query"
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={supportTxt}
                        />
                <View style={screenSty.centerItem}>
                  <TouchableOpacity
                    style={[buttonSty.buttonBox]}
                    onPress={() => sendSupportEmail()}
                  >
                    <Text style={[buttonSty.buttonBoxTxt]}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View style={screenSty.box}>
            <View style={[isRequest?screenSty.HeaderBoxVal:null,,screenSty.row]}>
              <TouchableOpacity
                style={[screenSty.contant, screenSty.padding20H]}
                onPress={() => {
                  setIsRequest(!isRequest);
                  setIsSupport(false);
                }}
              >
                <Text style={[screenSty.font12,screenSty.padding10H, screenSty.colorBold]}>
                  Report an Error
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 5, marginRight: 10 }}
                onPress={() => {
                  setIsRequest(!isRequest);
                  setIsSupport(false);
                }}
              >
                {isRequest && (
                  <Icon type="font-awesome" name="angle-down" size={20} color={color.primary} />
                )}
                {!isRequest && (
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                )}
              </TouchableOpacity>
            </View>
            {isRequest && (
              <View
                style={[screenSty.padding10H, screenSty.padding10TopBottom]}
              >
                <TextFieldUI
                            onChangeText={(txt) => setRequestTxt(txt)}
                            placeholder="Please enter error message"
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={requestTxt}
                        />
                <View
                  style={[
                    screenSty.row,
                    {height:40},
                    screenSty.margin30Bottom,
                    inputSty.TextInput
                  ]}
                >
                  <Icon
                    type="font-awesome"
                    name="paperclip"
                    size={15}
                    style={[{ marginHorizontal: 10 }, screenSty.margin10Top]}
                  />
                  {selectImg == null && (
                    <Text style={[screenSty.contant, screenSty.margin5Top]}>
                      Attached screenshot
                    </Text>
                  )}
                  {selectImg != null && (
                    <View style={[screenSty.contant]}>
                      <Image
                        source={{
                          uri:
                            selectImg != null
                              ? selectImg
                                ? selectImg.uri
                                : null
                              : null,
                        }}
                        resizeMode={"contain"}
                        style={[{ height: 40, width: 50,marginTop:-12 }]}
                      ></Image>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[buttonSty.buttonBox,{width:80,height:38}]}
                    onPress={() => attachImage()}
                  >
                    <Text
                      style={[
                        buttonSty.buttonBoxTxt,
                        screenSty.padding10H,
                        screenSty.padding5TopBottom,
                        screenSty.font12,
                        screenSty.colorW,
                      ]}
                    >
                      Upload
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={screenSty.centerItem}>
                  <TouchableOpacity
                    style={[buttonSty.buttonBox]}
                    onPress={() => sendReportEmail()}
                  >
                    <Text style={[buttonSty.buttonBoxTxt]}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={screenSty.box}>
            <View style={[isHelpful?screenSty.HeaderBoxVal:null,screenSty.row]}>
              <TouchableOpacity
                style={[screenSty.contant, screenSty.padding20H]}
                onPress={() => {
                  setIsRequest(false);
                  setIsSupport(false);
                  setHelpful(!isHelpful);
                }}
              >
                <Text style={[screenSty.font12,screenSty.padding10H, screenSty.colorBold]}>
                  Helpful Tools
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 5, marginRight: 10 }}
                onPress={() => {
                  setIsRequest(false);
                  setIsSupport(false);
                  setHelpful(!isHelpful);
                }}
              >
                {isHelpful && (
                  <Icon type="font-awesome" name="angle-down" size={20} color={color.primary} />
                )}
                {!isHelpful && (
                  <Icon type="font-awesome" name="angle-right" size={20} color={color.primary} />
                )}
              </TouchableOpacity>
            </View>
            {isHelpful && (
              <View
                style={[screenSty.padding10TopBottom]}
              >
                {
                  wifiListVal.map(item=> <View key={item.id} style={styles.listBox}>
                   {
                    /*
                    <YoutubePlayer
                      height={200}
                      width={'100%'}
                      videoId={item.url}
                      onChangeState={onStateChange}
                    />
                    */
                   } 
                   <TouchableOpacity onPress={()=>setPopup(item)}>
                      <Image source={item.img} resizeMode={'contain'} style={{width:Dimensions.get('screen').width - 40,height:200}} ></Image>
                      <Text style={screenSty.font16}>{item.lab}</Text>
                   </TouchableOpacity>
                  </View>)
                }
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <Overlay isVisible={visible} >
        <View style={{alignItems:'flex-end'}}>
          <TouchableOpacity onPress={()=>{setVisible(false);setyYoutubeId(null)}}>
            <Icon type="font-awesome" name="close" size={25} color={color.primary} />
          </TouchableOpacity>
        </View>

        <YoutubePlayer
                      height={200}
                      width={Dimensions.get('screen').width - 40}
                      videoId={youtubeId}
                      onChangeState={onStateChange}
                    />
      </Overlay> 
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  TextArr:{
    height:130
  },
  listBox: {
    marginVertical: 10,
    borderRadius: 10,
  },
  boxMargin: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  marginTop: {
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
  },
  txtClor: {
    color: "rgb(130,123,195)",
  },
});

export default SupportScreen;
