import React, { useState,useContext,useEffect } from "react";
import { FlatList, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import inputSty from "../../style/inputSty";
import screenSty from "../../style/screenSty";
import AppHeader from "../common/AppHeader";
import { Icon } from "@rneui/themed";
import { color } from "../../config/configuration";
import { Unit } from "../Unit";
import { useIsFocused } from "@react-navigation/native";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import StateContext from "../../context/stateContext";
  
const CompanyScreen = (props) => {
    const {t, i18n} = useTranslation();
    const { setSelCompany,selCompany,setCompanyBack,CompanyBack } = useContext(StateContext)

    const  [selCom,setSelCom] = useState(null);
    const [companyList,setCompanyList] =useState([])

    useEffect(() => {
        setCompanyList(props.data)
        return () => { }
    }, [props.data]);
    useEffect(() => {
        searchCom()
        return () => { }
    }, [selCom]);
    const searchCom = ()=>{
        if(Unit.isEmpty(selCom) ){
            setCompanyList(props.data);
        }else{
            let c = props.data.filter(e=>e.name.indexOf(selCom) >= 0 || (e.vendor_code!=null && e.vendor_code.indexOf(selCom) >= 0))
            setCompanyList(c)
        }
    }

    return (
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
                <FlatList style={[screenSty.contant,screenSty.margin15H]} data={companyList}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={()=>{
                                let arr = CompanyBack;

                                arr.push(selCompany)
                                setCompanyBack(arr)
                                setSelCompany(item);
                                }} style={[screenSty.box,screenSty.row]}>
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
            </View>
        </TouchableWithoutFeedback>
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
export default CompanyScreen;