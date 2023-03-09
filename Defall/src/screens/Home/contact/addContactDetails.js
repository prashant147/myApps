import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import screenSty from "../../../style/screenSty"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import buttonSty from "../../../style/buttonSty";
import inputSty from "../../../style/inputSty";
import InputScrollView from "react-native-input-scroll-view";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { Unit } from "../../Unit";
import { addContectInfo } from "../../../redux/Actions/auth";
import { color } from "../../../config/configuration";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import TextFieldUI from "../../common/TextFieldUI";
import TextFieldMaskUI from "../../common/TextFieldMaskUI";
import StateContext from "../../../context/stateContext";

const AddContactScreen = ({ route, navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selCompany,resident } = useContext(StateContext)
  const { contactCount,backPage } = route.params;

  const [formValues, setFormValues] = useState([
    { name: "", email: "", phone: "" },
  ]);

  const [isNotVal, setIsNotVal] = useState(false);
  const [isLodering, setIsLodering] = useState(false);

  const isFocused = useIsFocused();
  React.useEffect(() => {

    setFormValues([
      { name: "", email: "", phone: "" },
    ])
    return () => { }
  }, [isFocused]);
  const nextBut = async () => {
    await Isvalidation();
    formValues.forEach((element, index) => {
      if (Unit.isEmpty(element.name,"Please enter " + (index + contactCount + 1) + " contact name")) {
        setIsNotVal(false);
        return;
      }
      if (Unit.isEmpty(element.email,"Please enter " + (index + contactCount + 1) + " contact email")) {
        setIsNotVal(false);
        return;
      }
      if (Unit.isEmail(element.email,"Please enter valid email ")) {
        setIsNotVal(false);
        return;
      }
      if (Unit.isEmpty(element.phone,"Please enter " + (index + contactCount + 1) + " contact phone")) {
        setIsNotVal(false);
        return;
      }
    }); 

    if (isNotVal) {
      try{
        setIsLodering(true);
        let addCon =  await addContectInfo(formValues, auth?.token, selCompany.id,resident.id);
        setIsLodering(false);
        if(addCon){
          
          Unit.alertMes("Contact details saved successfully")
          navigation.navigate(backPage);
        }

      }catch(e){

      }
    }
  };

  const Isvalidation = async () => {
    setIsNotVal(true);
    formValues.forEach((element, index) => {
      if (element.name.trim().length == 0) {
        setIsNotVal(false);
        return;
      }
      if (element.email.trim().length == 0) {
        setIsNotVal(false);
        return;
      }
      if (
        !/^[a-zA-Z0-9]+([._-]{1,1}[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.]{1,1}[a-zA-Z]{2,})$/.test(element.email)
      ) {
        setIsNotVal(false);
        return;
      }
      if (element.phone.trim().length == 0) {
        setIsNotVal(false);
        return;
      }
      if (!/^[0-9]{10}$/.test(element.phone)) {
        setIsNotVal(false);
        return;
      }
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
  let handleRemove = (i) => {
    const values = [...formValues];
    values.splice(i, 1);
    setFormValues(values);
  };
  let handleAdd = (i) => {
    const values = [...formValues];
    if (values.length < 4 - contactCount) {
      values.push({ name: "", email: "", phone: "" });
      setFormValues(values);
    }
  };

  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} title={'Add Contact Details'} backPage={backPage} isResident={true}></AppHeader>
      <View style={screenSty.contant}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
            <View style={[ screenSty.padding15H]}>
              <Text style={[screenSty.font16,screenSty.padding15H, screenSty.margin20Top, screenSty.margin30H, screenSty.centerTxt]}>
              {t("Now configure the Fall alarms. Up to 4 contacts can receive the alarm during a fall event")}.
              </Text>
              {formValues.map((element, index) => (
                <View style={[screenSty.box, screenSty.margin20TopBottom]} key={index.toString()}>
                  <View style={[screenSty.row, styles.headerBox]}>
                    <Text style={screenSty.font18}>
                    {t("Contact")} {index + contactCount + 1}
                    </Text>
                    <View style={{ right: 0, position: "absolute" }}>
                      {index == 0 && formValues.length != 4 - contactCount && (
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
                  <View style={screenSty.margin20Top} >

                  <TextFieldUI
                    onChangeText={(txt) => {
                      handleChange(index, txt, 1);
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
                    isRequired={true}
                    value={element.email}
                    borderViews={[element.email != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />
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
                    isRequired={true}
                    inputTitle="Phone Number"
                    borderViews={[element.phone != "" ? inputSty.TextInput : inputSty.empityTxt]}
                  />
                    */
                  }
                 


                  
                  </View>
                </View>
              ))}
              <View style={[screenSty.centerItem, screenSty.margin20Bottom]}>
                <TouchableOpacity
                  style={buttonSty.buttonBox}
                  onPress={nextBut}
                >
                  <Text style={buttonSty.buttonBoxTxt}>{t("Add new Contact")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </InputScrollView>
        </TouchableWithoutFeedback>
      </View>
      <Loader loading={isLodering} />
    </View>
  );
};
const styles = StyleSheet.create({
  headerBox:{
     borderBottomWidth:.5,
     borderBottomColor:color.primary,
     paddingBottom:5,
     paddingLeft:5
  },
  addContect: {
    borderRadius: 50,
    borderColor: "#6156d0",
    borderWidth: 1,
    paddingBottom: 3,
    paddingTop: 4,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  }
});

export default AddContactScreen;
