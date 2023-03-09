import React, { useState,useContext,useEffect } from "react";
import { FlatList, Keyboard, SafeAreaView,  Text,  TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import screenSty from "../../style/screenSty";
import AppHeader from "../common/AppHeader";
import { Icon } from "@rneui/themed";
import { color } from "../../config/configuration";
import { getCompanyBy3party } from "../../redux/Actions/auth";
import { useIsFocused } from "@react-navigation/native";
import TextFieldUI from "../common/TextFieldUI";
import { useTranslation } from "react-i18next";
import '../../i18n/i18n';
import Loader from "../common/Loader";
import StateContext from "../../context/stateContext";

const IndividualCompanyScreen = ({ navigation, route }) => {
    const {t, i18n} = useTranslation();

    const { auth,subCompany,setCompany,setSelSubCompany,setCompanyType } = useContext(StateContext)
    const [isLodering, setIsLodering] = useState(false);
    const  [com,setcom] = useState(null);
    const  [selCom,setSelCom] = useState(null);

    const [isF,setIsF] = useState(true);
    const selectCompany = async (comp)=>{
        setIsLodering(true);
        setCompany(null);
        setSelSubCompany(comp);
        setCompanyType("1");
        getCompanyBy3party( "1",comp.id,auth?.token,2).then(async (com)=>{ 
            setIsLodering(false); 
            setCompany(com.data)
            navigation.navigate("companyList");
        });
    }
    useEffect( () => {
    // 
        setSelCom(null)
           setcom(subCompany);
        return () => { }
    }, [isF])
    useEffect(() => {
        searchCom()
        return () => { }
    }, [selCom]);
    const searchCom = ()=>{
        if(selCom==null || selCom.length == 0){
            setcom(subCompany);
        }else{
            if(subCompany){
                let c = subCompany.filter(e=>e.name.indexOf(selCom) >= 0 || (e.vendor_code!=null && e.vendor_code.indexOf(selCom) >= 0))
                setcom(c)
            }
        }
    }
    return (
        <SafeAreaView style={[screenSty.contant,screenSty.backgroundColor]}>
            <AppHeader title={"Individual Residence"} navigation={navigation} backPage={'thirdRdParty'} ></AppHeader>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[screenSty.contant]}>
                    <View style={[screenSty.margin20H,screenSty.margin20Top]}>
                        <TextFieldUI
                            onChangeText={(txt) => setSelCom(txt)}
                            value={selCom}
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
                                            item.is_home_company==0 && <Icon type="ionicons" style={[screenSty.margin8Top,screenSty.marginRight10]} name="business" color={color.primary} size={30}></Icon>
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

                    <Loader loading={isLodering} />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
};

export default IndividualCompanyScreen;