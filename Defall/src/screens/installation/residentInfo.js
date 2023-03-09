import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  TouchableWithoutFeedback,
  Text,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  StyleSheet,
} from "react-native";
import screenSty from "../../style/screenSty";
import inputSty from "../../style/inputSty";
import InstalHeader from "../common/instalProgress";
import LinearGradient from "react-native-linear-gradient";
import ButtonGroup from "../common/nextButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import { TextInputMask } from "react-native-masked-text";
import InputScrollView from "react-native-input-scroll-view";
import Loader from "../common/Loader";
import { color, pickerSelectStyles } from "../../config/configuration";
import { Unit } from "../Unit";
import { addPatient, addResident, setresident, updatePatient } from "../../redux/Actions/auth";
import moment from "moment";
import SelectFieldUI from "../common/SelectFieldUI";
import TextFieldMaskUI from "../common/TextFieldMaskUI";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const ResidentScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();
  const { auth,resident,setResident,residentAdd} = useContext(StateContext)
  const [isLodering, setIsLodering] = useState(false);

  const [firstName, setFirstName] = useState(
    resident == null ? "" : resident.first_name
  );
  const [lastName, setLastName] = useState(
    resident == null ? "" : resident.last_name
  );
  const [DOB, setDOB] = useState(resident == null ? "" : resident.dob);
  const [email, setEmail] = useState(
    resident == null ? "" : resident.email
  );
  const [phoneNo, setPhoneNo] = useState(
    resident == null ? "" : resident.phone
  );
  const [gender, setGender] = useState(
    resident == null ? 0 : resident.sex
  );
  const [patient_id, setPatientId] = useState(
    resident == null ? 0 : resident.id
  );

  const ref_firstName = useRef();
  const ref_lastName = useRef();
  const ref_DOB = useRef();
  const ref_email = useRef();
  const ref_phone = useRef();

  const genderList = [
    { label: "Male", value: 1 },
    { label: "Female", value: 2 },
    { label: "Other", value: 3 },
  ];


  const nextBut = async () => {
    if (Unit.isEmpty(firstName,"Please enter first name")) { return; }
    if (Unit.isEmpty(lastName,"Please enter last name")) { return; }
    if (Unit.isEmpty(DOB,"Please enter DOB")) { return; }
    if (DOB.trim().length != 10) {  Unit.alertMes("Please enter valid DOB");  return; }

    let d = moment(DOB, "MM/DD/YYYY") ;
    let to = moment();
    if (isNaN(d)) {  Unit.alertMes("Please enter valid DOB");  return; }

    if (d.diff(to, 'days')>0 ) {
      Unit.alertMes("The birthday cannot be a future date. Please enter a valid date.");  return;
    }
    if(!Unit.isEmpty(email)){
      if (Unit.isEmail(email,"Please enter valid email ")) { return; }
    }
    
    if (Unit.isNumberVal(gender,"Please select gender")) {  return; }

    setIsLodering(true);
    if (patient_id == 0) {
     
      let add = await addPatient(firstName,lastName,DOB,gender,email,phoneNo,auth?.token,auth?.user_details.company_id,residentAdd)
      setIsLodering(false);
      if(add.status){
        setResident({"first_name":firstName,"last_name":lastName,"dob":DOB,
        "phone":phoneNo,"email":email,"sex":gender,"id":add.data.patientId})
        navigation.navigate("contact");
      }else{
        Unit.alertMes("Please check user info")
      }
      
      

    } else {
      await updatePatient(firstName,lastName,DOB,gender,email,phoneNo,auth?.token,auth?.user_details.company_id,patient_id)
        setResident({"first_name":firstName,"last_name":lastName,"dob":DOB,
        "phone":phoneNo,"email":email,"sex":gender,"id":patient_id})
        setIsLodering(false);
        navigation.navigate("contact");      
    }
  };
 

  return (
    <SafeAreaView style={screenSty.contant}>
        <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
    
        <InstalHeader navigation={navigation} progress={0.4} backPage={"address"} />
        <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
          <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[screenSty.margin10Top]} >
                <Text style={[screenSty.font17, screenSty.centerTxt, screenSty.colorB,screenSty.margin20H, screenSty.margin20TopBottom]}>
                {t('Enter the name of the resident being monitored')}.
                </Text>
                <View>
                <TextFieldUI
                    onChangeText={(txt) => setFirstName(txt)}
                    placeholder=""
                    inputTitle="First Name of the Resident"
                    isRequired={true}
                    value={firstName}
                    borderViews={[firstName != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />
                  <TextFieldUI
                    onChangeText={(txt) => setLastName(txt)}
                    placeholder=""
                    inputTitle="Last Name of the Resident"
                    isRequired={true}
                    value={lastName}
                    borderViews={[lastName != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />

                  <TextFieldMaskUI
                    onChangeText={(txt) => {
                      if (txt.length < 11) {
                        setDOB(txt);
                      }
                    }}
                    value={DOB}
                    placeholder="MM/DD/YYYY"
                    options={{ mask: "SS/SS/SSSS" }}
                    type={"custom"}
                    keyboardType="numeric"
                    inputTitle="DOB of the Resident"
                    borderViews={[DOB != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />

                  <TextFieldUI
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder=""
                    inputTitle="Email of the Resident"
                    value={email}
                    borderViews={[email != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />
                {
                  /*
                   <TextFieldMaskUI
                    onChangeText={(text) => {
                      if (text.length < 13) {
                        setPhoneNo(text);
                      }
                    }}
                    value={phoneNo}
                    placeholder="xxx-xxx-xxxx"
                    options={{ mask: "SSS-SSS-SSSS" }}
                    type={"custom"}
                    keyboardType="number-pad"
                    inputTitle="Phone Number of the Resident"
                    borderViews={[phoneNo != "" ? inputSty.TextInput : inputSty.empityTxt]}
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
                  />
                  <SelectFieldUI
                    onChangeText={(txt) => setGender(txt)}
                    placeholder={{ label: t("Select a gender"), value: 0 }}
                    inputTitle="Gender of the Resident"
                    isRequired={true}
                    value={gender}
                    items={genderList}
                    borderViews={[gender != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </InputScrollView>
        </ScrollView>
      </LinearGradient>
      <ButtonGroup onClickNext={nextBut} onClickBack={()=>{
          navigation.navigate("address");
      }} />
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};

export default ResidentScreen;
