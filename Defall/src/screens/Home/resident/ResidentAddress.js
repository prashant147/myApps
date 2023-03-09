import * as React from 'react';
import { useState, useRef,useContext } from 'react';
import {  Keyboard, ScrollView, StyleSheet, Text, TextInput,  TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import screenSty from '../../../style/screenSty';
import InputScrollView from 'react-native-input-scroll-view';
import { addPatient,  addThirdPatient, getCompanyBy3party, getCountries, getStates } from '../../../redux/Actions/auth';
import buttonSty from '../../../style/buttonSty';
import AppHeader from '../../common/AppHeader';
import Loader from '../../common/Loader';
import { color } from '../../../config/configuration';
import { Unit } from '../../Unit';
import { useIsFocused } from '@react-navigation/native';
import TextFieldUI from '../../common/TextFieldUI';
import SelectFieldUI from '../../common/SelectFieldUI';
import { useTranslation } from 'react-i18next';
import '../../../i18n/i18n';
import StateContext from '../../../context/stateContext';

const ResidentAddressScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
    const { auth,selCompany,selSubCompany,resident,isComapany,companyType,setResident,setCompany } = useContext(StateContext)
    const [address1, setAddress1] = useState(null);
      const [address2, setAddress2] = useState(null);
      const [countries, setCountries] = useState(null);
      const [Country, setCountry] = useState(null);
      const [city, setCity] = useState(null);
      const [state, setState] = useState(null);
      const [stateArr, setStateArr] = useState(null);
      const [zip, setZip] = useState(null);
  
      const [isLodering, setIsLodering] = useState(false);
    
      const isFocused = useIsFocused();

      React.useEffect( () => {
        fetchData();
        return () => { }
      }, [isFocused]);
    const fetchData = async () =>{
      setIsLodering(true);
      let con = await getCountries();
      setIsLodering(false);
      let countries = con.data.map(element => ({
        ...element, 
        "label": element.name, 
        "value": element.country_id 
      }));
      setCountries(countries)
    }
    const setStatesByCountry = async (id) => {
      setIsLodering(true);
      let con = await getStates(id);
      setIsLodering(false);
      let state = con.data.map(element => ({
        ...element, 
        "label": element.state_name, 
        "value": element.state_name 
      }));
      setStateArr(state)
  
    }
    const nextBut = async () => {

        if (Unit.isEmpty(address1,"Please enter address")) { return; }
        if (Unit.isEmpty(city,"Please enter city")) {  return; }
        if (Unit.isEmpty(state,"Please enter state")) {  return; }
        if (Unit.isEmpty(zip,"Please enter valid zip/postal code")) {  return; }
        if (zip.trim().length < 5) {
            Unit.alertMes("Please enter valid zip/postal code.");  return;
        }
        if (Unit.isEmpty(Country.toString(),"Please select Country.")) {  return; }
        let CountryName = countries.filter((e) => { return e.value == Country })
        if(CountryName.length == 0){ return }
          setIsLodering(true);
          if(isComapany || companyType=="2"){
            let res = await  addThirdPatient(resident.first_name,resident.last_name,resident.dob,resident.sex,resident.email,resident.phone,auth?.token,address1,address2,city,state,zip,CountryName,companyType=="2"? selCompany.id:selSubCompany.id,companyType,resident.formValues)

            if(res){
              if(companyType=="2"){
                setIsLodering(false);
                Unit.alertMes("Resident details insert successfully");
                navigation.navigate("ResidentList");
              }else{
                await getCompanyBy3party( companyType,selSubCompany.id,auth?.token,2).then(async (com)=>{ 
                  setIsLodering(false);
                  setCompany(com.data)
                  setResident(null)
                  Unit.alertMes("Resident details insert successfully");
                  navigation.navigate("companyList");
                });
              }

            }else{
              setIsLodering(false);
            }
          }else{
            let res = await  addPatient(resident.first_name,resident.last_name,resident.dob,resident.sex,resident.email,resident.phone,auth?.token,selCompany.id,resident)

            setIsLodering(false);
            setResident(null)
            Unit.alertMes("Resident details insert successfully");
            navigation.navigate("ResidentList");
          }
    }


    return (
        <View style={[screenSty.contant, screenSty.backgroundColor]}>
          <AppHeader navigation={navigation} backPop={()=>navigation.navigate("addResidents")} title={'Add Residents Address'} backPage={'addResidents'} isResident={false}></AppHeader>
            <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
              <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={[screenSty.margin20Top, screenSty.contant, screenSty.padding15H]}>
                  
                    <View>
                      <TextFieldUI
                            onChangeText={(txt) => setAddress1(txt)}
                            placeholder=""
                            isRequired={true}
                            inputTitle={"Address Line 1"}
                            value={address1}
                        />
                      <TextFieldUI
                            onChangeText={(txt) => setAddress2(txt)}
                            placeholder=""
                            isRequired={true}
                            inputTitle={"Address Line 2"}
                            value={address2}
                         />

                  <SelectFieldUI
                    onChangeText={(txt) => {
                      setCountry(txt);
                      setStatesByCountry(txt)
                    }}
                    placeholder={{ label: "Select a Country", value: "" }}
                    inputTitle="Country"
                    isRequired={true}
                    value={Country}
                    items={countries}
                  />
                  <SelectFieldUI
                    onChangeText={(txt) => setState(txt)}
                    placeholder={{ label: "Select a State", value: "" }}
                    inputTitle="State"
                    isRequired={true}
                    value={state}
                    items={stateArr}
                  />

                      <TextFieldUI
                            onChangeText={(txt) => setCity(txt)}
                            placeholder=""
                            isRequired={true}
                            inputTitle={"City"}
                            value={city}
                        />
                      <TextFieldUI
                            onChangeText={(txt) => {
                              if (txt.length < 7) {
                                setZip(txt);
                              }
                            }}
                            placeholder=""
                            isRequired={true}
                            inputTitle={"Zip Code"}
                            value={zip}
                        />
                        
                        <View>

                        </View>
                    </View>

    
                    <View style={[screenSty.margin20Top, screenSty.centerItem]}>
                        <TouchableOpacity style={buttonSty.buttonBox} onPress={nextBut}>
                            <Text style={buttonSty.buttonBoxTxt}>Complete</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </InputScrollView>
            </ScrollView>

          <Loader loading={isLodering} />
        </View>
      );
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
  },
});
export default ResidentAddressScreen;