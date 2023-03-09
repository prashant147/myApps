import * as React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import screenSty from '../../style/screenSty';
import buttonSty from '../../style/buttonSty';
import InstalHeader from '../common/instalProgress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';
  
const SartScreen = ({ navigation }) => {
   const {t, i18n} = useTranslation();
   return (
      <SafeAreaView style={[screenSty.contant, screenSty.backgroundWColor]}>
         
         <View style={[screenSty.contant,screenSty.margin15H]}>
            <InstalHeader navigation={navigation} progress={0.1} />
            <View style={[screenSty.centerContent]}>
               <Image source={require("../../assets/startInfo.png")} style={[screenSty.margin30Top, screenSty.margin10H]} ></Image>
               <Text style={[screenSty.font17, screenSty.centerTxt,screenSty.margin20H, screenSty.margin20Top]}>
                  {t('Congratulations on purchasing a new fall detector! We will have you fill out the account information and then have you connect to the device')}
               </Text>
            </View>
            <View style={[screenSty.margin20Top, screenSty.centerItem]}>
               <TouchableOpacity style={buttonSty.buttonBox} onPress={() => navigation.navigate('TermsAndConditions')} >
                  <Text style={buttonSty.buttonBoxTxt}>{t('Start')}</Text>
               </TouchableOpacity>
            </View>
         </View>
      </SafeAreaView>
   ) 
}

export default SartScreen;