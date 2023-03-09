//
//  deviceName.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/21.
//

#import "deviceName.h"

@interface deviceName ()<MyBleDelegate>
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UITextField *textFieldDeviceName;
@property (weak, nonatomic) IBOutlet UIButton *btnGetDeviceName;
@property (weak, nonatomic) IBOutlet UIButton *btnSetDeviceName;
@end

@implementation deviceName

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    [self myMasonry];
}
-(void)myMasonry
{
    _labTitle.text = LocalForkey(@"设备名字");
    _textFieldDeviceName.placeholder = LocalForkey(@"设备名字");
    [_btnGetDeviceName setTitle:LocalForkey(@"获取设备名字") forState:UIControlStateNormal];
    [_btnSetDeviceName setTitle:LocalForkey(@"设置设备名字") forState:UIControlStateNormal];
    _btnGetDeviceName.layer.cornerRadius  = 10 * Proportion;
    _btnSetDeviceName.layer.cornerRadius  = 10 * Proportion;
    [_textFieldDeviceName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(150*Proportion);
        make.width.mas_equalTo(200*Proportion);
        make.height.mas_equalTo(40*Proportion);
    }];
  
    
    [_btnSetDeviceName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(20*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(280*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    [_btnGetDeviceName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.right.mas_equalTo(self.view.mas_right).offset(-20*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(280*Proportion);
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
    if(deviceData.dataType == SetDeviceName)
    {
        [PishumToast showToastWithMessage:LocalForkey(@"设置设备名字成功") Length:TOAST_SHORT ParentView:self.view];
    }
    else if(deviceData.dataType == GetDeviceName)
    {
        NSDictionary * dicData = deviceData.dicData;
        _textFieldDeviceName.text = dicData[@"deviceName"];

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

#pragma mark UITextFieldDelegate

- (BOOL)textField:(UITextField*)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString*)string
{
    //
   
    //密码长度限制
        if (range.length == 1 && string.length == 0) {
            return YES;
        }  else if (textField.text.length >= 12) {
            
            textField.text = [textField.text substringToIndex:12];
            return NO;
        }
   
    //只能是数字和英文
    NSCharacterSet * cs = [[NSCharacterSet characterSetWithCharactersInString:DEVICE_NAME] invertedSet];
    NSString *filtered = [[string componentsSeparatedByCharactersInSet:cs] componentsJoinedByString:@""];
    return [string isEqualToString:filtered];
    
    
}

-(BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return  YES;
}

- (IBAction)setDeviceName:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSString * strDeviceName =  _textFieldDeviceName.text;
        NSMutableData * data = [[BleSDK sharedManager] SetDeviceName:strDeviceName];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
    
}
- (IBAction)getDeviceName:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSMutableData * data = [[BleSDK sharedManager] GetDeviceName];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}

- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

@end
