import * as React from 'react';
import { useState, useRef,useContext } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import screenSty from '../../../style/screenSty';
import InputScrollView from 'react-native-input-scroll-view';
import buttonSty from '../../../style/buttonSty';
import AppHeader from '../../common/AppHeader';
import Loader from '../../common/Loader';
import { getResidents, updatePatient } from '../../../redux/Actions/auth';
import moment from 'moment';
import { Unit } from '../../Unit';
import { useTranslation } from 'react-i18next';
import '../../../i18n/i18n';
import TextFieldMaskUI from '../../common/TextFieldMaskUI';
import TextFieldUI from '../../common/TextFieldUI';
import SelectFieldUI from '../../common/SelectFieldUI';
import StateContext from '../../../context/stateContext';

const UpdateResidentScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();
    const { auth,selCompany,resident } = useContext(StateContext)

    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [DOB, setDOB] = useState(null)
    const [email, setEmail] = useState(null)
    const [phoneNo, setPhoneNo] = useState(null)
    const [gender, setGender] = useState(null)
    const [isLodering, setIsLodering] = useState(false);

    const genderList = [{ "label": 'Male', "value": 1 }, { "label": 'Female', "value": 2 }, { "label": 'Other', "value": 3 }]


    React.useEffect(() => {

        if (resident != null) {
            setFirstName(resident.first_name);
            setLastName(resident.last_name);
            setDOB(moment(resident.dob).format('MM/DD/YYYY'));
            setEmail(resident.email);
            setPhoneNo(resident.phone);
            setGender(parseInt(resident.sex));
        } else {
            setFirstName(null);
            setLastName(null);
            setDOB(null);
            setEmail(null);
            setPhoneNo(null);
            setGender(null);
        }
        return () => { }
    }, [resident]);
    const nextBut = async () => {

        if (Unit.isEmpty(firstName,'Please enter first name')) { return }
        if (Unit.isEmpty(lastName,'Please enter last name')) {  return }
        if (Unit.isEmpty(DOB,'Please enter DOB')) {  return }
        if (DOB.length != 10) { Unit.alertMes('Please enter valid DOB'); return }
        let d = moment(DOB, "MM/DD/YYYY") ;
        let to = moment();
        if (isNaN(d)) {  Unit.alertMes("Please enter valid DOB");  return; }
    
        if (d.diff(to, 'days')>0 ) {
          Unit.alertMes("The birthday cannot be a future date. Please enter a valid date.");  return;
        }
        if(!Unit.isEmpty(email)){ 
            if(Unit.isEmail(email,"Please enter valid email")){ return }
        }
        
        if (Unit.isNumberVal(gender,'Please select gender')) { return }
        setIsLodering(true)
        let e = await updatePatient(firstName,lastName,DOB,gender,email,phoneNo,auth?.token,selCompany.id, resident.id,resident.address);
        setIsLodering(false)
        if(e!=null){
            Unit.alertMes("Resident details updated successfully");
            navigation.navigate("ResidentList");
        }
    }

    return (
        <View style={[screenSty.contant, screenSty.backgroundColor]}>
            <AppHeader navigation={navigation} backPop={()=>navigation.navigate("ResidentList")} title={'Update Residents'} backPage={'ResidentList'} isResident={false}></AppHeader>

            <InputScrollView keyboardOffset={100} useAnimatedScrollView={true} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[screenSty.margin20Top, screenSty.contant, screenSty.padding15H]}>
                    <TextFieldUI
                        onChangeText={(txt) => setFirstName(txt)}
                        placeholder=""
                        inputTitle="First Name of the Resident"
                        value={firstName}
                        isRequired={true}
                    />
                    <TextFieldUI
                        onChangeText={(txt) => setLastName(txt)}
                        placeholder=""
                        inputTitle="Last Name of the Resident"
                        value={lastName}
                        isRequired={true}
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
                    isRequired={true}
                  />

                  <TextFieldUI
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder=""
                    inputTitle="Email of the Resident"
                    value={email}
                    isRequired={true}
                  />
                   <TextFieldUI
                     onChangeText={(text) => {
                        if (text.length < 11) {
                          setPhoneNo(text);
                        }
                      }}
                      placeholder="xxxxxxxxxx"
                      keyboardType="number-pad"
                      inputTitle="Phone Number of the Resident"
                    value={phoneNo}
                    isRequired={true}
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
                  
                  <SelectFieldUI
                    onChangeText={(txt) => setGender(txt)}
                    placeholder={{ label: t("Select a gender"), value: 0 }}
                    inputTitle="Gender of the Resident"
                    isRequired={true}
                    value={gender}
                    items={genderList}
                  />    
                       
                        <View style={[screenSty.margin20Top, screenSty.centerItem]}>
                            <TouchableOpacity style={buttonSty.buttonBox} onPress={nextBut}>
                                <Text style={buttonSty.buttonBoxTxt}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </InputScrollView>

            <Loader loading={isLodering} />
        </View>
    )
}
const styles = StyleSheet.create({
    marginTop30: {
        marginTop: 30
    },
    image: {
        width: '100%',
        resizeMode: 'stretch'
    }
});


export default UpdateResidentScreen;