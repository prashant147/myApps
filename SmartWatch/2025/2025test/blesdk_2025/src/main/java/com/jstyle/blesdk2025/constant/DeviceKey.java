package com.jstyle.blesdk2025.constant;

/**
 * Created by Administrator on 2018/4/10.
 */

public class DeviceKey {
    public static final String heartValue = "heartValue";
    public static final String hrvValue = "hrvValue";
    public static final String Quality = "Quality";

    public static final String HangUp = "HangUp";
    public static final String Telephone = "Telephone";
    public static final String Photograph = "Photograph";
    public static final String CanclePhotograph = "CanclePhotograph";
    public static final String type = "type";
    public static final String Play = "Play";
    public static final String Suspend = "Suspend";
    public static final String LastSong = "LastSong";
    public static final String NextSong = "NextSong";
    public static final String VolumeReduction = "VolumeReduction";
    public static final String VolumeUp = "VolumeUp";
    public static final String FindYourPhone = "FindYourPhone";
    public static final String Cancle_FindPhone = "Cancle_FindPhone";
    public static final String SOS = "SOS";
    public static final String DataType = "dataType";
    public static final String enterActivityModeSuccess = "enterActivityModeSuccess";
    public static final String Type = "Type";
    public static final String RRIntervalData = "RRIntervalData";
    public static final String Manual = "Manual";
    public static final String automatic = "automatic";
    public static final String Data = "dicData";
    public static final String End = "dataEnd";
    public static final String index = "index";
    public static final String scanInterval = "scanInterval";
    public static final String scanTime = "scanTime";
    public static final String signalStrength = "signalStrength";
    public static final String arrayX = "arrayX";
    public static final String arrayY = "arrayY";
    public static final String arrayZ = "arrayZ";
    public static final String arrayPpgRawData = "arrayPpgRawData";
    public static final String KGpsResCheck0 = "KGpsResCheck0"; // ????????????   GET_DEVICE_Time
    public static final String KGpsResCheck1 = "KGpsResCheck1"; // ????????????
    public static final String Band = "Band";
    public static final String KFinishFlag = "finish";
    public static final String DeviceTime = "strDeviceTime"; // ????????????   GET_DEVICE_Time
    public static final String GPSTime = "gpsExpirationTime"; // ????????????   GET_DEVICE_Time
    public static final String TimeZone = "TimeZone"; // ????????????   GET_DEVICE_Time


    public static final String KHrvBloodHighPressure = "KHrvBloodHighPressure";
    public static final String KHrvBloodLowPressure = "KHrvBloodLowPressure";
    /*
     *  GET_PERSONAL_INFO
     *   sex         ??????
     *   Age         ??????
     *   Height      ??????
     *   Weight      ??????
     *   stepLength  ??????
     *   deviceId    ??????ID 
     */
    public static final String Gender = "MyGender";
    public static final String Age = "MyAge";
    public static final String Height = "MyHeight";
    public static final String Weight = "MyWeight";
    public static final String Stride = "MyStride";
    public static final String KUserDeviceId = "deviceId";


    /*
     *  GET_DEVICE_INFO
     *  distanceUnit  ????????????
     *  hourState     12??????24????????????
     *  handleEnable  ????????????????????????
     *  handleSign    ???????????????????????????
     *  screenState   ???????????????
     *  anceEnable    ANCS????????????
     */
    public static final String DistanceUnit = "distancUnit";
    public static final String TimeUnit = "timeUnit";
    public static final String TempUnit = "temperatureUnit";
    public static final String WristOn = "wristOn";
    public static final String TemperatureUnit = "TemperatureUnit";
    public static final String NightMode = "NightMode";
    public static final String LeftOrRight = "handleSign";
    //public static final String ScreenShow = "screenState";
    public static final String Dialinterface = "dialinterface";
    public static final String SocialDistancedwitch = "SocialDistancedwitch";
    public static final String ChineseOrEnglish= "ChineseOrEnglish";
    public static final String Lauage= "Lauage";
    public static final String ScreenBrightness = "dcreenBrightness";
    public static final String KBaseHeart = "baseHeartRate";
    public static final String isHorizontalScreen = "isHorizontalScreen";

