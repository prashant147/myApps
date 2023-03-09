import React, { useState,useContext } from "react";
import {  Image, Keyboard, SafeAreaView,  Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import screenSty from "../../style/screenSty";
import AppHeader from "../common/AppHeader";
import { Icon } from "@rneui/themed";
import { color } from "../../config/configuration";
import { Unit } from "../Unit";
import {  getCompanyBy3party } from "../../redux/Actions/auth";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import Loader from "../common/Loader";
import { useIsFocused } from "@react-navigation/native";
import StateContext from "../../context/stateContext";

const ThirdRdPartyScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();
    const { auth,setCompanyType,setSubCompany,setCompany } = useContext(StateContext)
    const [isLodering, setIsLodering] = useState(false);

    const selectCompany = async (type)=>{
        setCompanyType(null)
        setIsLodering(true);
        getCompanyBy3party( type,auth?.user_details.company_id,auth?.token,1).then(async (com)=>{ 
            setIsLodering(false); 
            if(com){
                try{
                    if(type==1){ 
                        setSubCompany(com.data)
                        navigation.navigate("individualCompany");
                    }else{
                        setCompanyType(`${type}`)
                        setCompany(com.data)
                        navigation.navigate("companyList");
                    }
                }catch(e){
                }
            }else{
                if(type==1){
                    Unit.alertMes(`Not found company list on ${t('Individual Residence')}`);
                }else{
                    Unit.alertMes(`Not found company list on ${t('Assisted/Independent Living')}`);
                }
            }
        });
    }

    return ( 
        <SafeAreaView style={[screenSty.contant,screenSty.backgroundColor]}>
                 
            <AppHeader  navigation={navigation} ></AppHeader>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[screenSty.contant]}>
                    <View style={[screenSty.margin15H,screenSty.margin10Top]}>
                        {
                         auth!=null &&  auth?.user_details.is_end_user_residence=='1' && <TouchableOpacity onPress={()=>selectCompany(1)} style={[screenSty.box,screenSty.row,{borderWidth:1,borderColor:color.primary}]}>
                                        <Image source={require("../../assets/com.png")} style={{ width: 50, height: 50,paddingLeft:10 }} ></Image> 
                                        <View style={[screenSty.contant,screenSty.padding10H,{justifyContent:'center'}]}>
                                            <Text style={[screenSty.font17,screenSty.colorPrimary,screenSty.colorSemiBold]}>{t('Individual Residence')}</Text>
                                        </View>
                                        <Icon type="font-awesome" style={[screenSty.margin15Top,screenSty.marginRight10]} name="angle-right" color={color.primary} size={20}></Icon>
                                    </TouchableOpacity>
                        }
                        {
                          auth!=null &&  auth?.user_details.is_assisted_independent=='1' && <TouchableOpacity onPress={()=>selectCompany(2)} style={[screenSty.box,screenSty.row,{borderWidth:1,borderColor:color.primary}]}>
                                <Image source={require("../../assets/company.png")} style={{ width: 50, height: 50,paddingLeft:10 }} ></Image> 
                                <View style={[screenSty.contant,screenSty.padding10H,{justifyContent:'center'}]}>
                                    <Text style={[screenSty.font17,screenSty.colorPrimary,screenSty.colorSemiBold]}>{t('Assisted/Independent Living')}</Text>
                                </View>
                                <Icon type="font-awesome" style={[screenSty.margin15Top,screenSty.marginRight10]} name="angle-right" color={color.primary} size={20}></Icon>
                            </TouchableOpacity>
                        }
                        
                    </View>
                   
                            
                </View>
            </TouchableWithoutFeedback>
            <Loader loading={isLodering} />
        </SafeAreaView>
    )
};

export default ThirdRdPartyScreen;