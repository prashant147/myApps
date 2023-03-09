import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import screenSty from '../../style/screenSty';
import { useState,useEffect,useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../common/AppHeader';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import SelectFieldUI from '../common/SelectFieldUI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StateContext from '../../context/stateContext';

const ProfileScreen = ({ navigation }) => {
    const {t} = useTranslation();
    const [isF, setIsF] = useState(true);
    const [language, setLanguage] = useState("en")
    const { auth,company } = useContext(StateContext)

    useEffect(() => {
        AsyncStorage.getItem("language").then(e=>{
            console.log(e)
            if(e){
                setLanguage(e)
            }
            
        })
    }, [isF]);
    const languageList = [{ "label": 'English', value: "en" }, 
                          { "label": '中国人', value: "ch" }, 
                          { "label": 'Française', value: "fr" }, 
                          { "label": '日本', value: "jp" }, 
                          { "label": 'Israel', value: "si" }, 
                          { "label": 'Española', value: "sp" }]

    useEffect(() => {
        i18n.changeLanguage(language)
        .then(() => {
            AsyncStorage.setItem('language',language)
        })
    }, [language]);

    return (
        <SafeAreaView style={[screenSty.contant, screenSty.backgroundColor]}>
            <AppHeader navigation={navigation} backPage={ (auth!=null && (auth?.user_details.role_id==9 ))?"thirdRdParty": (company!=null && company.length>1)?'companyList':'ResidentList'} isResident={false}></AppHeader>
            <View style={[screenSty.contant,screenSty.padding15H]}>
                <ScrollView style={screenSty.margin10Top} >
                    {
                        auth!=null && <View style={[screenSty.box]}>

                        <View style={[screenSty.row]}>
                            <Text style={[screenSty.contant, screenSty.font12]}>{t("User Name")}</Text>
                            <Text > - </Text>
                            <Text style={[{ flex: 2 }, screenSty.font14]}>{auth?.user_details.user_name}</Text>
                        </View>
                        <View style={[screenSty.row]}>
                            <Text style={[screenSty.contant, screenSty.font12]}>{t("Phone No")}</Text>
                            <Text > - </Text>
                            <Text style={[{ flex: 2 }, screenSty.font14]}>{auth?.user_details.phone}</Text>
                        </View>
                        <View style={[screenSty.row]}>
                            <Text style={[screenSty.contant, screenSty.font12]}>{t("Email")} </Text>
                            <Text > - </Text>
                            <Text style={[{ flex: 2 }, screenSty.font14]}>{auth?.user_details.email}</Text>
                        </View>
                        <View style={screenSty.margin10Top}>
                           
                            
                                <SelectFieldUI
                                onChangeText={(txt) => setLanguage(txt)}
                                placeholder={{ label: "Select Language", value: null }}
                                inputTitle="Language"
                                value={language}
                                items={languageList}
                            />
                            
                        </View>
                        
                    </View>
                    }
                    
                </ScrollView>

            </View>
        </SafeAreaView>
    )
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

export default ProfileScreen;