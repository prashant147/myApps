import * as React from 'react';
import { useState } from 'react';
import {  StyleSheet, Text, View, FlatList } from 'react-native';
import screenSty from '../../style/screenSty';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from "react-native-youtube-iframe";
import AppHeader from '../common/AppHeader';
import { screen_size } from '../../config/configuration';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';

const InstructionalScreen = ({ route, navigation }) => {
    const {t, i18n} = useTranslation();
    const wifiListVal = [{ "url": 'VKecdhNOolM', lab: 'Placement of the Fall Detector 1' }, { "url": 'm2y9Bnrl42s', lab: 'Connecting to BlueTooth' }, { "url": '5dHYY7kUzds', lab: 'DeFall the Measuring the Left Side of the Detector' }, { "url": '1q_QBSUwhKw', lab: 'DeFall Width and Length of the Room' }]
    const { page } = route.params;
    const onStateChange = React.useCallback((state) => {
        if (state === "ended") {
            Alert.alert("video has finished playing!");
        }
    }, []);

    return (
        <View style={[screenSty.contant, screenSty.backgroundColor]}>
            <AppHeader navigation={navigation} backPop={()=>navigation.navigate(page)} title={'Instructional Videos'} backPage={page} isResident={false}></AppHeader>


            <FlatList data={wifiListVal} renderItem={({ item }) => (
                <View style={styles.listBox}>
                    <YoutubePlayer height={200} videoId={item.url} onChangeState={onStateChange} />
                    <Text style={{ color: '#000', fontSize: RFValue(16,screen_size), paddingVertical: 5 }}>{item.lab}</Text>
                </View>
            )} />
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        marginBottom: 10,
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    listBox: {
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 10, borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
});

export default InstructionalScreen;