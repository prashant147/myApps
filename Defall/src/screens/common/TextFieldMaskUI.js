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
import { TextInputMask } from 'react-native-masked-text';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';

function TextFieldMaskUI({
  value,
  onChangeText,
  errorMsg,
  isSecure=false,
  isRequired = false,
  placeholder = '',
  options='',
  type= "custom",
  inputTitle,
  borderViews,
  multiline,
  numberOfLines,
  TextInputStyle = {},
  returnKeyType,
  keyboardType,
  inputTitleIcon,
  focus
}) {
  const {t, i18n} = useTranslation(); 
  const [isVisiable, setIsVisiable] = useState(isSecure)
  return (
    <>
      {inputTitle && <Text style={inputSty.TextLab}>{t(inputTitle)}
      {
          isRequired && <Text style={{ color: "red" }}>*</Text>
        }</Text> }

      <View style={[styles.borderView, borderViews,(value != "" && value != null) ? inputSty.TextInput : inputSty.empityTxt]}>
        <TextInputMask
          value={value}
          onChangeText={onChangeText}
          underlineColorAndroid={color.TRANSPARENT}
          style={[styles.TextInput, TextInputStyle]}
          secureTextEntry={isVisiable}
          placeholder={placeholder}
          options = {options}
          type = {type}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
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
      </View>

      {!!errorMsg && errorMsg !== '' && (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      )}
    </>
  );
}

export default React.memo(TextFieldMaskUI);

const styles = StyleSheet.create({
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
    width:'90%'
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