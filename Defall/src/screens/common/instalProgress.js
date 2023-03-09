import * as React from 'react';
import { useState } from 'react';
import * as Progress from 'react-native-progress';
import { BackHandler, Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import screenSty from '../../style/screenSty';
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color, screen_size } from '../../config/configuration';
import { RFValue } from 'react-native-responsive-fontsize';
import '../../i18n/i18n';
import { useTranslation } from 'react-i18next';

const InstalHeader = (props) => { 
    const {t, i18n} = useTranslation();
    const back = props.backPage;
    React.useEffect(() => {
        const backAction = () => {
            if (props.backPage) {
               props.navigation.navigate(props.backPage)
            } else {
                BackHandler.exitApp();
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [props.navigation]);
    return (

        <View >
            <View style={[screenSty.row, screenSty.margin10Bottom]}>
                {
                    props.isTopBack && <TouchableOpacity style={[{ marginRight: 10, marginTop: 15, marginLeft: 10 }]} onPress={() => { props.navigation.navigate(props.backPage); }}>
                        <Icon type="font-awesome" name="long-arrow-left" size={25} color={color.primary} />
                    </TouchableOpacity>
                }
                <Text style={styles.header}>{t(props.progress == 1 ? 'Completed' : 'Installation')}</Text>
            </View>

            <Progress.Bar color={color.primary} unfilledColor={'#cbc5ff'} progress={props.progress} width={Dimensions.get('window').width - 30} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: RFValue(28,screen_size),
        fontFamily: 'OpenSans-SemiBold',
        color: color.font1,
        paddingTop: 10,
        fontWeight: "bold",
    }
});
export default InstalHeader;