import * as React from "react";
import { useState, useRef,useContext } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";

import screenSty from "../../style/screenSty";
import InstalHeader from "../common/instalProgress";
import LinearGradient from "react-native-linear-gradient";
import ButtonGroup from "../common/nextButton";
import { SafeAreaView } from "react-native-safe-area-context";
import InputScrollView from "react-native-input-scroll-view";
import { addUserAddress,  getCountries, getStates,  updateUserAddress } from "../../redux/Actions/auth";
import Loader from "../common/Loader";
import { useIsFocused } from "@react-navigation/native";
import { color } from "../../config/configuration";
import { Unit } from "../Unit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextFieldUI from "../common/TextFieldUI";
import SelectFieldUI from "../common/SelectFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const AddressScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();
  const { auth, residentAdd,setResidentAss } = useContext(StateContext)
  const [address1, setAddress1] = useState(residentAdd!=null?residentAdd.address:null);
  const [address2, setAddress2] = useState(residentAdd!=null?residentAdd.address_line_2:null);
  const [countries, setCountries] = useState(null);

  const [Country, setCountry] = useState(null);
  const [city, setCity] = useState(residentAdd!=null?residentAdd.city:null);
  const [state, setState] = useState(residentAdd!=null?residentAdd.state:null );
  const [stateArr, setStateArr] = useState(null);
  const [zip, setZip] = useState(residentAdd!=null?residentAdd.zip:null);


  const [isLodering, setIsLodering] = useState(false);


  const isFocused = useIsFocused();
  React.useEffect( () => {
    async function fetchData() {
      setIsLodering(true);
      let con = await getCountries();
      setIsLodering(false);
      let countries = con.data.map(element => ({
        ...element, 
        "label": element.name, 
        "value": element.country_id 
      }));
      setCountries(countries)
      let CountryName = residentAdd == null ? null : residentAdd.Country
      setCountry(countries.filter(e=>e.label==CountryName)[0].value)
    }
    fetchData();
    return () => { }
  }, [isFocused]);
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
    if(CountryName.length == 0){
      return
    }
    if (!auth?.user_details.company_id) {
      setIsLodering(true);
      await addUserAddress(
        address1,address2,city,state,zip,
        auth?.token,auth?.user_details.parent_company_id ? auth?.user_details.parent_company_id : 0,
        CountryName[0].label
      ).then(async (res)=>{
        setIsLodering(false);

        if(res && res.status){
          setResidentAss({
            "address": address1,
            "address_line_2": address2,
            "city": city,
            "state": state,
            "zip": zip,
            "country": CountryName[0].label
          })
          auth.user_details.company_id = res.data.company_id;
          await AsyncStorage.setItem('userInfo',JSON.stringify(auth) );
          navigation.navigate("resident");
        }
      })

    } else {
      setIsLodering(true);
      await updateUserAddress(
        address1,address2,city,state,zip,auth?.token,auth?.user_details.company_id,
        CountryName[0].label
      ).then((res)=>{
        setIsLodering(false);
        if(res && res.status){
          setResidentAss({
            "address": address1,
            "address_line_2": address2,
            "city": city,
            "state": state,
            "zip": zip,
            "country": CountryName[0].label
          })
          navigation.navigate("resident");
        } else {
          Unit.alertMes(res.data.message);
        }
      })

    }
  };

  return (
    <SafeAreaView style={screenSty.contant}>
      <LinearGradient colors={[color.font, color.paleLavender, color.font]} style={[screenSty.contant, screenSty.padding15H]} >
        <InstalHeader navigation={navigation} progress={0.3} backPage={"TermsAndConditions"} />
        <ScrollView style={[screenSty.contant, { marginBottom: 100 }]}>
          <InputScrollView keyboardOffset={100} useAnimatedScrollView={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[screenSty.marginTop, screenSty.margin30Bottom]}>
                <Text style={[screenSty.font17, screenSty.centerTxt, screenSty.colorB,screenSty.colorSemiBold, screenSty.margin20TopBottom]}>
                {t('Enter the address of the location where the device is or will be installed')}.
                </Text>
                <View>
                  <TextFieldUI
                    onChangeText={(txt) => setAddress1(txt)}
                    placeholder=""
                    inputTitle="Address Line 1"
                    isRequired={true}
                    value={address1}
                  />
                   <TextFieldUI
                    onChangeText={(txt) => setAddress2(txt)}
                    placeholder=""
                    inputTitle="Address Line 2"
                    isRequired={true}
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
                    inputTitle="City"
                    isRequired={true}
                    value={city}
                  />
                   <TextFieldUI
                    onChangeText={(txt) =>{
                      if (txt.length < 7) {
                        setZip(txt);
                      }
                    }}
                    placeholder=""
                    inputTitle="Zip Code"
                    isRequired={true}
                    value={zip}
                 />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </InputScrollView>
        </ScrollView>

      </LinearGradient>
      <ButtonGroup onClickNext={nextBut} onClickBack={()=>navigation.navigate("TermsAndConditions",{back:true})} />
      <Loader loading={isLodering} />
    </SafeAreaView>
  );
};
export default AddressScreen;
