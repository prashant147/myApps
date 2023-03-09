import React,{useState} from 'react';
import { View, TextInput, StyleSheet, Text,Platform,TouchableOpacity, Dimensions } from 'react-native';
import { color, pickerSelectStyles } from '../../config/configuration';
import {
  dynamicSize,
  normalizeFont,
  scaleHeight,
  scaleWidth,
  WIDTH, 
} from '../../config/responsive';
import '../../i18n/i18n';
import { Icon } from "@rneui/themed";
import inputSty from '../../style/inputSty';
import RNPickerSelect from "react-native-picker-select";
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';

function SelectFieldUI({
  value,
  onChangeText,
  errorMsg,
  placeholder = '',
  inputTitle,
  borderViews,
  isRequired = false,
  items
}) {
  const {t, i18n} = useTranslation();
  const [iconPo,seticonPo] = useState(35);
  const onLayout=(event)=> {
    const { width} = event.nativeEvent.layout; 

    if(parseInt(width) ==parseInt(Dimensions.get('window').width - 30)){
      seticonPo(0)
    }
  } 
  return (
    <>
      {inputTitle && <Text style={inputSty.TextLab}>
      {t(inputTitle)}
        {
          isRequired && <Text style={{ color: "red" }}>*</Text>
        }
        </Text>
      }

      <View style={[styles.borderView, borderViews,(value != "" && value != null) ? inputSty.TextInput : inputSty.empityTxt]} onLayout={onLayout}>
        {
          items && <RNPickerSelect
          placeholder={placeholder}
          useNativeAndroidPickerStyle={false}
          items={items}
          onValueChange={onChangeText}
          style={pickerSelectStyles}
          value={value} 
          onClose={() => { }}
          Icon={() => {
            return (
              <Icon type="font-awesome"
                name="angle-down"
                style={{
                  marginTop: 7,
                  marginRight: iconPo,
                }}
                size={25}
                color={color.primary}
              />
            );
          }}
        />
        }
        
      </View>

      {!!errorMsg && errorMsg !== '' && (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      )}
    </>
  );
}

export default React.memo(SelectFieldUI);

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
    color: color.RGB_46_46_46,
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