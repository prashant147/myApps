import * as React from "react";
import { useState,useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Image,
  Alert
} from "react-native";
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
import buttonSty from "../../../style/buttonSty";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { deleteSub_region, selectDevice, sub_region_list } from "../../../redux/Actions/auth";

import VeviceInfo from "../../common/deviceInfo";
import ModalShowRoomLayout from "../../common/ModalShowRoomLayout";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import StateContext from "../../../context/stateContext";

const SubRegionsScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();
  const { auth, resident,selDevice } = useContext(StateContext)
  const [isLodering, setIsLodering] = useState(false);
  const [subRegionList, setSubRegionList] = useState(null);
  const { user_room_measurements_id } = route.params;

  const [modalShowRoomLayout, setModalShowRoomLayout] = useState(false);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    getSubRegion();
    return () => { }
  }, [isFocused]);
  const getSubRegion =  async() => {

    let SubRegion = await sub_region_list(selDevice.subroom_id, auth?.token);
    setSubRegionList(SubRegion.data.rows);
    if (SubRegion.data.rows) {
      selDevice.sub_region_configured = true;
    } else {
      selDevice.sub_region_configured = false;
    }
  }
  const deleteSubResion =  (items) => {
    Alert.alert("", "Are you sure you want to delete the sub region? (Y/N)", [
      {
          text: "Yes", onPress: async () => {
          setIsLodering(true)
          let SubRegion = await deleteSub_region(selDevice.deviceId, items.sub_region_name, items.user_room_sub_region_id, auth?.token);

          setIsLodering(false)
          if (SubRegion.status) {
            getSubRegion();
          }
        }
        },{ text: "No", style: "cancel", },
      ], { cancelable: true });
  }
  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} backPop={()=>navigation.navigate("vayyarDevice")} title={'Sub Regions'} backPage={'vayyarDevice'} isResident={true}></AppHeader>
      <View style={[screenSty.contant,screenSty.padding15H]}>
        <VeviceInfo></VeviceInfo>
        
          <ModalShowRoomLayout
            isModalVisible={modalShowRoomLayout}
            setModalVisible={() => {
              setModalShowRoomLayout(!modalShowRoomLayout);
            }}
          />
        
        <View style={[screenSty.box, screenSty.margin30Bottom]}>
          <View style={[screenSty.HeaderBoxVal,screenSty.row]}>
            <Text style={[screenSty.font16,screenSty.contant]}>{t("Sub Regions")}</Text>
            {
              subRegionList && <TouchableOpacity onPress={()=>setModalShowRoomLayout(!modalShowRoomLayout)}>
                  <Image source={require("../../../assets/photoUp.png")} style={{height:25,width:40,padding:10,marginRight:10}}  resizeMode={'contain'} />
              </TouchableOpacity> 
            }
            
          </View>

          {!subRegionList && (
            <ScrollView  style={[{ height: 250 }, screenSty.padding20H]} >
              <Text style={[screenSty.font15, screenSty.colorBold, screenSty.margin10Top]}>
                {t("Why configure for sub-region?")}{" "}
              </Text>
              <Text style={[screenSty.font12, screenSty.margin10TopBottom]}>
              {t("The Device fall detector needs to be informed of any areas where a resident could be in a position that it could possibly misinterpret it as a fall.  Examples of this would be laying in bed or sitting or laying on a sofa.  By identifying any such areas you eliminate the false alarm notifications. You will need to add a subregion for every area in thebeing monitored that falls into this category.")}{" "}
              </Text>
              
            </ScrollView>
          )}
          {subRegionList && (
            <FlatList
              style={{ height: 200, borderBottomWidth: 0.5, borderColor: 'rgb(90,81,174)' }}
              data={subRegionList}
              renderItem={({ item }) => (
                <View
                  style={[
                    screenSty.row,
                    {
                      paddingVertical: 15,
                      marginHorizontal: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "rgb(191,184,250)",
                    },
                  ]}
                >
                  <TouchableOpacity style={{ flex: 1 }} onPress={() =>
                    navigation.navigate("addSubRegions", {
                      user_room_measurements_id: user_room_measurements_id,
                      room_sub: item,
                    })
                  }>
                    <Text style={[screenSty.font14]}>
                      {item.sub_region_name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteSubResion(item)}>
                    <Icon type="font-awesome" name="trash" size={20} color="rgb(90,81,174)" />
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          )}

          <View style={[screenSty.centerItem, screenSty.margin20TopBottom]}>
            <TouchableOpacity
              style={buttonSty.buttonBox}
              onPress={() =>
                navigation.navigate("addSubRegions", {
                  user_room_measurements_id: user_room_measurements_id,
                  room_sub: null,
                })
              }
            >
              <Text style={buttonSty.buttonBoxTxt}>{t("Add Sub Regions")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Loader loading={isLodering} />
    </View>
  );
};

export default SubRegionsScreen;
