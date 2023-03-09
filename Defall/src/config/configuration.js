//import env from "react-native-config";

import { Dimensions, StyleSheet } from "react-native";



// dev credentials
/*
 export const BASE_URL = "https://wellawarecaredev.bridgera.com/node";
 export const CLOUD_REGION = "us-central1";
 export const MQTT_URL = "mqtt://3.229.195.60";
 export const MQTT_PORT = 1883;
 export const MQTT_USER_NAME = "home_server";
 export const MQTT_PASSWORD = "password";

 */
 export const screen_size = 736;  
// qa credentials 
 

export const BASE_URL = "https://wellawarecareqa.bridgera.com/node";
export const CLOUD_REGION = "us-central1";
export const MQTT_URL = "mqtt://34.200.150.253";
export const MQTT_PORT = 1883;
export const MQTT_USER_NAME = "mqtt";
export const MQTT_PASSWORD = "Mqtt@123!";


// Prod credentials
/*
export const BASE_URL = "https://cas.wac.solutions/node";
export const CLOUD_REGION = "us-central1";
export const MQTT_URL = "mqtt://54.242.19.110"; 
export const MQTT_PORT = 1883;
export const MQTT_USER_NAME = "mqtt";
export const MQTT_PASSWORD = "Mqtt@123!";
*/

export const APP_VERSION = "2.1.26";
export const CONFIG_EMAIL = "";//"supportwac@yopmail.com";

export const color = {
  primary: "#5d53b8",
  secondary: "#8077d3",
  font: "#FFFFFF",
  black: "#000",
  font1: "#161616",
  font3: "#a9a9a9",
  font4: "#4E4E4E",
  paleLavender: "#f1ecfe",
  color1: "#cbc5ff",
  color2: "#655ad4",
  color3: "#ff0000",
  lightPeriwinkle: "#bfb8fa",
  bg: "#f4f2fe"
}; 
export const selectStyles = StyleSheet.create({ 
  selectBox:{
    width:"100%",
    color:"#000"
  }
});
export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    width:(Dimensions.get('screen').width - 80),
    color: color.font1,
    paddingTop: 0,
    height: 40, 
    marginTop: 0,
    borderBottomWidth: 0,
  },
  inputAndroid: {
    color: color.font1,
    width:(Dimensions.get('screen').width - 80),
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    paddingTop: 0,
    height: 40,
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginTop: 0,
    borderBottomWidth: 0,
  },
});
export const pickerSelectStyles1 = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    color: color.font1,
    paddingTop: 0,
    height: 40, 
    marginTop: 0,
    borderBottomWidth: 0,
  },
  inputAndroid: {
    color: color.font1,
    width:(Dimensions.get('screen').width - (Dimensions.get('screen').width/4)),
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    paddingTop: 0,
    height: 40,
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginTop: 0,
    borderBottomWidth: 0,
  },
});
