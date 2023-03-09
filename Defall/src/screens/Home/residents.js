import React, { useState,useEffect,useContext } from "react";
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
import moment from "moment";
import { deletePatient } from "../../redux/Actions/auth";
  
const ResidentScreen = (props) => {
    const {t, i18n} = useTranslation();
    const { auth,setIsComapany,companyType,setResident } = useContext(StateContext)
    const  [selCom,setSelCom] = useState(null);
    const [residentList,setResidentList] =useState([])
    useEffect(() => {
        setResidentList(props.data)
        return () => { }
    }, [props.data]);
    useEffect(() => {
        searchCom()
        return () => { }
    }, [selCom]);
    const searchCom = ()=>{
        if(Unit.isEmpty(selCom) ){
            setResidentList(props.data);
        }else{
            if(props.data){
                let c = props.data.filter(e=>`${e.first_name} ${e.last_name}`.indexOf(selCom) >= 0 || e.dob.indexOf(selCom) >= 0 || (e.phone!=null && e.phone.indexOf(selCom) >= 0))
                setResidentList(c)
            }
        }
    }
    const deleteResident = async (residentId) =>{
        let c = await deletePatient(residentId,auth?.token);
        if(c.status){
            props.reloadDevice();
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[screenSty.contant]}>
                <View style={[screenSty.margin20H,screenSty.margin20Top]}>
                    <TextFieldUI
                        value={selCom}
                        onChangeText={(txt) => setSelCom(txt)}
                        isSearch={true}
                        numberOfLines={1}
                        placeholder={t("Search by resident name,dob,phone")}
                    />
                </View>

                <FlatList style={[screenSty.contant,screenSty.padding15H]} data={residentList}
                    renderItem={({ item }) =>
                        <View style={screenSty.box}>
                            <TouchableOpacity onPress={()=>{
                                    setResident(item)
                                    props.navigation.navigate("deviceList")
                            }} style={[screenSty.row,styles.headerbox]}>
                                <Text style={[screenSty.contant,screenSty.padding5H,screenSty.font16]}>{item.first_name} {item.last_name}</Text>
                                <Icon type="font-awesome" style={[screenSty.margin8Top,screenSty.marginRight10]} name="chevron-right" color={color.primary} size={15}></Icon>
                            </TouchableOpacity>
                            <View style={screenSty.row}>
                                <View>
                                    <View style={styles.IconBox}>
                                        {
                                            item.sex==1 && <Icon type="simple-line-icon" style={[screenSty.margin8Top,screenSty.marginRight10]} name="user" color={color.primary} size={15}></Icon>
                                        }
                                        {
                                            item.sex==2 && <Icon type="simple-line-icon" style={[screenSty.margin8Top,screenSty.marginRight10]} name="user-female" color={color.primary} size={15}></Icon>
                                        }
                                        {
                                            item.sex==3 && <Icon type="font-awesome" style={[screenSty.margin8Top,screenSty.marginRight10]} name="user-o" color={color.primary} size={15}></Icon>
                                        }
                                        
                                    </View>
                                </View>
                                <View style={screenSty.contant}>
                                    <Text style={[screenSty.font14,screenSty.margin5Top,{color:color.font4}]}>{t("DOB")}   - <Text style={{color:color.font1}}>{moment(item.dob).format('MM/DD/YYYY')}</Text></Text>
                                    <Text style={[screenSty.font14,screenSty.margin5Top,{color:color.font4}]}>{t("Email")} - <Text style={{color:color.font1}}>{item.email}</Text></Text>
                                    <Text style={[screenSty.font14,screenSty.margin5Top,{color:color.font4}]}>{t("Phone No")} - <Text style={{color:color.font1}}>{item.phone}</Text></Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={()=>{
                                            setResident(item)
                                            props.navigation.navigate("updateResidents")
                                    }}>
                                        <Icon type="material" style={[screenSty.margin8Top,styles.editIcon,screenSty.marginRight10]} name="edit" color={color.primary} size={15}></Icon>
                                    </TouchableOpacity>
                                    {
                                        !item.room_id && <TouchableOpacity onPress={()=>deleteResident(item.id)}>
                                        <Icon type="material" style={[screenSty.margin20Top,styles.editIcon,screenSty.marginRight10]} name="delete" color={color.primary} size={15}></Icon>
                                    </TouchableOpacity>
                                    }
                                    
                                </View>
                            </View>
                        </View>
                        } >
                </FlatList> 

                <TouchableOpacity onPress={()=> {
                        setIsComapany(false);
                      props.navigation.navigate("addResidents");
                }} style={styles.addButt}>
                    <Icon type="font-awesome" name="user-plus" color={color.font} size={20}></Icon>
                </TouchableOpacity>
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
export default ResidentScreen;