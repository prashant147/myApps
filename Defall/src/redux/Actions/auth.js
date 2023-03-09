import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import { BASE_URL, CONFIG_EMAIL } from "../../config/configuration";
import { Unit } from "../../screens/Unit";
import {  RESET_CONTACTS,  ADD_RESIDENTS_LIST, COMPANY_ID, ACCOUNT_INFO, ADD_SELECT, DEVICE_IN, LOGGING_IN, LOGOUT,  RESIDENT_INFO, CLEAR_RESIDENT,  WIFI_INFO, ADD_ROOM,  RESET_SELECT, RESET_RESIDENTS,  ADD_FETCHED_DATA, ROOMTYPE, ADD_COMPANY, SELECT_COMPANY, CLEAR_OTHER_RESIDENT, RESIDENT_ID, RESET_COMPANY, DEVICE_TYPE, ADD_SUBCOMPANY, SELECT_SUBCOMPANY } from "./index";


export const userForgetPass = async (email) =>  {
    try{
      const res = await axios.post(`${BASE_URL}/login/forgot_password`,{"email": email});
      return res.data
    }
    catch(e){

    }
} 
export const userLoginMobile = async (email,password) =>  {
    try{
      const res = await axios.post(`${BASE_URL}/login/`,{  "password": password,"email": email,"type" : "app-login"});

      if(res.data.status && res.data.response_code==1){
        return res.data;
      }else{
          Unit.alertMes(res.data.message)
        return null;
      }
    }catch(e){
        Unit.alertMes(e.toString())
        return null
    }
}
export const UpdateUsePassword = async (newPassword, password, userId, token) =>  {
  try{
    const res = await axios.put(`${BASE_URL}/login/reset_password/${userId}`,{
      "old_password": password,
      "new_password": newPassword
    },{
      headers:{
      'Content-Type': 'application/json',
      'x-access-token': token
    }});
    return(res.data)
  }catch(e){

  }
}
export const getCompanyDetails = async (token,company_id) =>  {
    try{
      const res = await axios.get(`${BASE_URL}/company/${company_id}`,{
        headers: { 'x-access-token': token }
      });
      if(res.data.status){
        return res.data;
      }else{
         return null;
      }
    }catch(e){
        return null;
      }
}
export const setCompanySettings = async (token,company_id) => {
  try{
    const res = await axios.post(`${BASE_URL}/vayyar-devices/company_settings`,{
      "measurementUnits": 1,
      "presenceAlertsEnabledFrom": "00:00",
      "presenceAlertsEnabledTo": "23:59",
      "company_id": company_id,
      "timeZone": "America/New_York",
      "timeZoneOffset": -240
    },{
      headers: { 'x-access-token': token }
    });
    if(res.data.status){
      return res.data;
    }else{
       return null;
    }
  }catch(e){
      return null;
    }
}
export const getResidents = async (token,company_id) =>  {
    try{
      const res = await axios.get(`${BASE_URL}/patient/company/${company_id}?assigned=true`,{
        headers:{
        'Content-Type': 'application/json',
        'x-access-token': token
      }});
      const res1 = await axios.get(`${BASE_URL}/patient/company/${company_id}?assigned=false`,{
        headers:{
        'Content-Type': 'application/json',
        'x-access-token': token
      }});
      if(res.data.status || res1.data.status){
        let residents = [...res.data.data,...res1.data.data];

        return residents.filter(e=>e.company_id==company_id);
      }else{

        return null;
      }

    }catch(e){
      return null;
    }
}
export const getUsers = async (token,company_id,patient_id) =>   {
  try{
    const res = await axios.get(`${BASE_URL}/user?company_id=${company_id}`,{
      headers:{
      'Content-Type': 'application/json',
      'x-access-token': token
    }});
   
    if( res.data.status){
      console.log(res.data.data)
      let users = res.data.data.non_installers.filter((e) => (e.patient_id!=null && (e.role_name == "Caregiver" && patient_id==e.patient_id)) ||  (e.patient_id==null && e.role_name == "Caregiver" ));
      return users
    }else{
      return null
    }
    
  }catch(e){
    return null
  }
}
export const getDeviceConfig = async (token,company_id,patient_id,apartment_id) => {
    try{
      const device = await axios.get(`${BASE_URL}/vayyar-devices/device_lists/${company_id}/${patient_id}/${apartment_id}`,{
        headers:{
        'Content-Type': 'application/json',
        'x-access-token': token
      }});
      if(device.data.status){
        if(device.data.data.length > 0){
          return device.data.data;  
        }else{
          return null
        }
      }else{
        return null
      }
     
    }catch(e){
       return null
    }
}
export const checkVendor = async (vendor_code) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/company/vendor_code/${vendor_code}`);
    return res.data
  }catch(e){
    return null;
  }
}
export const userMobile = async (username, userEmail, userPhone, parent_company_id,direct_company_id) =>  {
  try{

    const res = await axios.post(`${BASE_URL}/mobile/user`,{
      "users": [{ "name": username, "email": userEmail, "phone": userPhone }],
      "role_id": 2,
      "parent_company_id": parent_company_id,
      "company_id":direct_company_id?parent_company_id:null,
      "terms_and_condition": 0
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const getRoomDetails = async (roomId, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/room_details/${roomId}`,{
      headers: { 'x-access-token': token }
    });

    return res.data
  }catch(e){
    return null;
  }
}
export const logout = async ( userEmail)  =>  {
    try{
      const res = await axios.post(`${BASE_URL}/logout/`,{
        "email": userEmail,
        "type" : "portal_logout"
      });
      if(res.data.status){
        return true
      } 
      return null
    }catch(e){
      return null;
    }
}

