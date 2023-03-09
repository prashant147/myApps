import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  TouchableOpacity,
  Text,View,
  ImageBackground,StatusBar,Keyboard,
  TouchableWithoutFeedback,
  BackHandler
} from "react-native";
import screenSty from "../../style/screenSty";
import buttonSty from "../../style/buttonSty";
import inputSty from "../../style/inputSty";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckBox, Overlay } from "@rneui/themed";
import '../../i18n/i18n';
import Loader from "./../common/Loader";
import { Unit } from "../Unit";
import { getCompanyById, getCompanyDetails, getResidents, getRoomTypes,  UpdateUsePassword, userForgetPass, userLoginMobile } from "../../redux/Actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import StateContext from "../../context/stateContext";



const LoginScreen = ({navigation}) => {

  const {t, i18n} = useTranslation();
  const { setAuth,setSelCompany,addResidentAddress,setRoomTypes,setCompany,setisOpenDrawer } = useContext(StateContext)
  const [isRemember, setIsRemember] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [Confpassword, setConfpasswort] = useState("");

  const [isLodering, setIsLodering] = useState(false);

  const [visible, setVisible] = useState(false);
  const [forgetVisible, setForgetVisible] = useState(false);


  React.useEffect(() => { 
    setEmail(null);
    setPassword(null);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => { backHandler.remove() }; 
  },[useIsFocused()]);
  const backAction = () => { return false; }
  const forgetPass = async () => {
    if (Unit.isEmpty(email,"Please enter email")) { return; }
    if (Unit.isEmail(email,"Please enter valid email")) { return; }
    try{
      setIsLodering(true);
      let forget = await userForgetPass(email);
        setIsLodering(false);
        Unit.alertMes(forget.message);
        if (forget.status) {
          setForgetVisible(!forgetVisible);
        }
    }catch(e){
    }
  };
  const loginBut = async () => {  
    if (Unit.isEmpty(email,"Please enter email")) {   return; }
    if (Unit.isEmail(email,"Please enter valid email ")) {  return; }
    if (Unit.isEmpty(password,"Please enter password")) { return; }
    try {
      setIsLodering(true);
      userLoginMobile(email, password).then((response) => { 
        
        if (response) {
          if(response.data.user_details.is_installer!=0){
            setAuth(response.data)
            setUserInfo(response.data)
            if(response.data.new_user){
              setIsLodering(false);
              setNewPassword("");
              setConfpasswort("");
              setVisible(!visible);
            }else {
              setUserPage(response.data)
            }
          }else{
            setIsLodering(false);
            Unit.alertMes("You do not have permission to login")
          }
            
          }else{
            setIsLodering(false);
          }
         
      });
    } catch (error) {
      
    }
  }
  const changePass = async () => {
    if (Unit.isEmpty(newPassword,"Please enter password")) {  return; }
    if (Unit.isStrongPass(newPassword,"The password should have at least 8 characters and it must contain at least one number, one upper case letter, one lowercase letter, and a special character.")) {
      return;
    }
    if (Unit.isEmpty(Confpassword,"Please enter Confirm Password")) {  return; }
    if (Confpassword != newPassword) {
      Unit.alertMes("Password and Confirm Password is not matching");
      return;
    }
    try{
      setIsLodering(true);
     let Userapi = await UpdateUsePassword(newPassword, password,userInfo.user_details.id, userInfo.token)
      setIsLodering(false);
      if (Userapi.status) {
        setUserPage();  
        setNewPassword("");
        setConfpasswort("");
        setVisible(!visible);
      } else {
        Unit.alertMes(Userapi.message);
      }
    }catch(e){
      setIsLodering(false);

    }
    
  };
  const setUserPage = async (user=null)=>{
    if(user==null){
      user = userInfo
    }

    if(isRemember){
      await AsyncStorage.setItem('userInfo',JSON.stringify(user))
    }else{
      await AsyncStorage.removeItem('userInfo')
    }
    setisOpenDrawer(false)
    setRoomTypes(await getRoomTypes(user.token))
     if(!user.user_details.terms_and_condition){
      if(user.user_details.company_id!=null){
        getCompanyDetails( user.token,user.user_details.company_id).then(async (com)=>{ 
          setSelCompany(com.data);
        });
      }
      setIsLodering(false);
      navigation.navigate("installDevice");
    }else if(user.user_details.role_id==9 ){
      setIsLodering(false);
      navigation.navigate("main");
     
    }else if(user.user_details.company_id==null && (!user.user_details.direct_resident_in_company || user.user_details.direct_resident_in_company==0)){
      setIsLodering(false);
      navigation.navigate("installDevice",{screen:'address'})
    }else{
     
      getCompantList(user);
    }
  }
  const getCompantList =  async(user)=>{
    getCompanyById( user.user_details.company_id,user.token).then((res)=>{
      if(res.data.length >1 && user.user_details.role_id > 5){
        setIsLodering(false);
        setCompany(res.data)
        navigation.navigate("main")
      }else{
        getCompanyDetails( user.token,user.user_details.company_id).then(async (com)=>{ 
          setSelCompany(com.data);
          getCompanyResidnts(com.data,user)
        });
      }

    });
  }
  const getCompanyResidnts = async (company,user)=>{
    getResidents(user.token, user.user_details.company_id).then(async (residentList)=>{
      setIsLodering(false)
      if (!residentList || residentList.length == 0 ) {  
        addResidentAddress(company.address, company.address_line_2, company.city, company.state, company.zip,company.country)
        navigation.navigate("installDevice",{screen:'resident'}); 
      }else{
        navigation.navigate("main");
      }
    })
  }
  return (
    <SafeAreaView style={screenSty.contant}>
      <StatusBar
        animated={true}
        backgroundColor="#fff"
        barStyle={"default"}
        showHideTransition={"fade"}
        hidden={true}
      />
      <Overlay isVisible={visible} >
        <View style={[screenSty.padding15H, screenSty.padding10TopBottom]}>
          <Text style={[screenSty.headerDesc]}>
            {t('Change Your Password')}
          </Text>
          <View style={screenSty.margin20Top}>

              <TextFieldUI
                onChangeText={(txt) => setNewPassword(txt)}
                isSecure={true}
                placeholder="Password"
                inputTitle="Password"
                borderViews={[newPassword != "" ? inputSty.TextInput : inputSty.empityTxt]}
              />
              <TextFieldUI
                onChangeText={(txt) => setConfpasswort(txt)}
                isSecure={true}
                placeholder="Confirm Password"
                inputTitle="Confirm Password"
                borderViews={[Confpassword != "" ? inputSty.TextInput : inputSty.empityTxt]}
              />
          </View>
          <View style={[screenSty.centerItem, screenSty.row,screenSty.margin10Top]}>
            <TouchableOpacity
              style={[buttonSty.buttonBox, screenSty.contant]}
              onPress={changePass}
            >
              <Text style={buttonSty.buttonBoxTxt}>  {t('Reset Password')} </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Loader loading={isLodering} />
      </Overlay>

      <Overlay
        isVisible={forgetVisible}
        onBackdropPress={() =>  setForgetVisible(!forgetVisible)}
      >
        <View style={[screenSty.padding20H, screenSty.padding10TopBottom]}>
          <Text style={[screenSty.headerDesc]}>
          {t('Forgot Password')}
          </Text>
          <View style={screenSty.margin20Top}>
            <TextFieldUI
                onChangeText={(txt) => setEmail(txt)}
                placeholder="Email Address"
                inputTitle="Enter your register email address"
                value={email}
              />
          </View>
          <View style={[screenSty.centerItem, screenSty.row,screenSty.margin10Top]}>
            <TouchableOpacity
              style={[buttonSty.buttonBox, screenSty.contant]}
              onPress={() => forgetPass()}
            >
              <Text style={buttonSty.buttonBoxTxt}> {t('Send Recovery Email')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Loader loading={isLodering} />
      </Overlay>
      <ImageBackground resizeMode="stretch" source={require("../../assets/bg.png")} style={screenSty.contant}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[screenSty.contant, screenSty.padding10H]}>
            <Text style={screenSty.headerTitle}>{t('Sign In')}</Text>
            <View style={screenSty.headerBorder}></View>
            <View style={[screenSty.margin20Top, screenSty.margin20H]}>
              <Text style={screenSty.Desc}>{t('Please sign in to continue')}.</Text>
              <View>
                <TextFieldUI
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder="Email"
                    value={email}
                    inputTitle="Email"
                  />
                  <TextFieldUI
                    onChangeText={(txt) => setPassword(txt)}
                    placeholder="Password"
                    inputTitle="Password" 
                    value={password}
                    isSecure={true}
                  />
              </View>

              <View style={[screenSty.row, screenSty.margin10Top]}>
                <View style={screenSty.contant}>
                  <View
                    style={[ screenSty.row, { marginTop: -20,marginLeft:-20 }]}>
                    <CheckBox
                      checkedColor="rgb(113,101,227)"
                      checkedIcon="check-square"
                      containerStyle={{backgroundColor: 'rgba(52, 52, 52, 0)'}}
                      uncheckedIcon="square-o"
                      checked={isRemember}
                      onPress={(newValue) => setIsRemember(!isRemember)}
                    />
                    <Text
                      style={[
                        screenSty.font14,screenSty.colorB,{ marginTop: 18, marginLeft: -20 },
                      ]}>
                      {t('Remember me')}
                    </Text>
                  </View>
                </View>
                <View style={[screenSty.contant]}>
                  <TouchableOpacity
                    style={[{ marginTop: -3 }]}
                    onPress={() => setForgetVisible(true)}
                  >
                    <Text
                      style={[
                        screenSty.font14,
                        screenSty.colorPrimary,
                        {textAlign:'right'}
                      ]}
                    >
                      {t('Forgot Password')}?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[screenSty.margin10Top, screenSty.centerItem]}>
                <TouchableOpacity
                  style={buttonSty.buttonBox}
                  onPress={() => loginBut()}
                >
                  <Text style={buttonSty.buttonBoxTxt}>{t('Sign In')}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[screenSty.margin20Top, screenSty.centerItem]}
                onPress={() => {
                  setEmail("");
                  setPassword("");
                  navigation.navigate("signUp");
                }}
              >
                <Text style={[screenSty.font15]}>
                  {" "}
                  {t('Don’t have an account?')}
                  <Text style={[screenSty.colorPrimary,screenSty.colorBold]}> {t('Sign Up here')}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};

export default LoginScreen;
