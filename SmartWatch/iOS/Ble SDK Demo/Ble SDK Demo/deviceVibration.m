//
//  deviceVibration.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/21.
//

#import "deviceVibration.h"

@interface deviceVibration ()<MyBleDelegate>

@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UILabel *labDeviceVibrationName;
@property (weak, nonatomic) IBOutlet UILabel *labDeviceVibrationValue;
@property (weak, nonatomic) IBOutlet UIButton *btnDeviceVibration;
@property (weak, nonatomic) IBOutlet UIStepper *stepperVibration;

@end

@implementation deviceVibration

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    [self myMasonry];
}
-(void)myMasonry
{
    _labTitle.text = LocalForkey(@"设备震动");
    _labDeviceVibrationName.text = LocalForkey(@"震动次数");
    [_btnDeviceVibration setTitle:LocalForkey(@"设备震动") forState:UIControlStateNormal];
    _btnDeviceVibration.layer.cornerRadius  = 10 * Proportion;
    [_labDeviceVibrationName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(134*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_labDeviceVibrationValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_labDeviceVibrationName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(150*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [_stepperVibration mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_labDeviceVibrationValue.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(94);
        make.height.mas_equalTo(32);
    }];
    
    [_btnDeviceVibration mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_stepperVibration.mas_bottom).offset(30*Proportion);
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
    if(deviceData.dataType == MotorVibration)
    {
        [PishumToast showToastWithMessage:LocalForkey(@"设备震动") Length:TOAST_SHORT ParentView:self.view];
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



- (IBAction)changeValue:(UIStepper *)sender {
    _labDeviceVibrationValue.text = [NSString stringWithFormat:@"%.0f",sender.value];
    
}

- (IBAction)deviceVibration:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        int times = _labDeviceVibrationValue.text.intValue;
        NSMutableData * data = [[BleSDK sharedManager] MotorVibrationWithTimes:times];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}
- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

@end
