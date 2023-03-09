import React,{useState} from 'react';
import { View, TextInput, StyleSheet, Text,Platform,TouchableOpacity } from 'react-native';
import { color } from '../../config/configuration';
import {
  dynamicSize,
  normalizeFont,
  scaleHeight,
  scaleWidth,
  WIDTH, 
} from '../../config/responsive';
import '../../i18n/i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import inputSty from '../../style/inputSty';
import { useTranslation } from 'react-i18next';
import screenSty from '../../style/screenSty';


function TextFieldUI({
  value,
  onChangeText,
  errorMsg,
  isSecure=false,
  placeholder = '',
  inputTitle,
  borderViews,
  isRequired = false,
  isSearch = false,
  multiline = false,
  editable=true,
  numberOfLines,
  TextInputStyle = {},
  returnKeyType,
  keyboardType,
  inputTitleIcon,
  autoCapitalize ="none",
  focus,
  rightTxt
}) {
  const {t, i18n} = useTranslation();
  const [isVisiable, setIsVisiable] = useState(isSecure)
  return (
    <>
      {inputTitle && <Text style={inputSty.TextLab}>
        {t(inputTitle)}
        {
          isRequired && <Text style={{ color: "red" }}>*</Text>
        }
        </Text>
      }

      <View style={[styles.borderView, borderViews, (value != "" && value != null) ? inputSty.TextInput : inputSty.empityTxt]}>
        <TextInput
          autoCapitalize = {autoCapitalize}
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          underlineColorAndroid={color.TRANSPARENT}
          style={[styles.TextInput, TextInputStyle]}
          secureTextEntry={isVisiable}
          placeholder={t(placeholder)}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          autoCorrect={false}
          keyboardType={keyboardType}
          autoFocus={focus}
        />
        {isSecure && (!isVisiable ?
          <TouchableOpacity style={styles.passIcon}  onPress={()=>setIsVisiable(!isVisiable)}>
            <Icon name="eye-outline" size={20} color={'rgb(124 ,124 ,124)'}></Icon>
          </TouchableOpacity>
          : 
          <TouchableOpacity style={styles.passIcon}  onPress={()=>setIsVisiable(!isVisiable)}>
          <Icon  name="eye-off-outline" size={20} color={'rgb(124 ,124 ,124)'}></Icon>
        </TouchableOpacity>)
        }
        {
          rightTxt && <TouchableOpacity style={styles.passIcon}><Text style={[screenSty.colorB]}>{rightTxt}</Text></TouchableOpacity> 
        }
        {isSearch && <TouchableOpacity style={styles.passIcon}  onPress={()=>setIsVisiable(!isVisiable)}>
          <Icon  name="search" size={20} color={'rgb(124 ,124 ,124)'}></Icon>
        </TouchableOpacity>
        }
      </View>

      {!!errorMsg && errorMsg !== '' && (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      )}
    </>
  );
}

export default React.memo(TextFieldUI);

const styles = StyleSheet.create({
  passIcon:{
    marginRight:5
  },
  borderView: {
    alignItems: 'center',
    borderColor: color.font,
    borderWidth: 1,
     borderRadius: 40,
     height: 40,
     marginBottom: 10,
     color: color.font1,
     paddingLeft: 20,
     backgroundColor: color.font,
    flexDirection:'row',
    alignItems:'center',
  },
  TextInput: {
    fontSize: normalizeFont(15),
    // fontFamily: fonts.AVENIR_NEXT_MEDIUM,
    color: "#000",
    textAlignVertical: 'top',
    //width:'90%'
    flex:1
  },
  errorMsg: {
    fontSize: normalizeFont(12),
    // fontFamily: fonts.POPPINS_MEDIUM,
    color: color.ERROR_RED,
    marginLeft: scaleWidth(18),
    marginTop: scaleHeight(2),
  },
  inputTitle: {
    fontSize: normalizeFont(14),
    // fontFamily: fonts.AVENIR_NEXT_MEDIUM,
    color: color.GRAY,
    // marginLeft: scaleWidth(18),
    // marginTop: scaleHeight(2),
    paddingVertical: dynamicSize(5),
    paddingLeft: dynamicSize(5),
  },
  inputLabelWrapper: {
    flexDirection: 'row',
    marginLeft: scaleWidth(18),
    alignItems: 'center',
    // paddingTop: dynamicSize(10),
    marginTop: dynamicSize(10),
    paddingBottom: dynamicSize(5),
    paddingLeft: dynamicSize(5),
  },
});