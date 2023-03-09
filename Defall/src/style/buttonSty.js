import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color, screen_size } from "../config/configuration";

export default StyleSheet.create({ 
    buttonBackName: {
        alignItems: 'center',
        width: '60%',
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        
      },
      backBut: {
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        marginLeft: -20,
        backgroundColor: color.lightPeriwinkle
      },
      nextBut: {
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        justifyContent:'center',
        backgroundColor: color.primary,
      },
    buttonBox:{
        alignItems: 'center',
        backgroundColor: color.primary,
        width: '80%',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        height: 50
    },
    buttonBoxTxt:{
        color:color.font,
        fontSize: RFValue(17,screen_size),
        fontFamily: "OpenSans-SemiBold",
        textAlign: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },

    cameraBut:{
      alignItems: 'center',
      borderColor: color.primary,
      borderWidth:1,
      width: '80%',
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      height: 50
    },
    cameraButTxt:{
      fontSize: RFValue(16,screen_size),
      fontFamily: "OpenSans-SemiBold",
      textAlign: 'center',
      justifyContent: 'center'
    },
    buttonNormalBox:{
      borderRadius:75,
      paddingHorizontal:50,
      paddingVertical:10
    }
});