import * as React from 'react';
import {useState,useContext} from 'react';

import { TouchableOpacity, Text, View, FlatList, StyleSheet } from 'react-native';
import screenSty from '../../../style/screenSty';
import { Icon } from "@rneui/themed";
import { color } from '../../../config/configuration';
import { useIsFocused } from '@react-navigation/native';
import { getUsers } from '../../../redux/Actions/auth';
import Loader from '../../common/Loader';
import { useTranslation } from 'react-i18next';
import '../../../i18n/i18n';
import StateContext from '../../../context/stateContext';

const ContactListScreen = (props) => {
    const {t, i18n} = useTranslation();
    const { auth, selCompany,resident } = useContext(StateContext)
    const [isLodering, setIsLodering] = useState(false);
    const [contacts, setContacts] = useState([]);
    const isFocused = useIsFocused();
    const reloadDevice = async () => {
        setIsLodering(true)
       let contList =  await getUsers(auth?.token, selCompany.id,resident.id)
       setIsLodering(false)
        if(contList){
            setContacts(contList);
        }
        
    }

    React.useEffect(() => {
        reloadDevice();
        return () => { }
    }, [isFocused]);

    return (
        <View style={[screenSty.contant, screenSty.padding15H]}>

            <Text style={[screenSty.font16,  screenSty.centerTxt]}>
                {t("Up to 4 contacts can receive the alarm during a fall event")}.</Text>

            <FlatList style={[screenSty.contant,screenSty.margin20Top]} data={contacts}
                renderItem={({ item, index }) => (
                    <View style={[screenSty.box]}>
                         <TouchableOpacity onPress={() => props.navigation.navigate('updateContactDetails', { "contact": item, "backPage": props.pageName })}
                          style={[screenSty.row,styles.headerbox]}>
                                <Text style={[screenSty.contant,screenSty.padding5H,screenSty.font16]}>Contact {index + 1}</Text>
                                <Icon type="font-awesome" style={[screenSty.margin8Top,screenSty.marginRight10]} name="chevron-right" color={color.primary} size={15}></Icon>
                            </TouchableOpacity>

                        <View style={[screenSty.row, screenSty.margin5Top]}>
                            <Text style={[screenSty.font14, screenSty.contant]}>Name</Text>
                            <Text style={[screenSty.font14, screenSty.contant]}>-</Text>
                            <Text style={[{ flex: 3 }, screenSty.font14]}>{item.name}</Text>
                        </View>
                        <View style={[screenSty.row, screenSty.margin5Top]}>
                            <Text style={[screenSty.font14, screenSty.contant]}>Email</Text>
                            <Text style={[screenSty.font14, screenSty.contant]}>-</Text>
                            <Text style={[{ flex: 3 }, screenSty.font14]}>{item.email}	</Text>
                        </View>
                        <View style={[screenSty.row, screenSty.margin5Top]}>
                            <Text style={[screenSty.font14, screenSty.contant]}>Phone No</Text>
                            <Text style={[screenSty.font14, screenSty.contant]}>-</Text>
                            <Text style={[{ flex: 3 }, screenSty.font14]}>{item.phone}</Text>
                        </View>

                    </View>)} />
            {
                contacts.length < 4 && <TouchableOpacity onPress={()=> props.navigation.navigate("addContactDetails",{ "contactCount": contacts.length, "backPage": props.pageName })} style={[styles.addButt,screenSty.row]}>
                    <Icon type="font-awesome" name="users" color={color.font} size={20}></Icon>
                    <Text style={[screenSty.font18,screenSty.colorW,{paddingTop:5}]}>+</Text>
                </TouchableOpacity>
            }
            <Loader loading={isLodering} />
        </View >
    )
}
const styles = StyleSheet.create({ 
    addButt:{
        position:'absolute',
        justifyContent:'center',
        paddingTop:15,
        paddingLeft:5,
        bottom:5,
        right:10,
        backgroundColor:color.primary,
        borderRadius:50,
        width:50,
        height:50
    } ,
    headerbox:{
        borderBottomWidth:.5,
        borderBottomColor:color.lightPeriwinkle,
        paddingBottom:10,
        marginBottom:10
    },
});
export default ContactListScreen;