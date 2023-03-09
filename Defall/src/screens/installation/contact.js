import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  TouchableOpacity, StyleSheet, Text, TextInput, View, ScrollView
} from "react-native";
import screenSty from "../../style/screenSty";
import inputSty from "../../style/inputSty";
import InstalHeader from "../common/instalProgress";
import LinearGradient from "react-native-linear-gradient";
import ButtonGroup from "../common/nextButton";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInputMask } from "react-native-masked-text";
import InputScrollView from "react-native-input-scroll-view";
import { addContectInfo, updateContectInfo } from "../../redux/Actions/auth";
import Loader from "./../common/Loader";
import { color } from "../../config/configuration";
import { Unit } from "../Unit";
import TextFieldUI from "../common/TextFieldUI";
import TextFieldMaskUI from "../common/TextFieldMaskUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const ContactScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const [isNotVal, setIsNotVal] = useState(false);

  const { auth,resident} = useContext(StateContext)
  const [isLodering, setIsLodering] = useState(false);
  const [formValues, setFormValues] = useState(
       [{ name: "", email: "", phone: "", user_id: 0 }]
  );

  const nextBut = async () => {

    await Isvalidation();
    let insertData = [];
    let UpdateData = [];
    formValues.forEach((element, index) => {
      if (Unit.isEmpty(element.name,"Please enter " + (index + 1) + " contact name")){
        setIsNotVal(false); return;
      }
      if (Unit.isEmpty(element.email,"Please enter " + (index + 1) + " contact email")) {
        setIsNotVal(false); return;
      }
      if (Unit.isEmail(element.email,"Please enter " + (index + 1) + " valid email")) { 
         setIsNotVal(false); return; 
      }
      if (Unit.isEmpty(element.phone,"Please enter " + (index + 1) + " contact phone")){
        setIsNotVal(false); return;
      }
      if (element.user_id!=0) {
        UpdateData.push(element);
      } else {
        insertData.push(element);
      }
    });
    console.log(formValues);
    if (isNotVal) {
      console.log("UpdateData");
      console.log(UpdateData);
      console.log("insertData");
      console.log(insertData)
      setIsLodering(true);
      if (UpdateData.length > 0) {
        UpdateData.forEach(async (e, index) => {
          let UP = await updateContectInfo(e.name,e.email,e.phone,auth?.token,auth?.user_details.company_id,e.id)
          if (insertData.length == 0) {

            if (index == UpdateData.length - 1) {
              setIsLodering(false);
              navigation.navigate("addRoom");
            }
          }
        });
      }
      if (insertData.length > 0) {
        try{
          let UP = await addContectInfo(insertData, auth?.token, auth?.user_details.company_id,resident.patient_id);
            setIsLodering(false);
            if(UP){
              let user = [];
              UP.data.user_details.forEach(e=>{
                let u = insertData.filter(e1=>e1.email==e.email);
                user.push({ name:u[0].name , email:e.email, phone:u[0].phone , user_id: e.user_id,id:e.user_id })
              })
              if(UpdateData.length==0){                 
                setFormValues(user)
              }
              else{
                let da = [...UpdateData,...user];
                setFormValues(da)
              }
              navigation.navigate("addRoom");
            }
        }catch(e){}
      }
    }
  };
  const Isvalidation = async () => {
    setIsNotVal(true);
    formValues.forEach((element, index) => {
      if (Unit.isEmpty(element.name)) {  setIsNotVal(false);  return; }
      if (Unit.isEmpty(element.email)) {  setIsNotVal(false);  return; }
      if (Unit.isEmail(element.email)) {  setIsNotVal(false);  return; }
      if (Unit.isEmpty(element.phone)) {  setIsNotVal(false);  return; }
    });
  };

  let handleChange = (i, e, ind) => {
    let newFormValues = [...formValues];
    if (ind == 1) {
      newFormValues[i]["name"] = e;
    }
    if (ind == 2) {
      newFormValues[i]["email"] = e;
    }
    if (ind == 3) {
      newFormValues[i]["phone"] = e;
    }
    setFormValues(newFormValues);
  };
  let handleRemove = async (i) => {
    let val = formValues[i]
    if (val.id) {
      await deleteContect(val.id,auth?.token)
    }
    const values = [...formValues];
    values.splice(i, 1);
    setFormValues(values);
  };
  let handleAdd = (i) => {
    const values = [...formValues];
    if (values.length < 4) {
      values.push({ name: "", email: "", phone: "", user_id: 0 });
      setFormValues(values);
    }
  };
 
  return (
    <SafeAreaView style={screenSty.contant}>
        <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
    
          <InstalHeader navigation={navigation} progress={0.4} backPage={"resident"} />
          <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
            <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
              <View style={[screenSty.margin10Top]}>
                <Text style={[screenSty.font17, screenSty.centerTxt, screenSty.margin20H, screenSty.margin20TopBottom]}>
                 
                  {t("Now configure the Fall alarms. Up to 4 contacts can receive the alarm during a fall event")}.
                </Text>
                {formValues.map((element, index) => (
                  <View style={styles.contectBox} key={index.toString()}>
                    <View
                      style={{
                        marginBottom: 10,
                        paddingBottom: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgb(191,184,250)",
                        flexDirection: "row",
                      }}
                    >
                      
                      <Text style={[ screenSty.font16, screenSty.contant]}>
                       { t("Contact")} {index + 1}
                      </Text>
                      <View>
                        {index == 0 && formValues.length <= 4 && (
                          <TouchableOpacity
                            style={styles.addContect}
                            onPress={() => handleAdd(index)}
                          >
                            <Icon type="font-awesome" name="plus" size={10} color="#6156d0" />
                          </TouchableOpacity>
                        )}
                        {index != 0 && (
                          <TouchableOpacity
                            style={styles.removedContect}
                            onPress={() => handleRemove(index)}
                          >
                            <Icon type="font-awesome" name="trash-o" size={20} color="#6156d0" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View>

                    <TextFieldUI
                        onChangeText={(text) => {
                          handleChange(index, text, 1);
                          Isvalidation();
                        }}
                        placeholder=""
                        inputTitle="Name"
                        isRequired={true}
                        value={element.name}
                        borderViews={[element.name != "" ? inputSty.TextInput : inputSty.empityTxt]}
                      />
                      <TextFieldUI
                        onChangeText={(txt) => {
                          handleChange(index, txt, 2);
                          Isvalidation();
                        }}
                        placeholder=""
                        inputTitle="Email Address"
                        value={element.email}
                        borderViews={[element.email != "" ? inputSty.TextInput : inputSty.empityTxt]}
                      />
                      {
                        /*
                          <TextFieldMaskUI
                          onChangeText={(text) => {
                            if (text.length < 13) {
                              handleChange(index, text, 3);
                              Isvalidation();
                            }
                          }}
                          value={element.phone}
                          placeholder="xxx-xxx-xxxx"
                          options={{ mask: "SSS-SSS-SSSS" }}
                          type={"custom"}
                          keyboardType="number-pad"
                          inputTitle="Phone Number"
                          borderViews={[element.phone != "" ? inputSty.TextInput : inputSty.empityTxt]}
                        />
                        */
                      }
                     
                      <TextFieldUI
                      onChangeText={(text) => {
                        if (text.length < 11) {
                          handleChange(index, text, 3);
                          Isvalidation();
                        }
                      }}
                      placeholder="xxxxxxxxxx"
                      keyboardType="number-pad"
                      inputTitle="Phone Number"
                      value={element.phone}
                    isRequired={true}
                  />
                    </View>
                  </View>
                ))}
              </View>
            </InputScrollView>
          </ScrollView>
      </LinearGradient>
      <ButtonGroup onClickNext={nextBut} onClickBack={()=> navigation.navigate("resident")} />
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  addContect: {
    borderRadius: 50,
    borderColor: "#6156d0",
    borderWidth: 1,
    paddingHorizontal:8,
    paddingTop:6,
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  },
  removedContect: {},
  contectBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  marginTop30: {
    marginTop: 30,
  },
  image: {
    width: "100%",
    resizeMode: "stretch",
  },
});

export default ContactScreen;
