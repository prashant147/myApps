import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  TouchableOpacity,
  Text, View, TouchableWithoutFeedback, Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputScrollView from "react-native-input-scroll-view";
import screenSty from "../../../style/screenSty";
import buttonSty from "../../../style/buttonSty";
import { Unit } from "../../Unit";
import { updateContectInfo } from "../../../redux/Actions/auth";
import AppHeader from "../../common/AppHeader";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import TextFieldUI from "../../common/TextFieldUI";
import TextFieldMaskUI from "../../common/TextFieldMaskUI";
import StateContext from "../../../context/stateContext";

const UpdateContactScreen = ({ route, navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth,selCompany } = useContext(StateContext)
  const [isLodering, setIsLodering] = useState(false);

  const { contact, backPage } = route.params;

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [contectId, setContectId] = useState(null);

  React.useEffect(() => {
    if (contact != null) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone)
      setContectId(contact.id)
    } else {
      setName(null);
      setEmail(null);
      setPhone(null)
      setContectId(null)
    }
    return () => { }
  }, [contact]);


  const updateContact = async () => {
    if (Unit.isEmpty(name,"Please enter first name")) {  return; }
    if (Unit.isEmpty(email,"Please enter email")) {  return; }
    if (Unit.isEmail(email,"Please enter valid email")) {  return; }
    if (Unit.isEmpty(phone,"Please enter phone no")) {   return; }

    setIsLodering(true);
    let update = await updateContectInfo( name,email,phone,auth?.token,selCompany.id,contectId);
    setIsLodering(false);
    if (update.status) {
      Unit.alertMes("Contact details updated successfully");
      navigation.navigate(backPage)
    } else {
      Unit.alertMes(update.message);
    }
  };


  return (
    <SafeAreaView style={[screenSty.contant,  screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} title={'Update Contact'} backPage={backPage}  isResident={true}></AppHeader>

      <View style={screenSty.contant}>

        <TouchableWithoutFeedback style={screenSty.contant} onPress={Keyboard.dismiss}>
          <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
            <View style={[screenSty.marginTop, screenSty.margen20Content]}>
              <Text style={[screenSty.font16, screenSty.margin20Top, screenSty.margin30H, screenSty.centerTxt]}>
                {t("Now configure the Fall alarms. Up to 4 contacts can receive the alarm during a fall event")}.
              </Text>
              <View style={[screenSty.box, screenSty.margin20TopBottom, screenSty.margin20H]} >
                <Text style={[screenSty.font18]}>
                  {t("Contact")}
                </Text>
                <View style={screenSty.margin20Top}>

                <TextFieldUI
                    onChangeText={(txt) =>setName(txt)}
                    placeholder=""
                    inputTitle="Name"
                    isRequired={true}
                    value={name}
                  />
                   <TextFieldUI
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder=""
                    editable={false}
                    inputTitle="Email Address"
                    isRequired={true}
                    value={email}
                  />
                  {
                    /*
                    <TextFieldMaskUI
                    onChangeText={(text) => {
                      if (text.length < 13) {
                        setPhone(text);
                      }
                    }}
                    value={phone}
                    isRequired={true}
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
                          setPhone(text);
                        }
                      }}
                      placeholder="xxxxxxxxxx"
                      keyboardType="number-pad"
                      inputTitle="Phone Number"
                      value={phone}
                    isRequired={true}
                  />

                </View>

              </View>
              <View style={screenSty.centerItem}>
                <TouchableOpacity
                  style={buttonSty.buttonBox}
                  onPress={() => updateContact()}
                >
                  <Text style={buttonSty.buttonBoxTxt}>{t("Update new Contact")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </InputScrollView>
        </TouchableWithoutFeedback>
      </View>
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};


export default UpdateContactScreen;
