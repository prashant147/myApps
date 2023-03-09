
import { Alert, Platform, ToastAndroid } from 'react-native';

function isEmpty(str,mess){
    if(!str && (str==null || str.trim().length == 0)){
        alertMes(mess)
        return true
    }
    return false
}  
function isNumber(val,mess){
    if(val==null || Number(val)==null){
        alertMes(mess)
        return true
    }
    return false
}
function isEmail(val,mess){
    var emailReg = /^[a-zA-Z0-9]+([._-]{1,1}[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.]{1,1}[a-zA-Z]{2,})$/;
    if(val==null || !emailReg.test(val)){
        alertMes(mess)
        return true
    }
    return false
}
function isStrongPass(val,mess){
    let strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
      );
    if(val==null || !strongPassword.test(val)){
        alertMes(mess)
        return true
    }
    return false
}
function alertMes(str=null){
    if(str!=null){
        if(Platform.OS=="android"){
            ToastAndroid.show(str,ToastAndroid.LONG)
        }else{
            Alert.alert(str)
        }
    }
}
function isNumberVal(str=null,mess){
    if(str == null || str == 0){
        alertMes(mess)
        return true
    }
    return false
}
function confirmMeg(mess, funOkObj = null, funCancelObj = null) {
    Alert.alert('', mess, [
      {
        text: "Cancel",
        onPress: funCancelObj,
        style: "cancel"
      },
      { text: "OK", onPress: funOkObj }
    ]);
}
export const Unit = {
    isEmpty,
    isNumber,
    isEmail,
    isStrongPass,
    alertMes,
    isNumberVal,
    confirmMeg
 };