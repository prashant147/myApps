import * as React from 'react';
import { useState, useRef,useContext } from 'react';
import {  Keyboard, StyleSheet, Text,  TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import screenSty from '../../../style/screenSty';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from "@rneui/themed";
import InputScrollView from 'react-native-input-scroll-view';
import buttonSty from '../../../style/buttonSty';
import AppHeader from '../../common/AppHeader';
import { color } from '../../../config/configuration';
import { Unit } from '../../Unit';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import '../../../i18n/i18n';
import SelectFieldUI from '../../common/SelectFieldUI';
import TextFieldMaskUI from '../../common/TextFieldMaskUI';
import TextFieldUI from '../../common/TextFieldUI';
import StateContext from '../../../context/stateContext';

const AddResidentScreen = ({ navigation }) => {
    const {t, i18n} = useTranslation();
    const { auth,companyType,setResident,setResidentAss,isComapany,resident } = useContext(StateContext)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [DOB, setDOB] = useState(null)
    const [email, setEmail] = useState(null)
    const [phoneNo, setPhoneNo] = useState(null)
    const [gender, setGender] = useState(null)

      
    const [formValues, setFormValues] = useState([
      ""
    ]);


    const genderList = [{ "label": 'Male', value: 1 }, { "label": 'Female', value: 2 }, { "label": 'Other', value: 3 }]

    const isFocused = useIsFocused();
    React.useEffect(() => {

        if(isFocused){
           if(resident!=null){
            setFirstName(resident.first_name)
            setLastName(resident.last_name)
            setDOB(resident.dob)
            setEmail(resident.phone)
            setPhoneNo(resident.email)
            setGender(resident.sex)
            setFormValues(resident.formValues)
           }else{
            setFirstName(null)
            setLastName(null)
            setDOB(null)
            setEmail(null)
            setPhoneNo(null)
            setGender(null)
            setFormValues([
              ""
            ])
           }

        }
      return () => { }
    }, [isFocused]);


    let handleChange = (i, e, ind) => {
      let newFormValues = [...formValues];
        newFormValues[i] = e;
      setFormValues(newFormValues);
    };
    let handleRemove = (i) => {
      const values = [...formValues];
      values.splice(i, 1);
      setFormValues(values);
    };
    let handleAdd = (i) => {
      const values = [...formValues];
        values.push("");
        setFormValues(values);
    };

    const nextBut = async () => {

        if (Unit.isEmpty(firstName,'Please enter first name')) { return }
        if (Unit.isEmpty(lastName,'Please enter last name')) { return }
        if (Unit.isEmpty(DOB,'Please enter DOB')){ return }
        if (DOB.length != 10) {  Unit.alertMes('Please enter valid DOB'); return }
        let d = moment(DOB, "MM/DD/YYYY") ;
        let to = moment();
        if (isNaN(d)) {  Unit.alertMes("Please enter valid DOB");  return; }
    
        if (d.diff(to, 'days')>0 ) {
          Unit.alertMes("The birthday cannot be a future date. Please enter a valid date.");  return;
        }
        if (!Unit.isEmpty(email)){ 
          if (Unit.isEmail(email,'Please enter valid email')){ return }
        }

        if (!Unit.isEmpty(phoneNo)){ 
            if (Unit.isNumberVal(phoneNo,'Please enter valid phone')){ return  }
         }
        if (Unit.isNumberVal(gender,'Please select gender')){ return }

        if(auth!=null && ((auth?.user_details.role_id==9 ) && companyType=="2" )){
          let win = formValues.filter(e=>e.trim()=="");
          if(win.length>0){
            Unit.alertMes("Please fill all wing name")
            return
          }
        }

        setResident({ first_name:firstName,
          last_name:lastName,
          dob:DOB,
          phone:phoneNo,
          email:email,
          sex:gender,
          formValues:formValues});
          setResidentAss(null)
        navigation.navigate("ResidentsAddress") 
       
    }
 

    return (
        <View style={[screenSty.contant, screenSty.backgroundColor]}>
            <AppHeader navigation={navigation} backPop={()=>isComapany?navigation.navigate("companyList"):navigation.navigate("ResidentList")} title={'Add Residents'} backPage={isComapany?'companyList':'ResidentList'} isResident={false}></AppHeader>

            <InputScrollView keyboardOffset={100} useAnimatedScrollView={true} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[screenSty.margin20Top, screenSty.contant, screenSty.padding15H]}>

                    <TextFieldUI
                        onChangeText={(txt) => setFirstName(txt)}
                        placeholder=""
                        inputTitle="First Name of the Resident"
                        isRequired={true}
                        value={firstName}
                    />
                    <TextFieldUI
                        onChangeText={(txt) => {
                          setLastName(txt);
                          handleChange(0,`${txt} Residence`,1)
                        }}
                        placeholder=""
                        isRequired={true}
                        inputTitle="Last Name of the Resident"
                        value={lastName}
                    />
                    <TextFieldMaskUI
                    onChangeText={(txt) => {
                      if (txt.length < 11) {
                        setDOB(txt);
                      }
                    }}
                    value={DOB}
                    placeholder="MM/DD/YYYY"
                    isRequired={true}
                    options={{ mask: "SS/SS/SSSS" }}
                    type={"custom"}
                    keyboardType="numeric"
                    inputTitle="DOB of the Resident"
                  />

                  <TextFieldUI
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder=""
                    inputTitle="Email of the Resident"
                    value={email}
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
                  />    
                       
                       {
                         auth!=null && ((auth?.user_details.role_id==9 ) && companyType=="2" ) && <View>
                              {formValues.map((element, index) => (
                                <>
                                  {
                                    index==0 && <View style={{alignItems:'flex-end'}}><TouchableOpacity
                                    style={styles.addContect}
                                    onPress={() => handleAdd(index)}
                                  >
                                    <Icon type="font-awesome" name="plus" size={10} color="#6156d0" />
                                  </TouchableOpacity></View>
                                  }
                                  <View style={screenSty.row}>
                                    <View style={screenSty.contant}>
                                       <TextFieldUI
                                      onChangeText={(txt) => {
                                        handleChange(index, txt, 1);
                                      }}
                                      placeholder=""
                                      value={formValues[index]}
                                      inputTitle={`Wing Name ${index+1}`}
                                    />
                                    </View>
                                    {
                                    index!=0 &&
                                     <TouchableOpacity
                                        style={styles.removedContect}
                                        onPress={() => handleRemove(index)}
                                      >
                                        <Icon type="font-awesome" name="trash-o" size={20} color="#6156d0" />
                                      </TouchableOpacity>
                                    }
                                  </View>
                                  
                                </>
                              ))}
                          </View>
                        }
                        <View style={[screenSty.margin20Top, screenSty.centerItem]}>
                            <TouchableOpacity style={buttonSty.buttonBox} onPress={nextBut}>
                                <Text style={buttonSty.buttonBoxTxt}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </InputScrollView>
        </View>
    )
}
const pickerStyles = StyleSheet.create({
    inputIOS: {
        flex:1,
      color: color.primary,
      fontWeight: "400",
      paddingTop: 0,
      marginLeft: 0,
      height: 40,
      marginTop: 0,
    },
    inputAndroid: {
        flex:1,
      color: color.primary,
      fontWeight: "400",
      paddingTop: 0,
      marginLeft: 0,
      height: 40,
      paddingHorizontal: 0,
      paddingBottom: 0,
      marginTop: 0,
    }
  });
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
      width:20,
      paddingLeft: 5,
      paddingRight: 5,
      flexDirection: "row",
      justifyContent: "flex-end",
      flex: 1,
    }
  });
export default AddResidentScreen;