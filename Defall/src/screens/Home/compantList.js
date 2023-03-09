import React, { useState,useContext,useEffect } from "react";
import { FlatList, Keyboard, SafeAreaView,  StyleSheet, Text,  TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import screenSty from "../../style/screenSty";
import AppHeader from "../common/AppHeader";
import { Icon } from "@rneui/themed";
import { color } from "../../config/configuration";
import { useIsFocused } from "@react-navigation/native";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";

const CompanyListScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();
    const { auth,company,selSubCompany,companyType,setSelCompany,setIsComapany } = useContext(StateContext)
    const  [com,setcom] = useState(null);
    const  [selCom,setSelCom] = useState(null);

    const selectCompany = (comp)=>{
        setSelCompany(comp)
        navigation.navigate("mainScreen",{screen:'ResidentList'});
    }
    useEffect( () => {
        setcom(company)
        return () => { }
    }, [useIsFocused()]);
    useEffect(() => {
        searchCom()
        return () => { }
    }, [selCom]);
    const searchCom = ()=>{

        if(selCom==null || selCom.length == 0){
            setcom(company);
        }else{
            if(company){
                let c = company.filter(e=>e.name.indexOf(selCom) >= 0 || (e.vendor_code!=null && e.vendor_code.indexOf(selCom) >= 0))
                setcom(c)
            }
        }
    }
    return (
        <SafeAreaView style={[screenSty.contant,screenSty.backgroundColor]}>
             {
               auth!=null  && companyType!=null && <AppHeader title={companyType=="1"?(selSubCompany!=null?selSubCompany.name:""):"Assisted/Independent Living"} navigation={navigation} backPage={companyType=="1"?'individualCompany':'thirdRdParty'} ></AppHeader>
             }    
            {
              auth!=null && companyType==null  && <AppHeader  navigation={navigation} ></AppHeader>
             } 
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[screenSty.contant]}>
                    <View style={[screenSty.margin20H,screenSty.margin20Top]}>
                        <TextFieldUI
                            onChangeText={(txt) => setSelCom(txt)}
                            isSearch={true}
                            numberOfLines={1}
                            placeholder={t("Search by company name,vendor code")}
                        />
                    </View>

                    <FlatList style={[screenSty.contant,screenSty.margin15H]} data={com}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={()=>selectCompany(item)} style={[screenSty.box,screenSty.row]}>
                                    <View style={[screenSty.centerItem,{paddingLeft:10, backgroundColor:color.paleLavender,borderRadius:50,height:50,width:50}]}>
                                        {
                                            (item.is_home_company==null || item.is_home_company==0) && <Icon type="ionicons" style={[screenSty.margin8Top,screenSty.marginRight10]} name="business" color={color.primary} size={30}></Icon>
                                        }
                                        {
                                            item.is_home_company==1 && <Icon type="ionicons" style={[screenSty.margin8Top,screenSty.marginRight10]} name="home" color={color.primary} size={30}></Icon>
                                        }
                                    </View>
                                    <View style={[screenSty.contant,screenSty.padding10H,{justifyContent:'center'}]}>
                                        <Text style={screenSty.font14}>{item.name}</Text>
                                        <Text style={[screenSty.font12,{color:color.font4}]}>{item.vendor_code}</Text>
                                    </View>
                                    <Icon type="font-awesome" style={[screenSty.margin15Top,screenSty.marginRight10]} name="angle-right" color={color.primary} size={20}></Icon>
                                </TouchableOpacity>
                                } >
                    </FlatList> 
                    {
                        companyType =="1" && <TouchableOpacity onPress={()=> {
                            setIsComapany(true);
                            navigation.navigate("mainScreen",{screen:'addResidents'})
                        }} style={styles.addButt}>
                            <Icon type="font-awesome" name="user-plus" color={color.font} size={20}></Icon>
                        </TouchableOpacity>
                    }
                    
                </View>
            </TouchableWithoutFeedback>
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
export default CompanyListScreen;