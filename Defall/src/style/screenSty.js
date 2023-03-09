import { Dimensions, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color, screen_size } from "../config/configuration";

export default StyleSheet.create({
  installImage:{
    width:RFValue(340,screen_size),
    backgroundColor:color.paleLavender
  },
  headerDesc: {
    fontSize: RFValue(20,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
    textAlign: "center",
    marginHorizontal:30
  },
  bigcontainer: {
    height:
      Platform.OS == "android"
        ? Dimensions.get("window").height - 220
        : Dimensions.get("window").height < 740
        ? Dimensions.get("window").height < 600
          ? "60%"
          : "70%"
        : "79%",

    borderColor: color.primary,
    borderWidth: 1,
  },
  contant:{
    flex: 1,
  },
  backgroundColor:{
    backgroundColor:color.paleLavender
  },
  backgroundWColor:{
    backgroundColor:color.font
  },
  bodyColor:{
    backgroundColor:color.paleLavender
  },
  selDevice:{
    color:color.primary,
    textAlign:'center',
    fontSize: RFValue(15,screen_size),
    fontFamily: "OpenSans-SemiBold",
  },
  empDevice:{
    color:color.lightPeriwinkle,
    textAlign:'center',
    fontSize: RFValue(15,screen_size),
    fontFamily: "OpenSans-SemiBold",
  },
  selLine:{
    borderBottomColor:color.primary,
    borderBottomWidth:3,
    height:40
  },
  empLine:{
    borderBottomColor:color.lightPeriwinkle,
    borderBottomWidth:3,
    height:40
  },
  centerContent:{
    justifyContent:'center',
    alignItems:'center'
  },
  padding15H:{
    paddingHorizontal:15
  },
  padding10H:{
    paddingHorizontal:10
  },
  padding5H:{
    paddingHorizontal:5
  },
  padding8TopBottom:{
    paddingVertical:8
  },
  padding10TopBottom:{
    paddingVertical:10
  },
  padding20Bottom:{
    paddingBottom:20
  },
  margin5TopBottom:{
    marginVertical:5
  },
  margin5Top:{
    marginTop:5
  },
  margin10TopBottom:{
    marginVertical:10
  },
  margin20TopBottom:{
    marginVertical:20
  },
  margin5Top:{
    marginTop:5
  },
  margin8Top:{
    marginTop:8
  },
  margin10Top:{
    marginTop:10
  },
  margin15Top:{
    marginTop:15
  },
  margin20Top:{
    marginTop:20
  },
  margin30Top:{
    marginTop:30
  },
  margin30H:{
    marginHorizontal:30
  },
  margin20H:{
    marginHorizontal:20
  },
  margin15H:{
    marginHorizontal:15
  },
  margin10H:{
    marginHorizontal:10
  },
  marginRight10:{
    marginRight:10
  },
  margin30Bottom:{
    marginBottom:30
  },
  headerTitle:{
    fontSize: RFValue(28,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
    paddingTop: 10,
  },
  headerBorder:{
    borderBottomWidth: 5,
    borderBottomColor: "rgb(113,101,227)",
    paddingBottom: 5,
    width: "40%",
  },
  Desc:{
    fontSize: RFValue(15,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
    textAlign:'center',
    marginBottom:30
  },
  font8:{
    fontSize: RFValue(8,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font10:{
    fontSize: RFValue(10,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font12:{
    fontSize: RFValue(12,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font14:{
    fontSize: RFValue(14,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font15:{
    fontSize: RFValue(15,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font16:{
    fontSize: RFValue(16,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font17:{
    fontSize: RFValue(17,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font18:{
    fontSize: RFValue(18,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font20:{
    fontSize: RFValue(20,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  font30:{
    fontSize: RFValue(40,screen_size),
    fontFamily: "OpenSans-SemiBold",
    color: color.font1,
  },
  row:{
    flexDirection:'row'
  },
  colorB:{
    color:color.font1
  },
  colorW:{
    color:color.font
  },
  colorBold:{
    fontWeight:'bold'
  },
  colorSemiBold:{
    fontWeight:'600'
  },
  colorPrimary:{
    color:color.primary
  },
  centerItem:{
    alignItems:'center'
  },
  box:{
    backgroundColor:color.font,
    marginBottom:10,
    paddingHorizontal:8,
    paddingVertical:10,
    borderRadius:20
  },
  centerTxt:{
    textAlign:'center'
  },
  NotConfiguredBox: {
    backgroundColor: "rgb(219,0,0)",
    borderColor: "rgb(219,0,0)",
    marginLeft: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  sumConfiguredBox: {
    backgroundColor: "#ee6723",
    borderColor: "#ee6723",
    marginLeft: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  ConfiguredBox: {
    backgroundColor: "rgb(0,164,15)",
    borderColor: "rgb(0,164 ,15)",
    marginLeft: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  HeaderBoxVal:{
    borderBottomColor:color.primary,
    borderBottomWidth:1,
    paddingBottom:5
  }
})