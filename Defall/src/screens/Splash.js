import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useState,useEffect,useContext } from 'react';
import { Image, ImageBackground, PermissionsAndroid, SafeAreaView, StatusBar, View } from 'react-native';
import screenSty from '../style/screenSty';
import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";
import PermissionDialog from './common/PermissionDialog';
import i18n from '../i18n/i18n';
import { getCompanyDetails, getResidents, getRoomTypes } from '../redux/Actions/auth';
import StateContext from '../context/stateContext';



const Splashscreen = ({ navigation }) => {
    const [isF, setIsF] = useState(true);
    const [isShowPass, setIsShowPass] = useState(false);
    const { setAuth,setSelCompany,setRoomTypes,setResidentAss } = useContext(StateContext)
  
    const fun =async () =>{
            let UserInfo = await AsyncStorage.getItem('userInfo');
             if(UserInfo !== null) {
                let user = JSON.parse(UserInfo);
                setAuth(user)
                setRoomTypes(await getRoomTypes(user.token))
                
                if(user.user_details.role_id==9 ){
                    navigation.navigate("main");
                }else if(!user.user_details.terms_and_condition){
                    navigation.navigate("installDevice");
                }else if(user.user_details.company_id==null && (!user.user_details.direct_resident_in_company || user.user_details.direct_resident_in_company==0)){
                    navigation.navigate("installDevice",{screen:'address'})
                }else{ 
                    getCompanyDetails( user.token,user.user_details.company_id).then(async (com)=>{ 
                    setSelCompany(com.data);
                    getCompanyResidnts(user,com.data)
                    });
                }
             } else {
                 navigation.navigate("login"); 
             }
    }
    const getCompanyResidnts = async (user,company)=>{
        getResidents(user.token, user.user_details.company_id).then(async (residentList)=>{
          if (!residentList || residentList.length == 0 ) {  
            setResidentAss(company)
            navigation.navigate("installDevice",{screen:'resident'})
          }else{
            navigation.navigate("main");
          }
        })
    }
    if(AsyncStorage.getItem('language')!=null){
        AsyncStorage.getItem('language').then(e=>{
             i18n.changeLanguage(e)
             .then(() => {

             })
             .catch(err => console.log(err));
         })
    }
    useEffect(() => {
        let setTime = null;
        if (Platform.OS == "android") {
            _checkAllPermissions() 
        }else{
            setTime  = setTimeout(async () => {    
                fun()
          }, 3000)
        }
        return () => clearTimeout(setTime)
    }, [isF]);
    if (Platform.OS == "android") {
        AndroidKeyboardAdjust.setAdjustPan();
    }
    const _checkAllPermissions = async () => {
        const cameraStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        const readLocationStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (
          cameraStatus &&
          readLocationStatus
        ) {
         
            setIsShowPass(false)
            fun()
        }else{
            setIsShowPass(true)
        }
      };
    const closeBox = ()=>{
        setIsShowPass(false);
        fun()
    }
    return (
        <SafeAreaView style={[screenSty.contant]}>
            <StatusBar
                animated={true}
                backgroundColor="#fff"
                barStyle={'default'}
                showHideTransition={'fade'}
                hidden={true} />
            <ImageBackground source={require("../assets/splash.png")} style={screenSty.contant} resizeMode='stretch'>
                <View style={[screenSty.centerContent, screenSty.contant]}>
                    <Image source={require("../assets/logo.png")} style={{height:300}} resizeMode='contain'></Image>
                </View>
            </ImageBackground>
          
            <PermissionDialog showModal={isShowPass} closeModal={closeBox}></PermissionDialog> 
        </SafeAreaView>

    )
}
export default Splashscreen;