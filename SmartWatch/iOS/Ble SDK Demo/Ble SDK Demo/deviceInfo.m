//
//  deviceInfo.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/19.
//

#import "deviceInfo.h"

@interface deviceInfo ()<UITableViewDelegate,UITableViewDataSource,MyBleDelegate>
{
    NSArray * arrayNotificationName;
    MyNotificationType  currentNotificationType;
}
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (strong, nonatomic) IBOutlet UIScrollView *myScrollView;
@property (weak, nonatomic) IBOutlet UILabel *labDistanceUnit;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segDistanceUnit;
@property (weak, nonatomic) IBOutlet UILabel *labTimeFormat;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segTimeFormat;
@property (weak, nonatomic) IBOutlet UILabel *labWristOn;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segWristOn;
@property (weak, nonatomic) IBOutlet UILabel *labTemperatureUnit;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segTemperatureUnit;
@property (weak, nonatomic) IBOutlet UILabel *labNotDisturbMode;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segNotDisturbMode;
@property (weak, nonatomic) IBOutlet UILabel *labANCS;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segANCS;
@property (weak, nonatomic) IBOutlet UITableView *myTableView;
@property (weak, nonatomic) IBOutlet UILabel *labBaseHRName;
@property (weak, nonatomic) IBOutlet UILabel *labBaseHRValue;
@property (weak, nonatomic) IBOutlet UIStepper *steperHR;
@property (weak, nonatomic) IBOutlet UILabel *labScreenBrightnessName;
@property (weak, nonatomic) IBOutlet UILabel *labScreenBrightnessValue;
@property (weak, nonatomic) IBOutlet UIStepper *steperScreenBrightness;
@property (weak, nonatomic) IBOutlet UILabel *labWatchStyleName;
@property (weak, nonatomic) IBOutlet UILabel *labWatchStyleValue;
@property (weak, nonatomic) IBOutlet UIStepper *steperWatchStyle;
@property (weak, nonatomic) IBOutlet UILabel *labSocialDistanceRemind;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segSocialDistanceRemind;
@property (weak, nonatomic) IBOutlet UILabel *labLanguage;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segLanguage;

@property (weak, nonatomic) IBOutlet UIButton *btnSetDeviceInfo;
@property (weak, nonatomic) IBOutlet UIButton *btnGetDeviceInfo;
@end

@implementation deviceInfo

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    [NewBle sharedManager].delegate = self;
    arrayNotificationName = [NSArray arrayWithObjects:LocalForkey(@"来电"), LocalForkey(@"短信"),LocalForkey(@"微信"),LocalForkey(@"facebook"),LocalForkey(@"instagram"),LocalForkey(@"skype"),LocalForkey(@"telegram"),LocalForkey(@"twitter"),LocalForkey(@"vkclient"),LocalForkey(@"whatsapp"),LocalForkey(@"qq"),LocalForkey(@"in"),nil];

    [self myMasonry];
    
    [self getDeviceInfo:nil];
}

