import React, { useContext, useState,useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import screenSty from "../../style/screenSty";
import AppHeader from "../common/AppHeader";
import { Icon } from "@rneui/themed";
import { color } from "../../config/configuration";
import { useIsFocused } from "@react-navigation/native";
import { addResident, clearResident, deletePatient, getCompanyBy3party, getResidents, selectCompant } from "../../redux/Actions/auth";
import Loader from "../common/Loader";
import moment from "moment";
import { Unit } from "../Unit";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";
import CompanyScreen from "./company";
import ResidentScreen from "./residents";

const ResidentListScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();
    const [selView, setSelView] = useState(true);
    const { auth,company,selCompany,companyType,setResident } = useContext(StateContext)
    const [residentList,setResidentList] =useState(null)
    const [isLodering, setIsLodering] = useState(false);
    const  [companyList,setCompanyList] = useState(null);
    
    const isFocused = useIsFocused();
    const reloadDevice = async () => {
        setIsLodering(true)
        setResidentList(null);
        getResidents(auth?.token, selCompany.id).then(async (residentList)=>{
              setIsLodering(false)
              setResidentList(residentList)
          })
    }
    const reloadCompanyDevice = async () => {
        if(companyType=="2" || (companyType==null && auth?.user_details.role_id > 6)){
            setIsLodering(true)
           getCompanyBy3party(companyType==null?2:companyType, selCompany.id,auth?.token,2).then(async (comList)=>{

                setIsLodering(false)
                setCompanyList(comList.data)
            })
        }else{
            setSelView(false)
        }
       
    }
    useEffect(() => {

        if(isFocused){
            reloadDevice();
            setResident(null);
            if(companyType=="2" || (companyType==null && auth?.user_details.role_id > 6) ){
                reloadCompanyDevice();
               // setSelView(true)
            }
            setSelView(false)
        }

    }, [selCompany,useIsFocused()]);
//&& auth!=null && auth?.user_details.is_installer
    return (
        <SafeAreaView style={[screenSty.contant,screenSty.backgroundColor]}>
            <AppHeader title={selCompany?.name}  navigation={navigation}  backPage={company!=null && company.length>0?'companyList':null} ></AppHeader>
            <View style={[screenSty.contant]} >
                 {
                   ( companyType=="2" && auth!=null || (companyType==null && auth?.user_details?.role_id > 6))  && <View style={[screenSty.row,styles.boxVal]}>
                        <View style={[screenSty.contant,selView?screenSty.selLine:screenSty.empLine]}>
                            <TouchableOpacity style={screenSty.contant} onPress={()=>setSelView(true)}>
                                <Text style={[screenSty.centerTxt,selView?screenSty.selDevice:screenSty.empDevice]} >{t("Company")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[screenSty.contant,!selView?screenSty.selLine:screenSty.empLine]}>
                            <TouchableOpacity style={screenSty.contant} onPress={()=>setSelView(false)}>
                                <Text style={[screenSty.centerTxt,!selView?screenSty.selDevice:screenSty.empDevice]}>{t("Resident")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                 }
                 {
                    (companyType=="2" || (companyType==null && auth?.user_details.role_id > 6)) && selView && <CompanyScreen data={companyList} navigation={navigation}></CompanyScreen>
                 }
                 {
                    !selView && <ResidentScreen reloadDevice={reloadDevice} data={residentList} navigation={navigation}></ResidentScreen>
                 }
            </View>
            <Loader loading={isLodering} />
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({ 
    addButt:{
        position:'absolute',
        justifyContent:'center',
        paddingLeft:5,
        bottom:5,
        right:10,
        backgroundColor:color.primary,
        borderRadius:50,
        width:50,
        height:50
    },
    IconBox:{
        backgroundColor:color.paleLavender,
        borderRadius:10,
        paddingLeft:10,
        paddingTop:3,
        marginRight:10,
        width:40,
        height:40
    },
    headerbox:{
        borderBottomWidth:.5,
        borderBottomColor:color.lightPeriwinkle,
        paddingBottom:10,
        marginBottom:10
    },
    editIcon:{
        borderWidth:1,
        borderColor:color.primary,
        borderRadius:20,
        padding:5
    }   ,
    boxVal:{
        height:45,
        paddingTop:15,
        marginBottom:20,
        marginHorizontal:15
    },
});
export default ResidentListScreen;