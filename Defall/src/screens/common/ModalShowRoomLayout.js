import React, {useState, useEffect,useContext} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {  Overlay } from "@rneui/themed";
import { useIsFocused } from '@react-navigation/native';
import { getRoomDetails } from '../../redux/Actions/auth';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18n';
import StateContext from '../../context/stateContext';

const ModalShowRoomLayout = props => {
  const {t, i18n} = useTranslation();
  const isFocused = useIsFocused();
  const { auth,selDevice } = useContext(StateContext)
  const [roomDetails,setroomDetails] = useState(null)

  const loadRoom = async () => { 
    try {
      let room = await getRoomDetails(selDevice.subroom_id, auth?.token)
      setroomDetails(room);
    } catch (err) {

    }
  };

  useEffect(() => {
    loadRoom();
  }, [isFocused]);


  return (
    <Overlay isVisible={props.isModalVisible} backdropOpacity={0.6}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{t('Room Floor Plan')}</Text>
          </View>
          <TouchableOpacity
            style={styles.rightPane}
            onPress={() => {
              props.setModalVisible();
            }}>
            <ImageBackground
              source={require('../../assets/images/cross.png')}
              style={styles.imageStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={{marginHorizontal: 20}}>
            <View style={styles.horizontalLine} />
          </View>
          <View style={{alignItems: 'center'}}>
            <ImageBackground
              source={require('../../assets/images/design.png')}
              style={styles.background}
              resizeMode="cover">
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  position: 'absolute',
                  zIndex: 20,
                  //backgroundColor: 'red',
                }}>
                {roomDetails &&
                roomDetails.data.hasOwnProperty('furniture_details')
                  ? _popup(props, roomDetails.data)
                  : null}
              </View>
            </ImageBackground>
          </View>
        </View>
      </View>
    </Overlay>
  );
};

const _popup = (props, room) => {
  let widthScale =
    (Dimensions.get('window').width * 0.85) / room.room_dimension.width;
  let lengthScale =
    (Dimensions.get('window').width * 0.7) / room.room_dimension.length;

  return (
    <View>
      {room.furniture_details.map((furniture, i) => {

        let keyValue = i + 1;
        let height = furniture.length * lengthScale;
        let width = furniture.width * widthScale;

        let marginRight = furniture.fromRight * widthScale;
        let marginTop = furniture.fromDevice * lengthScale;

        let marginLeft = (furniture.fromLeft * widthScale) + (Dimensions.get('window').width * 0.05);
        let orientation = 0;
        let totalLength = furniture.width + furniture.fromRight + furniture.fromLeft;
        if (
        //  Math.abs(totalLength - room.room_dimension.width) < 0.5 * room.room_dimension.width
        totalLength > room.room_dimension.width - 12
        ) {
          orientation = '0deg';
        } else {
          orientation = '270deg';
        }

        let image = require('../../assets/images/icon-rtgl.png');
        if (furniture.type == 'Bed') {
          image = require('../../assets/images/icon-bed.png');
        } else if (furniture.type == 'Chair') {
          image = require('../../assets/images/icon-chair.png');
        } else if (furniture.type == 'Sofa') {
          image = require('../../assets/images/icon-sofa.png');
        }

        return (
          <View
            key={keyValue}
            style={{
              transform: [{ rotate: orientation}],
              height: height,
              width: width,
              marginLeft: marginLeft,
              marginRight: marginRight,
              marginTop: marginTop,
              position: 'absolute',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            //  borderWidth: 1,
            //  borderColor: _generateRandomColor(),
              borderStyle: 'dotted',
              backgroundColor: _generateRandomColor(),
            }}>
              <Image source={image} style={{ flex: 1,width: width,height: height,resizeMode: 'contain'}} resizeMode={'contain'}></Image>
            <Text style={styles.TextStyle}>{furniture.type}</Text>
            <Text style={styles.TextStyle}>
              {furniture.length}
              {'x'}
              {furniture.width}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const _generateRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#AE';
  for (var i = 0; i < 4; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const styles = StyleSheet.create({

  iconStyle: {
    height: 100,
    width: 80,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  background: {
    height: Dimensions.get('window').width * 0.7,
    width: Dimensions.get('window').width * 0.85,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  headerContainer: {
    padding: '2.5%',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: RFValue(13),
    flexWrap: 'nowrap',
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'left',
  },
  horizontalLine: {
    borderColor: '#98abae',
    borderWidth: 0.5,
    marginVertical: 10,
  },
  imageStyle: {
    width: 22,
    height: 18,
  },
  rightPane: {
    flex: 0.4,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 14,
  },
  TextStyle: {
    color: '#000000',
    textAlign: 'center',
    fontSize: RFValue(11),
    fontFamily: 'OpenSans-Semibold',
    fontWeight: '400',
  },

  header: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 20,
  },

  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#565656',
    fontSize: 12,
  },
  body: {
    width: '100%',
    marginBottom: 20,
  },

  textInput: {
    flex: 0.5,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    bottom: 6,
  },

  inputTextview: {
    color: '#019aa5',
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-Semibold',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginBottom: 20,
  },

  goalInput: {
    width: '100%',
    fontFamily: 'OpenSans-Semibold',
    padding: 0,
    textAlign: 'left',
    fontSize: RFValue(14),
    fontWeight: '800',
    color: '#333333',
    borderBottomColor: '#98abae',
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  addButton: {
    fontFamily: 'OpenSans-Semibold',
    fontWeight: 'bold',
    fontSize: RFValue(14),
    textDecorationLine: 'underline',
    color: '#019aa5',
    marginBottom: 20,
    marginTop: 10,
  },
  flatList: {
    height: 150,
  },
  itemContainer: {
    marginTop: 5,
    flexDirection: 'row',
  },
  phones: {
    fontSize: RFValue(12),
    color: '#565656',
    fontFamily: 'OpenSans-Semibold',
    fontWeight: '800',
  },
  contactName: {
    fontSize: RFValue(12),
    color: '#333333',
    fontFamily: 'OpenSans-Semibold',
    fontWeight: 'bold',
  },
});

export default ModalShowRoomLayout;
