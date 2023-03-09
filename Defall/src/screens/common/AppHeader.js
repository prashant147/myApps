import * as React from 'react';
import { BackHandler, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import screenSty from '../../style/screenSty';
import { Icon } from "@rneui/themed";
import { useState,useContext } from 'react';
import { color, screen_size } from '../../config/configuration';
import { useIsFocused } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import '../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import StateContext from '../../context/stateContext';

const AppHeader = (props) => {
    const {t, i18n} = useTranslation();
    const { auth,resident,setSelCompany,CompanyBack,setCompanyBack,setisOpenDrawer,isOpenDrawer } = useContext(StateContext)
    const [backPage, setBackPage] = useState(null);
    const openAddWorker = () => { }
    const isFocused = useIsFocused();
    const backAction = () => {

        if (props.backPage) {
            if (props.itemsData) {
                props.navigation.navigate(backPage, props.itemsData)
            } else {
                props.navigation.navigate(backPage)
            }
            setBackPage(null)
        } else {
            BackHandler.exitApp();
        }
        return true;
    }

    React.useEffect(() => {
       
        if(isFocused){
            setBackPage(props.backPage)
        }else{
            
            if(props.backPage=="vayyarDevice"){
                setBackPage("deviceList")
            }else if(props.backPage=="contactDetailsList"){
                setBackPage("deviceList")
            }else if(props.backPage=="residentsList"){
                if(company.length > 1){
                    setBackPage("companyList")
                }else{
                    setBackPage(null)
                }
            }else if(props.backPage=="addSubRegions"){
                setBackPage("subRegions")
            }else if(props.backPage=="subRegions"){
                setBackPage("vayyarDevice")
            }else if(props.backPage=="pairingDevice"){
                setBackPage("wifiNewDevice")
            }else if(props.backPage=="wifiNewDevice"){
                setBackPage("stepsaddBluetooth")
            }else if(props.backPage=="stepsaddBluetooth"){
                setBackPage("addNewDevice")
            }else if(props.backPage=="addNewDevice"){
                setBackPage("addroomDevice")
            }else if(props.backPage=="addroomDevice"){
                setBackPage("vayyarDevice")
            }else if(props.backPage=="companyList"){
                setBackPage(null)
            }else if(props.backPage=="deviceList"){
                setBackPage("residentsList")
            }
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => { backHandler.remove() }; 
    }, [backPage,isFocused==true])
  
    return (
        <View style={props.isResident?styles.haederBox:styles.haederBoxH}>
            <View style={styles.haeder}>
                {
                    !props.backPage && <TouchableOpacity style={screenSty.margin5Top} onPress={() => setisOpenDrawer(!isOpenDrawer)}>
                        <Image source={require("../../assets/menuList.png")} />
                    </TouchableOpacity>
                } 
                {
                    props.backPage && <TouchableOpacity onPress={() => {
                        if (props.itemsData) { 
                            props.navigation.navigate(props.backPage, props.itemsData) 
                        } else { 
                            if(CompanyBack.length > 0 && props.backPage=="companyList"){
                                setSelCompany(CompanyBack[CompanyBack.length - 1]);
                                let arr = CompanyBack;
                                arr.pop()
                                setCompanyBack(arr)
                                
                            }else{
                                props.navigation.navigate(props.backPage) 
                            }
                            
                        }
                    }}>
                        <Icon type="font-awesome" name="long-arrow-left" size={25} color={color.primary} />
                    </TouchableOpacity>
                }

                {
                    !props.title && auth!=null  && <Text style={[styles.headerHomeTitle]}>{t("Hello")}, {auth?.user_details.user_name} </Text>
                }
                {
                    props.title && <Text style={[styles.headerHomeTitle]}>{t(props.title)}</Text>
                }
                <View >
                    <TouchableOpacity onPress={() => openAddWorker()}>
                        <Icon type="font-awesome" name="bell-o" size={20} color={color.primary} />
                    </TouchableOpacity>
                </View>

            </View>
            {
                resident!=null && props.isResident && <View style={styles.borderline}><Text style={[screenSty.font16]}>
                    {t('Resident')} - <Text style={[screenSty.font14,screenSty.colorPrimary]}>{resident.first_name} {resident.last_name}</Text>
                </Text></View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    borderline:{
        borderTopColor:color.primary,
        borderTopWidth:1,
        paddingBottom:15,
        paddingTop:5
    },
    haederBox:{
        backgroundColor:color.font,
        minHeight:75,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        paddingHorizontal:15
    },
    haederBoxH:{
        backgroundColor:color.font,
        minHeight:60,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        paddingHorizontal:15
    },
    haeder:{
        flexDirection:'row',
        alignItems: 'center',
        paddingVertical:10
    },
    headerHomeTitle:{
        flex:1,
        color:color.primary,
        marginLeft:15,
        fontSize: RFValue(18,screen_size), 
        fontFamily: "OpenSans-Regular",
        fontWeight: 'bold',
        textAlignVertical: 'center'
    }
});

export default AppHeader;