    public static final String Year = "Year";
    public static final String Month = "Month";
    public static final String Day = "Day";
    public static final String MenstrualPeriod_Lenth = "MenstrualPeriod_Lenth";
    public static final String MenstrualPeriod_Period = "MenstrualPeriod_Period";

    /*
     *  SET_STEP_MODEL
     *totalSteps   ?????????
     *calories     ?????????
     *distance     ??????
     *time         ??????
     *heartValue   ?????????
     */

    public static final String Step = "step";
    public static final String Calories = "calories";
    public static final String Distance = "distance";
    public static final String ExerciseMinutes = "exerciseMinutes";
    public static final String HeartRate = "heartRate";
    public static final String ActiveMinutes = "ExerciseTime";
    public static final String TempData = "TempData";
    public static final String StepGoal = "stepGoal";   // ???????????????  GET_GOAL
    public static final String BatteryLevel = "batteryLevel";  // ????????????    READ_DEVICE_BATTERY
    public static final String MacAddress = "macAddress"; // MAC??????    READ_MAC_ADDRESS
    public static final String DeviceVersion = "deviceVersion";  // ?????????     READ_VERSION
    public static final String DeviceName = "deviceName";  // ????????????    GET_DEVICE_NAME
    public static final String TemperatureCorrectionValue = "TemperatureCorrectionValue";  // ????????????    GET_DEVICE_NAME

    /*
     *  GET_AUTOMIC_HEART
     *workModel         ????????????
     *heartStartHour    ???????????????????????????
     *heartStartMinter  ???????????????????????????
     *heartEndHour      ???????????????????????????
     *heartEndMinter      ???????????????????????????
     *heartWeek         ????????????
     *workTime          ??????????????????
     */
    public static final String WorkMode = "workModel";
    public static final String StartTime = "heartStartHour";
    public static final String KHeartStartMinter = "heartStartMinter";
    public static final String EndTime = "heartEndHour";
    public static final String KHeartEndMinter = "heartEndMinter";
    public static final String Weeks = "weekValue";
    public static final String IntervalTime = "intervalTime";


    /*
     *  READ_SPORT_PERIOD
     *StartTimeHour       ???????????????????????????
     *StartTimeMin     ???????????????????????????
     *EndTimeHour         ???????????????????????????
     *EndTimeMin       ???????????????????????????
     *Week      ????????????
     *KSportNotifierTime    ??????????????????
     */
    public static final String StartTimeHour = "sportStartHour";
    public static final String StartTimeMin = "sportStartMinter";
    public static final String EndTimeHour = "sportEndHour";
    public static final String EndTimeMin = "sportEndMinter";

    public static final String LeastSteps = "leastSteps";

    /*
     *  GET_STEP_DATA
     *historyDate       ??????????????????
     *historySteps      ??????
     *historyTime       ????????????
     *historyDistance   ??????
     *Calories  ?????????
     *historyGoal       ??????
     */
    public static final String Date = "date";
    public static final String Size = "size";
    public static final String Goal = "goal";



    /*
     *  GET_STEP_DETAIL
     *Date       ???????????????????????????
     *ArraySteps          ??????
     *Calories       ?????????
     *Distance       ??????
     *KDetailMinterStep     10??????????????????????????????
     */

    public static final String ArraySteps = "arraySteps";

    public static final String KDetailMinterStep = "detailMinterStep";
    public static final String temperature = "temperature";
    public static final String axillaryTemperature = "axillaryTemperature";

    /*
     * GET_SLEEP_DETAIL
     *Date        ???????????????????????????
     *KSleepLength      ?????????????????????
     *ArraySleep    5????????????????????? (??????24??????????????????????????????????????????)
     */