-(void)myMasonry
{
    
    _labTitle.text = LocalForkey(@"设备信息");
    _labDistanceUnit.text = LocalForkey(@"距离单位");
    _labTimeFormat.text = LocalForkey(@"时间格式");
    _labWristOn.text = LocalForkey(@"抬腕亮屏");
    _labTemperatureUnit.text = LocalForkey(@"温度单位");
    _labNotDisturbMode.text = LocalForkey(@"勿扰模式");
    _labANCS.text = LocalForkey(@"消息提醒总开关");
    _labBaseHRName.text = LocalForkey(@"基础心率值");
    _labScreenBrightnessName.text = LocalForkey(@"屏幕亮度");
    _labWatchStyleName.text = LocalForkey(@"表盘样式");
    _labSocialDistanceRemind.text = LocalForkey(@"社交距离提醒");
    _labLanguage.text = LocalForkey(@"系统语言");
    [_btnSetDeviceInfo setTitle:LocalForkey(@"设置设备信息") forState:UIControlStateNormal];
    [_btnGetDeviceInfo setTitle:LocalForkey(@"获取设备信息") forState:UIControlStateNormal];
    
    _btnSetDeviceInfo.layer.cornerRadius = 10 * Proportion;
    _btnGetDeviceInfo.layer.cornerRadius = 10 * Proportion;
    
    
    if (@available(iOS 11.0, *)) {
        _myScrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }else {
        self.automaticallyAdjustsScrollViewInsets = NO;
    }
    
    [self.view addSubview:_myScrollView];
    _myScrollView.contentSize = CGSizeMake(Width,950*Proportion);
    
    
    [_btnSetDeviceInfo mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(20*Proportion);
        make.bottom.mas_equalTo(self.view.mas_bottom).offset(-15*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    
    [_btnGetDeviceInfo mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.right.mas_equalTo(self.view.mas_right).offset(-20*Proportion);
        make.centerY.mas_equalTo(_btnSetDeviceInfo.mas_centerY);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    
    
    [_myScrollView mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(100*Proportion);
        make.width.mas_equalTo(Width);
        make.height.mas_equalTo(Height-180*Proportion);
    }];
    
    
    [_labDistanceUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_myScrollView.mas_left).offset(30*Proportion);
        make.top.mas_equalTo(_myScrollView.mas_top);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segDistanceUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labDistanceUnit.mas_right).offset(30*Proportion);
        make.centerY.mas_equalTo(_labDistanceUnit.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [_labTimeFormat mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labDistanceUnit.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segTimeFormat mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labTimeFormat.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [_labWristOn mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labTimeFormat.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segWristOn mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labWristOn.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [_labTemperatureUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labWristOn.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segTemperatureUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labTemperatureUnit.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [_labNotDisturbMode mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labTemperatureUnit.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segNotDisturbMode mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labNotDisturbMode.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [_labANCS mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labNotDisturbMode.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segANCS mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labANCS.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    
    [_myTableView mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_myScrollView.mas_centerX);
        make.top.mas_equalTo(_labANCS.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(314 * Proportion);
        make.height.mas_equalTo(arrayNotificationName.count*40*Proportion);
    }];
    
    [_labBaseHRName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_myTableView.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    
    
    [_labBaseHRValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labBaseHRName.mas_right);
        make.centerY.mas_equalTo(_labBaseHRName.mas_centerY);
        make.width.mas_equalTo(42 * Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_steperHR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.right.mas_equalTo(_segDistanceUnit.mas_right);
        make.centerY.mas_equalTo(_labBaseHRName.mas_centerY);
        make.width.mas_equalTo(94);
        make.height.mas_equalTo(32);
    }];
    
    
    //屏幕亮度  screenbrightness
    [_labScreenBrightnessName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labBaseHRName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labScreenBrightnessValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labBaseHRValue.mas_centerX);
        make.centerY.mas_equalTo(_labScreenBrightnessName.mas_centerY);
        make.width.mas_equalTo(42 * Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_steperScreenBrightness mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_steperHR.mas_centerX);
        make.centerY.mas_equalTo(_labScreenBrightnessName.mas_centerY);
        make.width.mas_equalTo(94);
        make.height.mas_equalTo(32);
    }];
    
    //表盘风格  watchStyle
    [_labWatchStyleName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labScreenBrightnessName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labWatchStyleValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labBaseHRValue.mas_centerX);
        make.centerY.mas_equalTo(_labWatchStyleName.mas_centerY);
        make.width.mas_equalTo(42 * Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_steperWatchStyle mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_steperHR.mas_centerX);
        make.centerY.mas_equalTo(_labWatchStyleName.mas_centerY);
        make.width.mas_equalTo(94);
        make.height.mas_equalTo(32);
    }];
    
    //社交距离提醒  socialDistanceRemind
    [_labSocialDistanceRemind mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labWatchStyleName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segSocialDistanceRemind mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labSocialDistanceRemind.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
    
    //语言切换  language
    [_labLanguage mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labDistanceUnit.mas_centerX);
        make.top.mas_equalTo(_labSocialDistanceRemind.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150 * Proportion);
        make.height.mas_equalTo(30 * Proportion);
    }];
    
    [_segLanguage mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_segDistanceUnit.mas_centerX);
        make.centerY.mas_equalTo(_labLanguage.mas_centerY);
        make.width.mas_equalTo(130 * Proportion);
        make.height.mas_equalTo(32);
    }];
     
}



