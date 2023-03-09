import * as React from "react";
import { useState, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Alert,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import screenSty from "../../style/screenSty";
import buttonSty from "../../style/buttonSty";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "./../common/Loader";
import InputScrollView from "react-native-input-scroll-view";
import { Unit } from "../Unit";
import { checkVendor, userMobile } from "../../redux/Actions/auth";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';

const SignUpScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [isLodering, setIsLodering] = useState(false);
  const [parent_company_id, setParent_company_id] = useState(0);
  const [direct_company_resident, setDirect_company_resident] = useState(false);

  const ref_name = useRef();
  const ref_email = useRef();
  const ref_phoneno = useRef();
  const ref_vendorCode = useRef();


  const signUpBut = async (val=null,direct_resident) => {

    if (Unit.isEmpty(name,"Please enter name ")) {  return; }
    if (Unit.isEmpty(email,"Please enter email")) {  return; }
    if (Unit.isEmail(email,"Please enter valid email ")) {  return; }
    if (Unit.isEmpty(phoneNo,"Please enter Phone number")) {  return; }
    if (Unit.isEmpty(vendorCode,"Please enter Vendor Code")) {  return; }

    if (val == 0 || val == null) {
      checkVendorCode(1);
      return;
    } else {

      let user = await userMobile(name, email.trim(), phoneNo, val,direct_resident);
      setIsLodering(false);
      if (user.status) {
        Alert.alert(
          "Great!",
          "Your account has successfully been created. Please check your email for the account credentials.",
          [{ text: "Login", onPress: () => navigation.navigate("login") }]
        );
      } else {
        Unit.alertMes(user.message);
      }
    }
  };

  const checkVendorCode = async (type) => {
    try {
      setIsLodering(true);
      let company = await checkVendor(vendorCode.trim())
      if (company.status) {
        if (company.data.is_valid) {
          setParent_company_id(company.data.parent_company_id);
          setDirect_company_resident(company.data.direct_resident_in_company);
          
          if (type == 1) {
            signUpBut(company.data.parent_company_id,company.data.direct_resident_in_company);
          }
        } else {
          setParent_company_id(null);
          Unit.alertMes(company.message);
          setIsLodering(false);
        }
      }
    } catch (error) {
      console.warn(error)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground resizeMode="stretch" source={require("../../assets/bg.png")} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <InputScrollView style={[screenSty.contant, screenSty.padding15H]} >
            <Text style={screenSty.headerTitle}>{t('Sign Up')}</Text>
            <View style={screenSty.headerBorder}></View>
            <View
              style={[
                screenSty.margin20Top,
                screenSty.margin20H
              ]}
            >
              <Text style={screenSty.Desc}>
                {t("Let's set up your account. Please add the account holder/caregiver's details. You can add the details of the person you want to monitor later")}
              </Text>
              <View>
                <TextFieldUI
                    onChangeText={(txt) => setName(txt)}
                    placeholder="Name"
                    inputTitle="Name"
                    value={name}
                  />
                   <TextFieldUI
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder="Email"
                    inputTitle="Email"
                    value={email}
                  />
                  {
                    /*
                       <TextFieldMaskUI
                    onChangeText={(txt) => {if(txt.length < 13) {
                      setPhoneNo(txt);
                    }}}
                    value={phoneNo}
                    placeholder="xxx-xxx-xxxx"
                    options={{ mask: "SSS-SSS-SSSS" }}
                    type={"custom"}
                    keyboardType="number-pad"
                    inputTitle="Phone Number"
                  />
                    
                    */
                  }
                    <TextFieldUI
                      onChangeText={(text) => {
                        if (text.length < 11) {
                          setPhoneNo(text);
                        }
                      }}
                      placeholder="xxxxxxxxxx"
                      keyboardType="number-pad"
                      inputTitle="Phone Number"
                      value={phoneNo}
                    isRequired={true}
                  />
                   <TextFieldUI
                    onChangeText={(txt) => {
                      setVendorCode(txt);
                      setParent_company_id(0)
                    }}
                    placeholder="Vendor Code"
                    inputTitle="Vendor Code"
                    value={vendorCode}
                  />


              </View>


              <View style={[screenSty.centerItem, screenSty.margin20TopBottom]}>
                <TouchableOpacity
                  style={buttonSty.buttonBox}
                  onPress={() => signUpBut(parent_company_id,direct_company_resident)}
                >
                  <Text style={buttonSty.buttonBoxTxt}>{t('Sign Up')}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={screenSty.centerItem}
                onPress={() => navigation.navigate("login")}
              >
                <Text style={[screenSty.font15, screenSty.colorB]}>
                  {" "}
                  {t('Already have an account')}?
                  <Text style={[screenSty.colorPrimary,screenSty.colorBold]}> {t('Sign In here')}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </InputScrollView>
        </TouchableWithoutFeedback>
      </ImageBackground>
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};

export default SignUpScreen;