    public static final String KSleepLength = "sleepLength";
    public static final String ArraySleep = "arraySleepQuality";
    public static final String sleepUnitLength = "sleepUnitLength";//????????????????????????????????? 1???1???????????? 0???5????????????

    /*
     *  GET_HEART_DATA
     *Date        ???????????????????????????
     *ArrayDynamicHR        10???????????????????????????12????????????
     */

    public static final String ArrayDynamicHR = "arrayDynamicHR";
    public static final String Blood_oxygen = "Blood_oxygen";



    /*
     * GET_ONCE_HEARTDATA
     *Date        ???????????????????????????
     *StaticHR       ?????????
     */

    public static final String StaticHR = "onceHeartValue";

    /*
     *  GET_HRV_DATA
     *Date          ???????????????????????????
     *HRV         HRV???
     *VascularAging    ??????????????????
     *HeartRate    ?????????
     *Stress         ?????????
     */

    public static final String HRV = "hrv";
    public static final String VascularAging = "vascularAging";
    public static final String Fatiguedegree = "fatigueDegree";

    public static final String Stress = "stress";
    public static final String HighPressure = "highPressure";
    public static final String LowPressure = "lowPressure";
    public static final String highBP = "highBP";
    public static final String lowBP = "lowBP";

    /*
     *GET_ALARM
     *KAlarmId          0???4????????????
     *ClockType        ????????????
     *ClockTime        ?????????????????????
     *KAlarmMinter      ?????????????????????
     *Week  ????????????
     *KAlarmLength      ??????
     *KAlarmContent     ???????????????
     */
    public static final String KAlarmId = "alarmId";
    public static final String OpenOrClose = "clockOpenOrClose";
    public static final String ClockType = "clockType";
    public static final String ClockTime = "alarmHour";
    public static final String KAlarmMinter = "alarmMinter";
    public static final String Week = "weekValue";
    public static final String KAlarmLength = "alarmLength";
    public static final String KAlarmContent = "dicClock";


    /***********************GET_HRV_TESTDATA***************************************************/
    /*
     *KBloodTestLength      ????????????
     *KBloodTestProgress    ??????
     *KBloodTestValue       ??????PPG????????????
     *KBolldTestCurve       ?????????????????????
     */
    public static final String KBloodTestLength = "bloodTestLength";
    public static final String KBloodTestProgress = "bloodTestProgress";
    public static final String KBloodTestValue = "bloodTestValue";
    public static final String KBloodTestCurve = "bloodTestCurve";

    /*
     *KBloodResultPercent       ??????????????????
     *KBloodResultRebound       ??????????????????
     *KBloodResultMax           ????????????
     *KBloodResultRank          ???????????????1???6???
     */
    public static final String KBloodResultPercent = "bloodPercent";
    public static final String KBloodResultRebound = "bloodRebound";
    public static final String KBloodResultMax = "bloodResultMax";
    public static final String KBloodResultRank = "bloodResultRank";


    /*
     *KHrvTestProgress  ??????
     *KHrvTestWidth     ?????????????????????
     *KHrvTestValue     ?????????
     */
    public static final String KHrvTestProgress = "hrvTestProgress";
    public static final String KHrvTestWidth = "hrvTestWidth";
    public static final String KHrvTestValue = "hrvTestValue";

    /*
     *KHrvResultState   SDNN??????  ?????????0,??????????????????
     *KHrvResultAvg     SDNN?????????
     *KHrvResultTotal   ???SDNN??????
     *KHrvResultCount   ??????????????????
     *KHrvResultTired   ???????????????
     *KHrvResultValue   ?????????
     */
    public static final String KHrvResultState = "hrvResultState";
    public static final String KHrvResultAvg = "hrvResultAvg";
    public static final String KHrvResultTotal = "hrvResultTotal";
    public static final String KHrvResultCount = "hrvResultCount";
    public static final String KHrvResultTired = "hrvResultTired";
    public static final String KHrvResultValue = "hrvResultValue";