#pragma mark MyBleDelegate
-(void)ConnectSuccessfully
{
    
}
-(void)Disconnect:(NSError *_Nullable)error
{
    [PishumToast showToastWithMessage:LocalForkey(@"设备断开连接") Length:TOAST_SHORT ParentView:self.view];
}
-(void)scanWithPeripheral:(CBPeripheral*_Nonnull)peripheral advertisementData:(NSDictionary<NSString *, id> *_Nonnull)advertisementData RSSI:(NSNumber *_Nonnull)RSSI
{
    
}
-(void)ConnectFailedWithError:(nullable NSError *)error
{
    
}
-(void)EnableCommunicate
{
    
}
-(void)BleCommunicateWithPeripheral:(CBPeripheral*)Peripheral data:(NSData *)data
{
    DeviceData * deviceData = [[DeviceData alloc] init];
    deviceData  = [[BleSDK sharedManager] DataParsingWithData:data];
    if(deviceData.dataType == SetDeviceInfo)
    {
        [PishumToast showToastWithMessage:LocalForkey(@"设置设备信息成功") Length:TOAST_SHORT ParentView:self.view];
    }
    else if (deviceData.dataType == GetDeviceInfo)
    {
        NSDictionary * dicData = deviceData.dicData;
        NSNumber * distancUnit = dicData[@"distanceUnit"];
        _segDistanceUnit.selectedSegmentIndex = distancUnit.integerValue;
        NSNumber * timeUnit = dicData[@"timeUnit"];
        _segTimeFormat.selectedSegmentIndex = timeUnit.integerValue;
        NSNumber * wristOn = dicData[@"wristOn"];
        _segWristOn.selectedSegmentIndex = wristOn.integerValue;
        NSNumber * temperatureUnit = dicData[@"temperatureUnit"];
        _segTemperatureUnit.selectedSegmentIndex = temperatureUnit.integerValue;
        NSNumber * notDisturbMode = dicData[@"notDisturbMode"];
        _segNotDisturbMode.selectedSegmentIndex = notDisturbMode.integerValue;
        NSNumber * ANCS = dicData[@"ANCS"];
        _segANCS.selectedSegmentIndex = ANCS.integerValue;
        NSNumber * call = dicData[@"call"];
        currentNotificationType.call = call.intValue;
        NSNumber * SMS = dicData[@"SMS"];
        currentNotificationType.SMS = SMS.intValue;
        NSNumber * wechat = dicData[@"wechat"];
        currentNotificationType.wechat = wechat.intValue;
        NSNumber * facebook = dicData[@"facebook"];
        currentNotificationType.facebook = facebook.intValue;
        NSNumber * instagram = dicData[@"instagram"];
        currentNotificationType.instagram = instagram.intValue;
        NSNumber * skype = dicData[@"skype"];
        currentNotificationType.skype = skype.intValue;
        NSNumber * telegram = dicData[@"telegram"];
        currentNotificationType.telegram = telegram.intValue;
        NSNumber * twitter = dicData[@"twitter"];
        currentNotificationType.twitter = twitter.intValue;
        NSNumber * vkclient = dicData[@"vkclient"];
        currentNotificationType.vkclient = vkclient.intValue;
        NSNumber * whatsapp = dicData[@"whatsapp"];
        currentNotificationType.whatsapp = whatsapp.intValue;
        NSNumber * qq = dicData[@"qq"];
        currentNotificationType.qq = qq.intValue;
        NSNumber * In = dicData[@"in"];
        currentNotificationType.In = In.intValue;
        NSNumber * baseHeartRate = dicData[@"baseHeartRate"];
        _labBaseHRValue.text = [NSString stringWithFormat:@"%@",baseHeartRate];
        _steperHR.value = baseHeartRate.doubleValue;
        NSNumber * screenBrightness = dicData[@"screenBrightness"];
        _labScreenBrightnessValue.text = [NSString stringWithFormat:@"%@",screenBrightness];
        _steperScreenBrightness.value = screenBrightness.doubleValue;
        NSNumber * watchFaceStyle = dicData[@"watchFaceStyle"];
        _labWatchStyleValue.text = [NSString stringWithFormat:@"%@",watchFaceStyle];
        _steperWatchStyle.value = watchFaceStyle.doubleValue;
        NSNumber * socialDistanceRemind = dicData[@"socialDistanceRemind"];
        _segSocialDistanceRemind.selectedSegmentIndex = socialDistanceRemind.integerValue;
        NSNumber * language = dicData[@"language"];
        _segLanguage.selectedSegmentIndex = language.integerValue;
        [_myTableView reloadData];
    }
    else if (deviceData.dataType == FindMobilePhone)
    {
        [PishumToast showToastWithMessage:LocalForkey(@"正在查找手机") Length:TOAST_SHORT ParentView:self.view];
    }
    else if (deviceData.dataType == SOS)
    {
        [PishumToast showToastWithMessage:LocalForkey(@"正在发送SOS") Length:TOAST_SHORT ParentView:self.view];
    }

}


