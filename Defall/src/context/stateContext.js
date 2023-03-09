import React, { useState, useEffect } from 'react'


const StateContext = React.createContext();


export const StateProvider = ({ children }) => {

  const [auth,setAuth] = useState(null)
  const [company,setCompany] = useState(null)
  const [subCompany,setSubCompany] = useState(null)
  const [selCompany,setSelCompany] = useState(null)
  const [selSubCompany,setSelSubCompany] = useState(null)
  const [resident,setResident] = useState(null)
  const [residentAdd,setResidentAss] = useState(null)
  const [selDevice,setSelDevice] = useState(null) 
  const [selDeviceType,setSelDeviceType] = useState(null) 
  const [roomType,setRoomTypes] = useState(null)
  const [companyType,setCompanyType] = useState(null)
  const [isComapany,setIsComapany] = useState(false)
  const [CompanyBack,setCompanyBack] = useState([])
  const [contact,setContact] = useState([])
  const [room,setRoom] = useState(null)
  const [isOpenDrawer,setisOpenDrawer] = useState(false)

  return (
    <StateContext.Provider value={{ auth,resident,selDevice,roomType,selCompany,company,
    companyType,subCompany,selSubCompany,isComapany,residentAdd,CompanyBack,contact,
    room,selDeviceType,isOpenDrawer,setSelDeviceType,setRoom,setContact,setCompanyBack,setResident,
    setIsComapany,setSelSubCompany,setSubCompany,setCompanyType,setCompany,setResidentAss,
    setSelCompany, setAuth,setResident,setSelDevice,setRoomTypes,setisOpenDrawer }}>
      { children }
    </StateContext.Provider>
  )
};

export default StateContext
