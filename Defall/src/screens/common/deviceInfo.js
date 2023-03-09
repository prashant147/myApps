import * as React from 'react';
import {useContext} from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View,  Image } from 'react-native';
import screenSty from '../../style/screenSty';
import '../../i18n/i18n';
import StateContext from '../../context/stateContext';

const VeviceInfo = (props) => {
    const {t, i18n} = useTranslation();
    const { selDevice } = useContext(StateContext)
    if (selDevice == null) {
        return null;
    } 

    return (
        <View style={[screenSty.box, screenSty.margin10Top]} >
            <View style={[screenSty.row]}>
                {
                    ( selDevice.sensor_mount==0) && <Image source={require("../../assets/Vayyar.png")} resizeMode={'contain'} style={{ width: 50, height: 50 }} ></Image>
                }
                {
                    selDevice.sensor_mount!=0 && <Image source={require("../../assets/VayyarCeiling.png")} resizeMode={'contain'} style={{ width: 50, height: 50 }} ></Image>
                }
                <View style={[screenSty.container, screenSty.margin15H]}>
                    <Text style={[screenSty.font16,screenSty.margin5Top]}>{t('Device')}</Text>
                    <Text style={[screenSty.font12,screenSty.margin5Top]}>{t('Serial No')} -  {selDevice.serial_number}</Text>
                    <View style={[screenSty.row,screenSty.margin5Top]}>
                        <Text style={[screenSty.font12]}>{t('Configuration')} - </Text>
                        {
                            selDevice.region_configured && selDevice.sub_region_configured && <View style={screenSty.ConfiguredBox}>
                                <Text style={[screenSty.font10, screenSty.colorW]} >  {t('Configured')} </Text>
                            </View>
                        }
                        {
                            selDevice.region_configured && !selDevice.sub_region_configured && <View style={screenSty.ConfiguredBox}>
                                <Text style={[screenSty.font10, screenSty.colorW]} >  {t('Configured')} </Text>
                            </View>
                        }
                        {
                            !selDevice.region_configured && !selDevice.sub_region_configured && <View style={screenSty.NotConfiguredBox}>
                                <Text style={[screenSty.font10, screenSty.colorW]} >  {t('Not Configured')} </Text>
                            </View>
                        }


                    </View>

                </View>
            </View>
        </View>
    )
}
export default VeviceInfo;