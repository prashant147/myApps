import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color, screen_size } from "../config/configuration";

export default StyleSheet.create({ 
    TextLab:{
        fontSize: RFValue(16,screen_size),
        fontFamily: "OpenSans-SemiBold",
        color: color.font1,
        paddingLeft:15,
        paddingBottom:3
    },
    passTxt:{
      flex:1,
      fontSize:16,
      fontFamily: "OpenSans-Regular",
      height: 40,
      color: color.font1,
      paddingLeft: 20,
    },
    PassInput: {
      alignItems: 'center',
      borderWidth: 1, 
      borderColor: color.primary,
      borderRadius: 40,
      height: 40,
      marginBottom: 10,
      backgroundColor: color.font
  },
    TextInput: {
        borderWidth: 1, 
        borderColor: color.primary,
        borderRadius:40
    },
    empityPass: {
      alignItems: 'center',
      borderColor: color.font,
      borderWidth: 1,
      borderRadius: 40,
      height: 40,
      marginBottom: 10,
      backgroundColor: color.font,
      shadowColor: color.font1,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      
      elevation: 10,
    },
    empityTxt: {
 
        shadowColor: color.font1,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 10,
      },
})