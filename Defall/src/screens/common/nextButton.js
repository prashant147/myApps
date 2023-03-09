import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { color } from '../../config/configuration';
import buttonSty from '../../style/buttonSty';
import screenSty from '../../style/screenSty';
import '../../i18n/i18n';

const ButtonGroup = (props) => {
    const {t, i18n} = useTranslation();
    const ran = () => {
        return
    }
    return (
        <View style={[screenSty.contant, styles.buttonGroup]}>
            <View style={screenSty.contant}>
                {
                    !props.isBack && <TouchableOpacity style={[buttonSty.buttonBackName, buttonSty.backBut]} onPress={props.onClickBack} >
                        <Text style={[buttonSty.buttonBoxTxt, { color: color.primary }]}>{t('BACK')}</Text>
                    </TouchableOpacity>
                }

            </View>
            <View style={screenSty.contant}>
                {
                    props.onClickNext && <TouchableOpacity style={[buttonSty.buttonBackName, buttonSty.nextBut, { alignSelf: 'flex-end' }]} onPress={props.onClickNext} >
                        {
                            !props.nextText && <Text style={buttonSty.buttonBoxTxt}>{t('NEXT')} </Text>
                        }
                        {
                            props.nextText && <Text style={buttonSty.buttonBoxTxt}>{t(props.nextText)} </Text>
                        }
                    </TouchableOpacity>
                }

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    opacityBut: {
        opacity: 1
    },
    opaBut: {
        opacity: 1
    },
    buttonGroup: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50
    }
});
export default ButtonGroup;