    /*
     *KDisturbState     1:????????????   0???????????????
     *KSlipHand         1: ????????????   0;?????????
     *KPPGData          PPG????????????
     */
    public static final String KDisturbState = "disturbState";
    public static final String KSlipHand = "slipHand";
    public static final String KPPGData = "ppgData";
    public static final String KPPIData = "ppiData";

    public static final String ppgResult = "ppgResult";

    public static final String ppgStartSucessed="ppgStartSucessed";
    public static final String ppgStartFailed="ppgStartFailed";
    public static final String ppgStop="ppgStop";
    public static final String ppgQuit="ppgQuit";
    public static final String ppgMeasurementProgress="ppgMeasurementProgress";





    /*
     *@param Date       ???????????????????????????
     *@param Latitude   ????????????
     *@param Longitude  ????????????
     */


    public static final String Latitude = "locationLatitude";
    public static final String Longitude = "locationLongitude";

    public static final String KActivityLocationTime = "ActivityLocationTIme";
    public static final String KActivityLocationLatitude = "ActivityLocationLatitude";
    public static final String KActivityLocationLongitude = "ActivityLocationLongitude";
    public static final String KActivityLocationCount = "KActivityLocationCount";
/*
 *      GET_SPORTMODEL_DATA
 *@param  Date        ???????????????????????????
 *@param  ActivityMode ????????????
 0=Run,
 1=Cycling,
 2=Swimming,
 3=Badminton,
 4=Football,
 5=Tennis,
 6=Yoga,
 7=Medication,
 8=Dance
 
 *@param  HeartRate       ??????
 *@param  ActiveMinutes   ????????????
 *@param  Step       ????????????
 *@param  Pace       ????????????
 *@param  Calories    ?????????
 *@param  Distance     ??????
 */


    public static final String ActivityMode = "sportModel";
    public static final String Pace = "sportModelSpeed";

    public static final String KDataID = "KDataID";
    public static final String KPhoneDataLength = "KPhoneDataLength";
    public static final String KClockLast = "KClockLast";


    public static final String TakePhotoMode = "TakePhotoMode";
    public static final String KFunction_tel = "TelMode";
    public static final String KFunction_reject_tel = "RejectTelMode";

    public static final String FindMobilePhoneMode = "FindMobilePhoneMode";
    public static final String KEnable_exercise = "KEnable_exercise";
    public static final String ECGQualityValue = "ECGQualityValue";

    public static final String ECGResultValue = "ECGResultVALUE";
    public static final String ECGHrvValue = "ECGHrvValue";
    public static final String ECGAvBlockValue = "ECGAvBlockValue";
    public static final String ECGHrValue = "ECGHrValue";
    public static final String PPGHrValue = "PPGHrValue";
    public static final String ECGStreesValue = "ECGStreesValue";
    public static final String ECGhighBpValue = "ECGhighBpValue";
    public static final String ECGLowBpValue = "ECGLowBpValue";
    public static final String ECGMoodValue = "ECGMoodValue";
    public static final String ECGBreathValue = "ECGBreathValue";
    public static final String KEcgDataString = "KEcgDataString"; // ecg
    public static final String ECGValue = "ECGValue";
    public static final String PPGValue = "PPGValue";
    public static final String EcgStatus = "EcgStatus";
    public static final String EcgSBP = "PPGSBP";
    public static final String EcgDBP = "PPGDBP";
    public static final String EcgHR = "PPGHR";
    public static final String WaveformDownTime = "WaveformDownTime";
    public static final String WaveformRiseTime = "WaveformRiseTime";

    public static final String EcgGender = "Gender";
    public static final String EcgAge = "Age";
    public static final String EcgHeight = "Height";
    public static final String EcgWeight = "Weight";


}
