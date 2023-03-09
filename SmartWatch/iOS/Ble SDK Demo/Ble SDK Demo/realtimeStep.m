//
//  realtimeStep.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/21.
//

#import "realtimeStep.h"

@interface realtimeStep ()<MyBleDelegate>
{
    int distanceUnit;
    int temperatureUnit;
}
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UILabel *labStepName;
@property (weak, nonatomic) IBOutlet UILabel *labStepValue;
@property (weak, nonatomic) IBOutlet UILabel *labStepUnit;
@property (weak, nonatomic) IBOutlet UILabel *labCaloriesName;
@property (weak, nonatomic) IBOutlet UILabel *labCaloriesValue;
@property (weak, nonatomic) IBOutlet UILabel *labCaloriesUnit;
@property (weak, nonatomic) IBOutlet UILabel *labDistanceName;
@property (weak, nonatomic) IBOutlet UILabel *labDistanceValue;
@property (weak, nonatomic) IBOutlet UILabel *labDistanceUnit;
@property (weak, nonatomic) IBOutlet UILabel *labExerciseMinutesName;
@property (weak, nonatomic) IBOutlet UILabel *labExerciseMinutesValue;
@property (weak, nonatomic) IBOutlet UILabel *labExerciseMinutesUnit;
@property (weak, nonatomic) IBOutlet UILabel *labActiveMinutesName;
@property (weak, nonatomic) IBOutlet UILabel *labActiveMinutesValue;
@property (weak, nonatomic) IBOutlet UILabel *labActiveMinutesUnit;
@property (weak, nonatomic) IBOutlet UILabel *labHRName;
@property (weak, nonatomic) IBOutlet UILabel *labHRValue;
@property (weak, nonatomic) IBOutlet UILabel *labHRUnit;
@property (weak, nonatomic) IBOutlet UILabel *labTemperatureName;
@property (weak, nonatomic) IBOutlet UILabel *labTemperatureValue;
@property (weak, nonatomic) IBOutlet UILabel *labTemperatureUnit;
@property (weak, nonatomic) IBOutlet UIButton *btnStartRealtimeStep;
@property (weak, nonatomic) IBOutlet UIButton *btnStopRealtimeStep;
@end

@implementation realtimeStep

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    [NewBle sharedManager].delegate = self;
    [self myMasonry];
    [self getUnit];
}

-(void)getUnit
{
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSMutableData * data = [[BleSDK sharedManager] GetDeviceInfo];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
}

