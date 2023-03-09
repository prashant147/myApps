//
//  startHealthMeasurementByApp.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/6/6.
//

#import "startHealthMeasurementByApp.h"

@interface startHealthMeasurementByApp ()<MyBleDelegate>
{
    
    __weak IBOutlet UISegmentedControl *segDataType;
   
    __weak IBOutlet UILabel *labData;
    __weak IBOutlet UILabel *labPPG;
    __weak IBOutlet UILabel *labPPI;
    __weak IBOutlet UISwitch *switchData;
    __weak IBOutlet UISwitch *switchPPG;
    __weak IBOutlet UISwitch *switchPPI;
    __weak IBOutlet UITextView *myTextView;
    __weak IBOutlet UIButton *btnStart;
    
    NSString * strText;
}
@end

@implementation startHealthMeasurementByApp

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    [self myMasory];
}

  
-(void)myMasory
{
    [segDataType setTitle:LocalForkey(@"HRV") forSegmentAtIndex:0];
    [segDataType setTitle:LocalForkey(@"心率") forSegmentAtIndex:1];
    [segDataType setTitle:LocalForkey(@"血氧") forSegmentAtIndex:2];
    [btnStart setTitle:LocalForkey(@"开始") forState:UIControlStateNormal];
    
    [segDataType mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(88*Proportion);
        make.width.mas_equalTo(343*Proportion);
        make.height.mas_equalTo(32);
    }];
    [segDataType mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(88*Proportion);
        make.width.mas_equalTo(343*Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [labData mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.view.mas_left).offset(51*Proportion);
        make.top.mas_equalTo(segDataType.mas_bottom).offset(11*Proportion);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    
    [switchData mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(labData.mas_centerX);
        make.top.mas_equalTo(labData.mas_bottom).offset(8*Proportion);
        make.width.mas_equalTo(49);
        make.height.mas_equalTo(31);
    }];
    [labPPG mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(segDataType.mas_bottom).offset(11*Proportion);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    
    [switchPPG mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(labPPG.mas_centerX);
        make.top.mas_equalTo(labPPG.mas_bottom).offset(8*Proportion);
        make.width.mas_equalTo(49);
        make.height.mas_equalTo(31);
    }];
    
    [labPPI mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(self.view.mas_right).offset(-51*Proportion);
        make.top.mas_equalTo(segDataType.mas_bottom).offset(11*Proportion);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    
    [switchPPI mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(labPPI.mas_centerX);
        make.top.mas_equalTo(labPPI.mas_bottom).offset(8*Proportion);
        make.width.mas_equalTo(49);
        make.height.mas_equalTo(31);
    }];
    
    [btnStart mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(switchPPI.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    [myTextView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(btnStart.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(351*Proportion);
        make.height.mas_equalTo(Height -260*Proportion);
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
    BOOL end = deviceData.dataEnd;
    if(deviceData.dataType == DeviceMeasurement_HR)
    {
        NSNumber * numberHR = deviceData.dicData[@"heartRate"];
        strText  = [strText stringByAppendingFormat:@"\n heartRate:%@",numberHR];
    }
    else if (deviceData.dataType == DeviceMeasurement_Spo2)
    {
        NSNumber * numberSpo2 = deviceData.dicData[@"spo2"];
        strText  = [strText stringByAppendingFormat:@"\n spo2:%@",numberSpo2];
    }
    else if (deviceData.dataType == DeviceMeasurement_HRV)
    {
        NSNumber * numberHR = deviceData.dicData[@"heartRate"];
        NSNumber * numberHRV = deviceData.dicData[@"hrv"];
        NSNumber * numberStress = deviceData.dicData[@"stress"];
        NSNumber * numberSystolicBP = deviceData.dicData[@"highBP"];
        NSNumber * numberDiastolicBP = deviceData.dicData[@"lowBP"];
        strText  = [strText stringByAppendingFormat:@"\n heartRate:%@\n hrv:%@\n stress:%@\n BP:%@/%@",numberHR,numberHRV,numberStress,numberSystolicBP,numberDiastolicBP];
    }
    else if (deviceData.dataType == realtimePPIData)
    {
        NSNumber * numberPPI_Data = deviceData.dicData[@"PPI_Data"];
        strText  = [strText stringByAppendingFormat:@"\n PPI_Data:%@",numberPPI_Data];
    }
    else if (deviceData.dataType == realtimePPGData)
    {
        NSArray * arrayPPGData = deviceData.dicData[@"arrayPPGData"];
        strText  = [strText stringByAppendingFormat:@"\n arrayPPGData:%@",[arrayPPGData componentsJoinedByString:@","]];
    }
    myTextView.text = strText;
    
    
    
}

- (IBAction)start:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        strText = @"";
        int dataType = (int)segDataType.selectedSegmentIndex;
        BOOL open = switchData.on;
        BOOL ppgOpen = switchPPG.on;
        BOOL ppiOpen = switchPPI.on;
        NSMutableData * data = [[BleSDK sharedManager] StartDeviceMeasurementWithType:dataType+1 isOpen:open isPPG_Open:ppgOpen isPPI_Open:ppiOpen];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
    
}
- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

@end