#pragma mark UITableViewDataSource
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *cellIdentifier = @"cell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    
    for(UIView * view in cell.contentView.subviews){
        if([view isKindOfClass:[UILabel class]]||[view isKindOfClass:[UISwitch class]])
            [view removeFromSuperview];
    }
    
    UILabel * labName = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 120*Proportion, 40*Proportion)];
    labName.text = arrayNotificationName[indexPath.row];
    labName.font = [UIFont systemFontOfSize:16];
    labName.textColor = UIColor.blackColor;
    [cell.contentView addSubview:labName];
    
    UISwitch * switchView = [[UISwitch alloc] initWithFrame:CGRectMake(240*Proportion, (40*Proportion-31)/2.0, 49, 31)];
    switchView.tag = indexPath.row;
    switchView.onTintColor = RGBA(1, 0xa8,0xae, 1);
    [switchView addTarget:self action:@selector(switchAction:) forControlEvents:UIControlEventValueChanged];
    [cell.contentView addSubview:switchView];
    int notification = 0;
    switch (indexPath.row) {
        case 0:
            notification = currentNotificationType.call;
            break;
        case 1:
            notification = currentNotificationType.SMS;
            break;
        case 2:
            notification = currentNotificationType.wechat;
            break;
        case 3:
            notification = currentNotificationType.facebook;
            break;
        case 4:
            notification = currentNotificationType.instagram;
            break;
        case 5:
            notification = currentNotificationType.skype;
            break;
        case 6:
            notification = currentNotificationType.telegram;
            break;
        case 7:
            notification = currentNotificationType.twitter;
            break;
        case 8:
            notification = currentNotificationType.vkclient;
            break;
        case 9:
            notification = currentNotificationType.whatsapp;
            break;
        case 10:
            notification = currentNotificationType.qq;
            break;
        case 11:
            notification = currentNotificationType.In;
            break;
        default:
            break;
    }
    if(notification==1)
        switchView.on = YES;
    else
        switchView.on = NO;
    
    
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = UIColor.clearColor;
    
    return cell;
    
    
} // 创建单元格



- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
    return  arrayNotificationName.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(nonnull NSIndexPath *)indexPath
{
    return  40*Proportion;
}


-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}


-(void)switchAction:(UISwitch*)mySwitch
{
    int tag = (int)mySwitch.tag;
    switch (tag) {
        case 0:
            currentNotificationType.call = (mySwitch.on==YES?1:0);
            break;
        case 1:
            currentNotificationType.SMS = (mySwitch.on==YES?1:0);
            break;
        case 2:
            currentNotificationType.wechat = (mySwitch.on==YES?1:0);
            break;
        case 3:
            currentNotificationType.facebook = (mySwitch.on==YES?1:0);
            break;
        case 4:
            currentNotificationType.instagram = (mySwitch.on==YES?1:0);
            break;
        case 5:
            currentNotificationType.skype = (mySwitch.on==YES?1:0);
            break;
        case 6:
            currentNotificationType.telegram = (mySwitch.on==YES?1:0);
            break;
        case 7:
            currentNotificationType.twitter = (mySwitch.on==YES?1:0);
            break;
        case 8:
            currentNotificationType.vkclient = (mySwitch.on==YES?1:0);
            break;
        case 9:
            currentNotificationType.whatsapp = (mySwitch.on==YES?1:0);
            break;
        case 10:
            currentNotificationType.qq = (mySwitch.on==YES?1:0);
            break;
        case 11:
            currentNotificationType.In = (mySwitch.on==YES?1:0);
            break;
        default:
            break;
    }
}

- (IBAction)hrValue:(UIStepper *)sender {

    _labBaseHRValue.text = [NSString stringWithFormat:@"%.0f",sender.value];
}
- (IBAction)screenBrightnessValue:(UIStepper *)sender {
  
    _labScreenBrightnessValue.text = [NSString stringWithFormat:@"%.0f",sender.value];
}

- (IBAction)watchStyleValue:(UIStepper *)sender {
    _labWatchStyleValue.text = [NSString stringWithFormat:@"%.0f",sender.value];
}

- (IBAction)setDeviceInfo:(UIButton *)sender {
    
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
    MyDeviceInfo deviceInfo;
    deviceInfo.distanceUnit = (int)_segDistanceUnit.selectedSegmentIndex;
    deviceInfo.timeUnit = (int)_segTimeFormat.selectedSegmentIndex;
    deviceInfo.wristOn = (int)_segWristOn.selectedSegmentIndex;
    deviceInfo.notDisturbMode = (int)_segNotDisturbMode.selectedSegmentIndex;
    deviceInfo.temperatureUnit = (int)_segTemperatureUnit.selectedSegmentIndex;
    deviceInfo.ANCS = (int)_segANCS.selectedSegmentIndex;
    deviceInfo.notificationType = currentNotificationType;
    deviceInfo.baseHeartRate = _labBaseHRValue.text.intValue;
    deviceInfo.screenBrightness = _labScreenBrightnessValue.text.intValue;
    deviceInfo.watchFaceStyle = _labWatchStyleValue.text.intValue;
    deviceInfo.socialDistanceRemind = (int)_segSocialDistanceRemind.selectedSegmentIndex;
        deviceInfo.language = (int)_segLanguage.selectedSegmentIndex;
        NSMutableData * data = [[BleSDK sharedManager] SetDeviceInfo:deviceInfo];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
    
}

- (IBAction)getDeviceInfo:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSMutableData * data = [[BleSDK sharedManager] GetDeviceInfo];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}


- (IBAction)back:(UIButton *)sender {
    
    [self.navigationController popViewControllerAnimated:YES];
}

@end