export const addRoomCellSizeData = async( room_type_id, room_id, device_id, roomSizeA, roomSizeA1, roomSizeB, roomSizeB1, roomSizeC, roomSizeC1,roomSizeD,roomSizeD1,roomSizeHeight,roomSizeHeight1, token, user_room_measurements_id,selDevice)  =>   {

  try{

    const res = await axios.post(`${BASE_URL}/mobile/room_size/ceiling`,{
      "room_type_id": room_type_id,
      "room_id": room_id,
      "device_id": device_id,
      "device_type": "ceiling",
      "user_room_measurements_id": user_room_measurements_id,

      "top_from_device_feet": roomSizeA,
      "top_from_device_inches": roomSizeA1,
      "bottom_from_device_feet": roomSizeB,
      "bottom_from_device_inches": roomSizeB1,
      "room_left_feet": roomSizeC,
      "room_left_inches": roomSizeC1,
      "room_right_feet": roomSizeD,
      "room_right_inches": roomSizeD1,
      "room_height_feet": roomSizeHeight,
      "room_height_inches": roomSizeHeight1,
      "mount_type":selDevice.sensor_mount
    },{
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });

  if (res.data.status) {
      Unit.alertMes("Sensor Detection Area size saved successfully ");
      selDevice.region_configured = true;
      return selDevice
  }else{

    Unit.alertMes(res.data.message);
    return null
  }

  }catch(e){

    return null
  }
}
export const addRoomSizeData = async( room_type_id, room_id, device_id, roomSizeLeft, roomSizeLeft1, roomSizeRight, roomSizeRight1, roomSizeLength, roomSizeLength1, token, user_room_measurements_id,selDevice)  =>   {

    try{

      const res = await axios.post(`${BASE_URL}/mobile/room_size`,{
        "room_type_id": room_type_id,
        "room_id": room_id,
        "device_id": device_id,
        "user_room_measurements_id": user_room_measurements_id,
        "room_left_feet": roomSizeLeft,
        "room_left_inches": roomSizeLeft1,
        "room_right_feet": roomSizeRight,
        "room_right_inches": roomSizeRight1,
        "room_length_feet": roomSizeLength,
        "room_length_inches": roomSizeLength1,
        "mount_type":selDevice.sensor_mount 
      },{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });

    if (res.data.status) {
        Unit.alertMes("Sensor Detection Area size saved successfully ");
        selDevice.region_configured = true;
        return selDevice
    }else{

      Unit.alertMes(res.data.message);
      return null
    }

    }catch(e){

      return null
    }
}
export const setTermsAndCondition = async (token, user_id) =>  {
  try{
    const res = await axios.put(`${BASE_URL}/user/tc/${user_id}`,{
      "terms_and_condition": true
    },{
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const getCountries = async () =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/countries`);
    return res.data
  }catch(e){
    return null;
  }
}
export const getRoomTypes = async (token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/room_types`,{
      headers: { 'x-access-token': token }
    });
    let countries = res.data.data.map(element => ({
      ...element, 
      "label": element.name, 
      "value": element.id 
    }));

    return countries
  }catch(e){
     return false
  }
}
export const getStates = async (country_id) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/states/${country_id}`);
    return res.data
  }catch(e){
    return null;
  }
}
export const addUserAddress = async(address, address_line_2, city, state, zip, token, parent_company_id, Country) =>  {
    try{

      const res = await axios.post(`${BASE_URL}/mobile/address`,{
        "address": address,
        "address_line_2": address_line_2,
        "city": city, "state": state, "zip": zip,
        "parent_company_id": parent_company_id,
        "care_type_id": "5",
        "country": Country
      },{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      if(res.data.status){
        return res.data
      }else{

        Unit.alertMes(res.data.message)
        return null
      }
    }catch(e){
      return null
    }
}
export const updateUserAddress =async (address, address_line_2, city, state, zip, token, company_id, Country) => {
    try{
      const res = await axios.put(`${BASE_URL}/mobile/address/${company_id}`,{
        "address": address,
        "address_line_2": address_line_2,
        "city": city, "state": state, "zip": zip, "care_type_id": "5", "country": Country
      },{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      if(res.data.status){
        let user = res.data;
        return user;
      }else{
          Unit.alertMes(res.data.message)
          return null
      }
    }catch(e){
       return null;
    }
}
export const sendSupport = async (supportTxt,user, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/support`,{"user_full_name": user.user_name,"user_email":user.email,"user_phone":user.phone, "email_content": supportTxt },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const sendReport = async (supportTxt,user, imageObj) =>  {
  return new Promise((resolve, reject) => {

    let url = `${BASE_URL}/mobile/report`;

    //let key_value = "device" + me.userId;
    let formData = new FormData();
    let filename = Date.now() + ".jpeg";

    
    formData.append('data', JSON.stringify({ "email_content": supportTxt,
      "user_full_name":user.user_name,   
      "user_email":user.email,
      "user_phone":user.phone, 
      "email": CONFIG_EMAIL, "file_extension": ".jpg" }));

    formData.append("file", {
      uri: imageObj.uri,
      type: imageObj.type,
      name: filename,
    });

    // return false;
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      if (Platform.OS === "ios") {
        xhr.setRequestHeader(
          "Content-Type",
          "multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d"
        );
      }
      xhr.setRequestHeader("Accept", "*/*");
      xhr.send(formData);
      xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            resolve(response);

          } else {
            try {
              let response = JSON.parse(xhr.responseText);
              resolve(response);

            } catch (e) {
              reject(e)
            }
          }
        }
      };
    } catch (e) {
      reject(e);
    }

  });
}
export const addRoomSubRegion =async (device_id, room_id, furniture_type_size_id, user_room_measurements_id, sub_region_name, custom_length, custom_width, presence_detection, fall_detection, sub_region_from_left_feet, sub_region_from_left_inches, sub_region_from_right_feet, sub_region_from_right_inches, sub_region_from_front_feet, sub_region_from_front_inches, token, user_room_sub_region_id,selDevice) => {
  try{

    const res = await axios.post(`${BASE_URL}/mobile/sub_region`,{
      "device_id": device_id,
      "room_id": room_id,
      "furniture_type_size_id": furniture_type_size_id,
      "user_room_measurements_id": user_room_measurements_id,
      "user_room_sub_region_id": user_room_sub_region_id == null ? 0 : user_room_sub_region_id,
      "sub_region_name": sub_region_name,
      "custom_length": custom_length,
      "custom_width": custom_width,
      "presence_detection": presence_detection == '' ? false : presence_detection,
      "fall_detection": fall_detection == '' ? false : fall_detection,
      "sub_region_from_left_feet": sub_region_from_left_feet,
      "sub_region_from_left_inches": sub_region_from_left_inches,
      "sub_region_from_right_feet": sub_region_from_right_feet,
      "sub_region_from_right_inches": sub_region_from_right_inches,
      "sub_region_from_front_feet": sub_region_from_front_feet,
      "sub_region_from_front_inches": sub_region_from_front_inches
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const addContectInfo = async (contectList, token, company_id,patient_id)  =>  {
  console.log({
    "users": contectList,
    "role_id": 3,
    "company_id": company_id,
    "patient_id":patient_id
  });
    try{
      const res = await axios.post(`${BASE_URL}/mobile/contacts`,{
        "users": contectList,
        "role_id": 3,
        "company_id": company_id,
        "patient_id":patient_id
      },{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      if(res.data.status){
        return res.data
      }else {
        Unit.alertMes(res.data.message);
        return null
      }
    }catch(e){

       return null
    }
}
export const updateContectInfo = async (name, email, phone, token, company_id, user_id) => {

  try{
    const res = await axios.put(`${BASE_URL}/mobile/user-update/${user_id}`,{
      "name": name,
      "email": email,
      "phone": phone,
      "role_id": 3,
      "company_id": company_id
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const deleteContect = async (conectId, token) =>  {
  try{
    const res = await axios.delete(`${BASE_URL}/user/${conectId}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}

export const deletePatient = async (patient_id,token) => {
  try{
    const res = await axios.delete(`${BASE_URL}/patient/${patient_id}`,{
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
    if(res.data.status){
      return res.data
    }else {
      Unit.alertMes(res.data.message);
      return null
    }
  }catch(e){

     return null
  }
}
export const addThirdPatient = async (first_name, last_name, dob, sex, email, phone, token, address1,address2,city,state,zip,Country,parent_id,care_type_id,wings) => {
 
  try{

    let d = dob.split("/");

    const res = await axios.post(`${BASE_URL}/mobile/patient/add`,{
      "first_name": first_name, "last_name": last_name,
      "dob": moment(dob, "MM/DD/YYYY"),  "sex": sex,
      "city":city,
      "state": state,
      "zip": zip,
      "parent_id":parent_id,
      "country": Country[0].label,
      "care_type_id": care_type_id,
      "is_home_company":care_type_id==2?0:1,
      "email": email, "phone": phone, "address": address1 + " " + address2 ,
      'wings':wings
    },{
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });

    if(res.data.status){
      return res.data
    }else {
      Unit.alertMes(res.data.message);
      return null
    }
  }catch(e){
     return null
  }
}
export const addPatient = async (first_name, last_name, dob, sex, email, phone, token, company_id, resident) => {
    try{
      let d = dob.split("/");

      const res = await axios.post(`${BASE_URL}/patient`,{
        "first_name": first_name, "last_name": last_name,
        "dob": moment(dob, "MM/DD/YYYY"), "company_id": company_id, "sex": sex,
        "email": email, "phone": phone, "address": resident.address1 + " " + resident.address2 + " " + resident.city + "," + resident.state + " " + resident.zip + "," + resident.Country
      },{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      if(res.data.status){
        return res.data
      }else {
        Unit.alertMes(res.data.message);
        return null
      }
    }catch(e){

       return null
    }
}
export const updatePatient = async (first_name, last_name, dob, sex, email, phone, token, company_id, patient_id,address) =>  {
  try{
    let d = dob.split("/");
   
    const res = await axios.put(`${BASE_URL}/patient/${patient_id}`,{
      "first_name": first_name, "last_name": last_name, "dob": moment(dob, "MM/DD/YYYY"), "company_id": company_id, "sex": sex,
      "email": email, "phone": phone,"address":address, "devices_list": [{ "device_id": "", "device_type_id": "" }]
    },{
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
    if(res.data.status){
      return res.data
    }else {
      Unit.alertMes(res.data.message);
      return null
    }
  }catch(e){
      return null
  }
}
export const getRooms = async (token, company_id) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/apartment?company_id=${company_id}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const getWingList = async (token, company_id) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/company/${company_id}/wings`,{
      headers: { 'x-access-token': token }
    });
    let countries = res.data.data.map(element => ({
      ...element, 
      "label": element.name, 
      "value": element.id 
    }));
    return countries
  }catch(e){
    return null;
  }
}

export const getRegionType = async (roomType, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/sub_region_type/${roomType}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const getRegionSize = async (roomType, value, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/sub_room_size/${roomType}/${value}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const rebootConfiguration = async (device_Id, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/deviceAdmin/${device_Id}/command`,{
      "id": 0,
      "timestamp": Date.now(),
      "type": 6
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const room_measurement = async (room_type_id, room_id, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/room_measurement/${room_type_id}/${room_id}`,{
      headers: { 'x-access-token': token }
    });

    return res.data
  }catch(e){
    return null;
  }
}

export const sensorMount = async (details_id, typeId, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/sensor_mount`,{
      "device_id": details_id,
      "device_type":  typeId -1
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const LearningModeSave = async (details_id, mode, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/learning_mode`,{
      "device_id": details_id,
      "mode": mode?1:0
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const GenralDetailSave = async (details_id, volume, silent_mode, sensor_mounting, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/device_config`,{
      "device_id": details_id,
      "volume": volume,
      "silent_mode": silent_mode,
      "sensor_mounting": parseInt(sensor_mounting)
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const sub_region_list = async (room_id, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/sub_region_list/${room_id}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const deleteSub_region = async (deviceId, sub_region_name, sub_region_id, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/sub_region/delete`,{
      "device_id": deviceId,
      "sub_region_name": sub_region_name,
      "user_room_sub_region_id": sub_region_id
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const sub_region_details = async (user_room_sub_region_details_id, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/sub_region_details/${user_room_sub_region_details_id}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const  uploadFile = (file,type, filename, token) => {
  
  return new Promise((resolve, reject) => {
    let path = file;
    let url = `${BASE_URL}/brand/file-upload`;
    //let key_value = "device" + me.userId;
    let formData = new FormData();
   

    formData.append("image_filename", {
      uri: path,
      type: type,
      name: filename,
    });
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      if (Platform.OS === "ios") {
        xhr.setRequestHeader(
          "Content-Type",
          "multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d"
        );
      }
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("x-access-token", token);
      xhr.send(formData);
      xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            resolve(response);

          } else {
            try {

              let response = JSON.parse(xhr.responseText);
              resolve(response);

            } catch (e) {
              reject(e)
            }
          }
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}
export const getSaveRoomImage = async (apartment_id, name, file_name, token,time,room_id) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/images`,{
      "apartment_id": apartment_id,
      "file_name":time,
      "original_file_name": file_name,
      "image_direction":name,
      "room_id":room_id
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const getDeleteRoomImage = async (imageId, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/delete/images`,{
      "image_ids": [imageId]
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return null;
  }
}
export const getRoomImage = async (apartment_id, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/images/${apartment_id}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const aws_signed_url = async (file_Name) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/aws_signed_url`,{ "file_name": file_Name });
    return res.data
  }catch(e){
    return
  }
}
export const setApartmentName = async (apartment_id, room_name, mongo_room_id, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/apartment_name`,{
      "apartment_id": apartment_id,
      "room_name": room_name,
      "mongo_room_id": mongo_room_id
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const deleteRoom = async (deviceId, room_id, token) =>  {
  try{
    const res = await axios.delete(`${BASE_URL}/rooms/${room_id}/${deviceId}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const deleteApartment = async (apartment_id, token) =>  {
  try{
    const res = await axios.delete(`${BASE_URL}/apartment/${apartment_id}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const deleteRoomConfig = async (deviceId, token) =>  {
  try{
    const res = await axios.delete(`${BASE_URL}/mobile/vayyar_config/${deviceId}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const addRoomData = async (patient_id, roomType, Namelabel, company_id, token, room_name,apartment_id,Wing_name) =>  {
  try{
    console.log("addRoomData",{
      "company_id": company_id.toString(),
      "patient_id": patient_id.toString(),
      "room_type_id": roomType.toString(),
      "room_type_name": Namelabel.toString(),
      "wing_name":Wing_name,
      "care_type_id": "5",
      "room_name": room_name,
      "apartment_id":apartment_id
    })
    const res = await axios.post(`${BASE_URL}/mobile/room`,{
      "company_id": company_id.toString(),
      "patient_id": patient_id.toString(),
      "room_type_id": roomType.toString(),
      "room_type_name": Namelabel.toString(),
      "wing_name":Wing_name,
      "care_type_id": "5",
      "room_name": room_name,
      "apartment_id":apartment_id
    },{
      headers: { 'x-access-token': token }
    });
    if(res.status){
      return res.data
    }else{
      return null;
    }
  }catch(e){
    console.log(e)
    return null;
  }
}

export const addResidentRoom = async (patient_id, roomType, Namelabel, company_id, token, room_name,Wing_name,apartment_id) =>  {
  try{
    console.log("addResidentRoom",{
      "patient_id": patient_id.toString(),
      "room_type_id": roomType.toString(),
      "room_type_name": Namelabel.toString(),
      "room_name": room_name,
      "care_type_id": "5",
      "apartment_id":apartment_id,
      "company_id": company_id.toString(),
      "wing_id" : Wing_name
    })
    const res = await axios.post(`${BASE_URL}/mobile/room/assited-living`,{
      "patient_id": patient_id.toString(),
      "room_type_id": roomType.toString(),
      "room_type_name": Namelabel.toString(),
      "room_name": room_name,
      "care_type_id": "5",
      "apartment_id":apartment_id,
      "company_id": company_id.toString(),
      "wing_id" : Wing_name
    },{
      headers: { 'x-access-token': token }
    });
    if(res.status){
      return res.data
    }else{
      return null;
    }
  }catch(e){
    return null;
  }
}
export const addRoomInfo = async (name, apartment_id, subroom_id, apartment_name, company_id, token) =>  {
  try{ 
    console.log(addRoomInfo,{
      "name": name.toString(), //room_type.name (bedroom)
      "apartment_id": apartment_id.toString(), //apartment_id
      "subroom_id": subroom_id.toString(), //room_id
      "company_id": company_id.toString(),
      "apartment_name": apartment_name.toString()
    })
    const res = await axios.post(`${BASE_URL}/rooms`,{
      "name": name.toString(), //room_type.name (bedroom)
      "apartment_id": apartment_id.toString(), //apartment_id
      "subroom_id": subroom_id.toString(), //room_id
      "company_id": company_id.toString(),
      "apartment_name": apartment_name.toString()
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const assignRooms = async (deviceId, room_id, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/rooms/${room_id}/${deviceId}`,null,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const syncDeviceById = async (vyaar_device_id, company_id, token) =>  {
  try{
    const res = await axios.put(`${BASE_URL}/device/vayyar/${vyaar_device_id}/company/${company_id}`,null,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const unassignRoomResident = async (company_id, token) =>  {
  try{
    const res = await axios.put(`${BASE_URL}/mobile/unassign_room_resident/${company_id}`,null,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
} 
export const getDeviceBySN = async (deviceInfo, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/vayyar-devices/search/${deviceInfo}`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const getGenralDetails = async (device_id, token) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/deviceAdmin/${device_id}/config`,{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}

export const sendParent_email = async (company_id, company_name, company_address, resident_name, resident_address, resident_phone, admin_user_name, user_phone, token) =>  {
  try{
    const res = await axios.post(`${BASE_URL}/mobile/parent_email`,{
      "company_id": company_id,
      "installation_date": moment().format('MM/DD/YYYY hh:mm:ss'),
      "company_name": company_name,
      "no_of_device": 1,
      "resident_name": resident_name,
      "resident_address": resident_address,
      "resident_phone": resident_phone,
      "admin_user_name": admin_user_name,
      "company_address": company_address,
      "user_phone": user_phone
    },{
      headers: { 'x-access-token': token }
    });
    return res.data
  }catch(e){
    return
  }
}
export const getCompanyById = async (company_id, token) =>  {
  try{

    const res = await axios.get(`${BASE_URL}/mobile/companies/${company_id}`,{
      headers: { 'x-access-token': token }
    });
    if(res.data.status){
      return res.data
    }else{
      AsyncStorage.removeItem('userInfo');
      return null;
    }
  
  }catch(e){
    return null;
  }
}
export const getCompanyBy3party = async (type,company_id, token,depth) =>  {
  try{
    const res = await axios.get(`${BASE_URL}/mobile/user_companies/${type}/${company_id}?depth=${depth}`,{
      headers: { 'x-access-token': token }
    });
    if( res.data.status){
      return res.data
    }else{
      AsyncStorage.removeItem('userInfo');
      return null;
    }

  }catch(e){
    return null;
  }
}

export const selectCompant = (selDevice) => ({
  type: SELECT_COMPANY,
  payload: { "id": selDevice.id, "name": selDevice.name, "is_home_company":selDevice.is_home_company?selDevice.is_home_company:0,
  "address": selDevice.address, "vendor_code": selDevice.vendor_code, "parent_id": selDevice.parent_id }
})
export const selectSubCompant = (selDevice) => ({
  type: SELECT_SUBCOMPANY,
  payload: { "id": selDevice.id, "name": selDevice.name, "is_home_company":selDevice.is_home_company?selDevice.is_home_company:0,
  "address": selDevice.address, "vendor_code": selDevice.vendor_code, "parent_id": selDevice.parent_id }
})
export const setWIFI = (SSID, Pass) => ({
  type: WIFI_INFO,
  payload: { "wifi_SSid": SSID, "wifi_Pass": Pass }
})
export const Device = (token) => ({
  type: DEVICE_IN,
  payload: token
})
export const DeviceType = (token) => ({
  type: DEVICE_TYPE,
  payload: token
})

export const addRoom = (name, room_id, apartment_id, subroom_id, apartment_name) => ({
  type: ADD_ROOM,
  payload: {
    "name": name, "room_id": room_id, "apartment_id": apartment_id,
    "subroom_id": subroom_id, "apartment_name": apartment_name
  }
})
export const Logout = () => ({
  type: LOGOUT
})
export const addResident = (first_name, last_name, dob, phone, email,sex,formValues,patientId=0,apartment_id=0) => ({
  type: RESIDENT_INFO,
  payload: { 'firstName': first_name, 'lastName': last_name, 'DOB': dob, 
          'phoneNo': phone, 'email': email, 'gender': sex,'wings':formValues,
          "id":patientId,apartment_id:apartment_id 
  }
})
export const addResidentAddress = (address, address_line_2, city, state, zip,Country) => ({
  type: ACCOUNT_INFO,
  payload: { 
    'address1': address, 'address2': address_line_2, 'city': city, 
    'state': state, 'zip': zip, 'Country': Country 
  }
})
export const selectDevice = (device) => ({
  type: ADD_SELECT,
  payload: device
})
export const addSubCompany = (subCompany) => ({
  type:ADD_SUBCOMPANY,
  payload:subCompany
})
export const clearSubCompany = () => ({
  type:RESET_SUBCOMPANY
})
export const clearResident = () => ({
  type: CLEAR_OTHER_RESIDENT
})
export const setresident = (id) => ({
  type: RESIDENT_ID,
  payload:id
})
export const clearCompany = () => ({
  type: RESET_COMPANY
})