-(void)myMasonry
{
    
    _labTitle.text  = LocalForkey(@"实时计步");
    _labStepName.text = LocalForkey(@"步数");
    _labCaloriesName.text = LocalForkey(@"卡路里");
    _labDistanceName.text = LocalForkey(@"距离");
    _labExerciseMinutesName.text = LocalForkey(@"运动时间");
    _labActiveMinutesName.text = LocalForkey(@"强度运动时间");
    _labHRName.text = LocalForkey(@"心率");
    _labTemperatureName.text = LocalForkey(@"体温");
    _labCaloriesUnit.text = LocalForkey(@"千卡");
    _labDistanceUnit.text = LocalForkey(@"千米");
    _labExerciseMinutesUnit.text = LocalForkey(@"分钟");
    _labActiveMinutesUnit.text = LocalForkey(@"分钟");
    _labStepUnit.text = LocalForkey(@"步");
    [_btnStartRealtimeStep setTitle:LocalForkey(@"开启实时计步") forState:UIControlStateNormal];
    [_btnStopRealtimeStep setTitle:LocalForkey(@"关闭实时计步") forState:UIControlStateNormal];
    _btnStopRealtimeStep.layer.cornerRadius  = 10 * Proportion;
    _btnStartRealtimeStep.layer.cornerRadius  = 10 * Proportion;
    [_labStepName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(40*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(100*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labStepValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labStepName.mas_right).offset(16*Proportion);
        make.centerY.mas_equalTo(_labStepName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labStepUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labStepValue.mas_right).offset(8*Proportion);
        make.centerY.mas_equalTo(_labStepName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    
    [_labCaloriesName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepName.mas_centerX);
        make.top.mas_equalTo(_labStepName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labCaloriesValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepValue.mas_centerX);
        make.centerY.mas_equalTo(_labCaloriesName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labCaloriesUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepUnit.mas_centerX);
        make.centerY.mas_equalTo(_labCaloriesName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    
    
    [_labDistanceName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepName.mas_centerX);
        make.top.mas_equalTo(_labCaloriesName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labDistanceValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepValue.mas_centerX);
        make.centerY.mas_equalTo(_labDistanceName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labDistanceUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepUnit.mas_centerX);
        make.centerY.mas_equalTo(_labDistanceName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];

    [_labExerciseMinutesName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepName.mas_centerX);
        make.top.mas_equalTo(_labDistanceName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labExerciseMinutesValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepValue.mas_centerX);
        make.centerY.mas_equalTo(_labExerciseMinutesName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labExerciseMinutesUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepUnit.mas_centerX);
        make.centerY.mas_equalTo(_labExerciseMinutesName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];

    [_labActiveMinutesName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepName.mas_centerX);
        make.top.mas_equalTo(_labExerciseMinutesName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labActiveMinutesValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepValue.mas_centerX);
        make.centerY.mas_equalTo(_labActiveMinutesName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labActiveMinutesUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepUnit.mas_centerX);
        make.centerY.mas_equalTo(_labActiveMinutesName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];

    [_labHRName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepName.mas_centerX);
        make.top.mas_equalTo(_labActiveMinutesName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labHRValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepValue.mas_centerX);
        make.centerY.mas_equalTo(_labHRName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labHRUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepUnit.mas_centerX);
        make.centerY.mas_equalTo(_labHRName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];

    [_labTemperatureName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepName.mas_centerX);
        make.top.mas_equalTo(_labHRName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labTemperatureValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepValue.mas_centerX);
        make.centerY.mas_equalTo(_labTemperatureName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labTemperatureUnit mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(_labStepUnit.mas_centerX);
        make.centerY.mas_equalTo(_labTemperatureName.mas_centerY);
        make.width.mas_equalTo(77*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    
    
    [_btnStartRealtimeStep mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(20*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(430*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    [_btnStopRealtimeStep mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.right.mas_equalTo(self.view.mas_right).offset(-20*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(430*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
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
    if(deviceData.dataType == RealTimeStep)
    {
        NSDictionary * dicData = deviceData.dicData;
        /* NSDictionary * dicData = [NSDictionary dictionaryWithObjectsAndKeys:[NSNumber numberWithInt:step],@"step",[NSNumber numberWithFloat:calories*0.01],@"calories",[NSNumber numberWithFloat:distance*0.01],@"distance",[NSNumber numberWithInt:time/60],@"exerciseMinutes",[NSNumber numberWithInt:StrengthTrainingTime],@"activeMinutes",[NSNumber numberWithInt:heartRate],@"heartRate",[NSNumber numberWithFloat:temperature*0.1],@"temperature",nil];*/
        _labStepValue.text = [NSString stringWithFormat:@"%@",dicData[@"step"]];
        _labCaloriesValue.text = [NSString stringWithFormat:@"%@",dicData[@"calories"]];
        
        NSNumber * numberDistance = dicData[@"distance"];
        if(distanceUnit==1)
            _labDistanceValue.text = [NSString stringWithFormat:@"%.2f",numberDistance.floatValue*0.621];
        else
        _labDistanceValue.text = [NSString stringWithFormat:@"%@",numberDistance];
        _labExerciseMinutesValue.text = [NSString stringWithFormat:@"%@",dicData[@"exerciseMinutes"]];
        _labActiveMinutesValue.text = [NSString stringWithFormat:@"%@",dicData[@"activeMinutes"]];
        _labHRValue.text = [NSString stringWithFormat:@"%@",dicData[@"heartRate"]];
        NSNumber * numberTemperature = dicData[@"temperature"];
        if(temperatureUnit==1)
            _labTemperatureValue.text = [NSString stringWithFormat:@"%.0f",numberTemperature.floatValue*9/5.0+32];
        else
        _labTemperatureValue.text = [NSString stringWithFormat:@"%@",dicData[@"temperature"]];
        
        
    }
    if(deviceData.dataType == GetDeviceInfo)
    {
        NSDictionary * dicData = deviceData.dicData;
        NSNumber * deviceDistancUnit = dicData[@"distanceUnit"];
        distanceUnit = deviceDistancUnit.intValue;
        NSNumber * deviceTemperatureUnit = dicData[@"temperatureUnit"];
        temperatureUnit = deviceTemperatureUnit.intValue;
        if(distanceUnit==1)
            _labDistanceUnit.text = LocalForkey(@"英里");
        if(temperatureUnit==1)
            _labTemperatureUnit.text = LocalForkey(@"℉");
            
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


- (IBAction)startRealtimeStep:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSMutableData * data = [[BleSDK sharedManager] RealTimeDataWithType:2];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}

- (IBAction)stopRealtimeStep:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSMutableData * data = [[BleSDK sharedManager] RealTimeDataWithType:0];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}

- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}
@end
