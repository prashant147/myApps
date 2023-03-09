import * as React from "react";
import { useState,useContext } from "react";
import {
  TouchableOpacity,  StyleSheet, Text, View, Image, ScrollView, Platform, PermissionsAndroid, Dimensions, 
} from "react-native"; 
import screenSty from "../../../style/screenSty";
import { SafeAreaView } from "react-native-safe-area-context";
import buttonSty from "../../../style/buttonSty";
import { Overlay } from "@rneui/themed";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Loader from "../../common/Loader";
import AppHeader from "../../common/AppHeader";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { color } from "../../../config/configuration"; 
import { Unit } from "../../Unit";
import { aws_signed_url, getDeleteRoomImage, getRoomImage, getSaveRoomImage, uploadFile } from "../../../redux/Actions/auth";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n';
import StateContext from "../../../context/stateContext";

const AddSubRegionsPhotoUpScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  const { auth, selDevice } = useContext(StateContext)
  const [selectOpt, setSelectOpt] = useState(0);
  const [selectImg, setSelectImg] = useState(null);
  const [selectImgType, setSelectImgType] = useState(null);
  const [isLodering, setIsLodering] = useState(false);

  const [selectEast, setSelectEast] = useState(null);
  const [selectWest, setSelectWest] = useState(null);
  const [selectNorth, setSelectNorth] = useState(null);
  const [selectSouth, setSelectSouth] = useState(null);

  const [selectEastId, setSelectEastId] = useState(null);
  const [selectWestId, setSelectWestId] = useState(null);
  const [selectNorthId, setSelectNorthId] = useState(null);
  const [selectSouthId, setSelectSouthId] = useState(null);


  const isFocused = useIsFocused();
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "DeFall Camera Permission",
          message:
          "DeFall needs access to your camera to scan QR code and help to get information to Sensor Detection Area using the app.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      } else {

      }
    } catch (err) {
      console.warn(err);
    }
  };
  React.useEffect(() => {
    if(Platform.OS=="android"){
      requestCameraPermission();
    }
   
    setSelectImg(null)
    getLoadImage();
    return () => { }
  }, [isFocused]);

  const photoSelect = (no)=>{
      if(no==0){
        let options = {
          selectionLimit: 1,
          mediaType: "photo",
          includeBase64: false,
          quality: 1,
        };
        launchImageLibrary(options, (res) => {

          if (res.didCancel) {  setSelectImg(null);setSelectOpt(0);
          } else if (res.error) {  setSelectImg(null);setSelectOpt(0);
          } else {

            if(res.assets){
              setSelectImg(res.assets[0].uri);
              setSelectImgType(res.assets[0].type);
            }

          }
        });
      }else{

        let options = {
          selectionLimit: 1,
          mediaType: "photo",
          includeBase64: false,
          quality: 1,
        };
        launchCamera(options, (res) => {
          if (res.didCancel) { setSelectImg(null);       setSelectOpt(0);
          } else if (res.error) {  setSelectImg(null);       setSelectOpt(0);
          } else {

              if(res.assets){

                setSelectImg(res.assets[0].uri);
                setSelectImgType(res.assets[0].type);
              }
           
          }
        });
      }
  }
  const getLoadImage = async() => {
    setIsLodering(true);

    let imgdata = await getRoomImage(selDevice.apartment_id, auth?.token,selDevice.subroom_id)
    setIsLodering(false);
    setSelectEast(null);
    setSelectEastId(null)
    setSelectWest(null);
    setSelectWestId(null)
    setSelectNorth(null);
    setSelectNorthId(null)
    setSelectSouth(null);
    setSelectSouthId(null)
    if (imgdata.data.length > 0) {
      imgdata.data.forEach( async element => {
        let aws = await aws_signed_url(element.file_name)
          if (element.image_direction == "East") {
            setSelectEast(aws.data);
            setSelectEastId(element.id)
          }
          else if (element.image_direction == "West") {
            setSelectWest(aws.data)
            setSelectWestId(element.id)
          }
          else if (element.image_direction == "North") {
            setSelectNorth(aws.data)
            setSelectNorthId(element.id)
          }
          else if (element.image_direction == "South") {
            setSelectSouth(aws.data)
            setSelectSouthId(element.id)
          }        
      });

    }
  }
  const uploadImage = () => {
    let time =  new Date(new Date().toUTCString()).getTime() ;
    let filename = auth?.user_details.id + "_" + time + ".jpg"; 
    setIsLodering(true);
    uploadFile(selectImg,selectImgType, filename, auth?.token)
      .then((res) => {

        if (res.status) {
          let timeV = res.data.file_url.substring(res.data.file_url.indexOf(".com/")+5, res.data.file_url.indexOf("?AWSAccessKeyId"));
          saveImage(res.data.file_url,timeV,filename);
        } else {
          Unit.alertMes("oops! Please Try again");
          setIsLodering(false);
        }
      })
      .catch(() => {
        Unit.alertMes("oops! Please Try again");
        setIsLodering(false);
      });
  };
  const saveImage = (file_url,time,filename) => {
    let name = '';
    if (selectOpt == 1) {
      name = "East";
    } else if (selectOpt == 2) {
      name = "West";
    } else if (selectOpt == 3) {
      name = "North";
    } else if (selectOpt == 4) {
      name = "South";
    }

    getSaveRoomImage(selDevice.apartment_id, name, filename, auth?.token,time,selDevice.subroom_id).then(res =>{

      setIsLodering(false);
      if (res.status) {
        if (selectOpt == 1) {
          setSelectEast(file_url);
          setSelectEastId(res.data.id)
        } else if (selectOpt == 2) {
          setSelectWest(file_url);
          setSelectWestId(res.data.id)
        } else if (selectOpt == 3) {
          setSelectNorth(file_url);
          setSelectNorthId(res.data.id);
        } else if (selectOpt == 4) {
          setSelectSouth(file_url);
          setSelectSouthId(res.data.id);
        }
        setSelectOpt(0);
        setSelectImg(null);
        getLoadImage();
      }
    })

  }
  const deleteDevice = async (imageId) => {
    setIsLodering(true);
    await getDeleteRoomImage(imageId, auth?.token)
    setSelectImg(null)
    setIsLodering(false);
    getLoadImage();
  }
  return (
    <View style={[screenSty.contant, screenSty.backgroundColor]}>
      <AppHeader navigation={navigation} backPop={()=>navigation.navigate("vayyarDevice")} title={'Upload Sensor Detection Area'} backPage={'vayyarDevice'} isResident={true}></AppHeader>
      <View style={screenSty.contant}>

        <ScrollView>

          <View style={styles.boxMargin}>
            <View style={styles.marginTop}>
              <View style={styles.borderBox}>
                <TouchableOpacity onPress={() => setSelectOpt(1)}>
                  {
                    selectEast == null && <Text style={[screenSty.centerText, screenSty.font16, styles.txtClor]} >
                      {t("Tap to add a photo from the east side of the sensor detection area")}
                    </Text>
                  }
                  {
                    selectEast != null && <View>
                      <TouchableOpacity style={{ position: 'absolute', right: -20 }} onPress={() => deleteDevice(selectEastId)}  >
                        <Icon name="trash" type='font-awesome' size={20} style={{ paddingHorizontal: 5 }} color="rgb(219,0,0)" />
                      </TouchableOpacity>
                      <Image source={{ uri: selectEast }} style={{ height: '100%' }} resizeMode={'contain'} ></Image>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.marginTop}>
              <View style={styles.borderBox}>
                <TouchableOpacity onPress={() => setSelectOpt(2)}>
                  {
                    selectWest == null && <Text style={[screenSty.centerText, screenSty.font16, styles.txtClor]} >
                      {t("Tap to add a photo from the west side of the sensor detection area")}
                    </Text>
                  }
                  {
                    selectWest != null && <View>
                      <TouchableOpacity style={{ position: 'absolute', right: -20 }} onPress={() => deleteDevice(selectWestId)}  >
                        <Icon name="trash" type='font-awesome' size={20} style={{ paddingHorizontal: 5 }} color="rgb(219,0,0)" />
                      </TouchableOpacity>
                      <Image source={{ uri: selectWest }} style={{ height: '100%' }} resizeMode={'contain'} ></Image>
                    </View>
                  }

                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.marginTop}>
              <View style={styles.borderBox}>
                <TouchableOpacity onPress={() => setSelectOpt(3)}>
                  {
                    selectNorth == null && <Text style={[screenSty.centerText, screenSty.font16, styles.txtClor]} >
                      {t("Tap to add a photo from the north side of the sensor detection area")}
                    </Text>
                  }
                  {
                    selectNorth != null && <View>
                      <TouchableOpacity style={{ position: 'absolute', right: -20 }} onPress={() => deleteDevice(selectNorthId)}  >
                        <Icon name="trash" type='font-awesome' size={20} style={{ paddingHorizontal: 5 }} color="rgb(219,0,0)" />
                      </TouchableOpacity>
                      <Image source={{ uri: selectNorth }} style={{ height: '100%' }} resizeMode={'contain'} ></Image>
                    </View>
                  }

                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.marginTop}>
              <View style={styles.borderBox}>
                <TouchableOpacity onPress={() => setSelectOpt(4)}>
                  {
                    selectSouth == null && <Text style={[screenSty.centerText, screenSty.font16, styles.txtClor]} >
                      {t("Tap to add a photo from the south side of the sensor detection area")}
                    </Text>
                  }
                  {
                    selectSouth != null && <View>
                      <TouchableOpacity style={{ position: 'absolute', right: -20 }} onPress={() => deleteDevice(selectSouthId)}  >
                        <Icon name="trash" type='font-awesome' size={20} style={{ paddingHorizontal: 5 }} color="rgb(219,0,0)" />
                      </TouchableOpacity>
                      <Image source={{ uri: selectSouth }} style={{ height: '100%' }} resizeMode={'contain'} ></Image>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <Overlay  modalProps={{}}   isVisible={selectOpt!=0} onBackdropPress={()=>setSelectOpt(0)}>
          {
            selectImg ==null && <View>
               <Text style={[screenSty.headerDesc, screenSty.margin30Bottom,screenSty.padding20H,{ width:Dimensions.get('screen').width - 100}]}>Upload Sensor Detection Area Photo</Text>
              <TouchableOpacity  onPress={() => setSelectOpt(0)} style={{position:'absolute',right:0,top:0}}>
                <Icon name="close" type='fontisto' size={20} color={color.primary} />
              </TouchableOpacity>

              <View style={screenSty.centerContent} >
                <TouchableOpacity style={[screenSty.centerContent,buttonSty.buttonBox, screenSty.row]} onPress={() => photoSelect(0)} >
                  <Icon name="photo-library" type='material' size={20} color={color.font} />
                  <Text style={[buttonSty.cameraButTxt,screenSty.colorW]}> {t("Choose from Gallery")} </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[buttonSty.cameraBut,screenSty.margin20Top,screenSty.centerContent, screenSty.row]} onPress={() => photoSelect(1)} >
                  <Icon name="camera" type='feather' size={20} color={color.primary}  />
                  <Text style={[buttonSty.cameraButTxt,screenSty.colorPrimary]}> {t("Take Photo")} </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
         {
           selectImg !=null && <View>
              <Loader loading={isLodering} />
              <View style={{ marginBottom: 20 }}>
                <Image
                  source={{
                    uri: selectImg != null ? selectImg:null
                  }}
                  style={{ height: 250 }}
                ></Image>
              </View>
              <View style={[screenSty.row]}>
                <TouchableOpacity
                  style={[
                    buttonSty.buttonNormalBox,
                    { backgroundColor: color.paleLavender, marginRight: 50 },
                  ]}
                  onPress={() => {
                    setSelectOpt(0);
                    setSelectImg(null);
                  }}
                >
                  <Text style={[buttonSty.buttonBoxTxt, screenSty.colorPrimary]}>
                  {t("DISCARD")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    buttonSty.buttonNormalBox,
                    { backgroundColor: color.primary },
                  ]}
                  onPress={() => {
                    uploadImage();
                  }}
                >
                  <Text style={buttonSty.buttonBoxTxt}>{t("SAVE")}</Text>
                </TouchableOpacity>
              </View>
              </View>
         }
        </Overlay>
      </View>
      <Loader loading={isLodering} />
    </View>
  );
};
const styles = StyleSheet.create({
  boxMargin: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  marginTop: {
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
  },
  borderBox: {
    borderWidth: 1,
    height: 150,
    paddingHorizontal: 15,
    borderStyle: "dashed",
    borderColor: "rgb(130,123,195)",
    justifyContent: "center",
  },
  txtClor: {
    color: "rgb(130,123,195)",
  },
});

export default AddSubRegionsPhotoUpScreen;
