//
//  SetWeather.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/27.
//

#import "SetWeather.h"

@interface SetWeather ()<MyBleDelegate>
{
    NSArray * arrayWeatherType;
}

@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UITextField *textFieldCityName;
@property (weak, nonatomic) IBOutlet UITextField *textFieldCurrentTemperature;
@property (weak, nonatomic) IBOutlet UITextField *textFieldHighTemperature;
@property (weak, nonatomic) IBOutlet UITextField *textFieldLowTemperature;
@property (weak, nonatomic) IBOutlet UILabel *labWeatherType;
@property (weak, nonatomic) IBOutlet UIPickerView *pickerViewWeatherType;
@property (weak, nonatomic) IBOutlet UIButton *btnSetWeather;

@end

@implementation SetWeather

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    
    if(arrayWeatherType==nil)
    {
        NSArray * array = [NSArray arrayWithArray:[[[NSDictionary alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"weahterType" ofType:@"plist"]] objectForKey:@"Weather"]];
        NSMutableArray * arrayTemp = [[NSMutableArray alloc] init];
        for (int i = 0; i < array.count; i++) {
            [arrayTemp addObject:((NSString*)array[i]).lowercaseString];
        }
        arrayWeatherType = [NSArray arrayWithArray:arrayTemp];
    }
    [self myMasonry];
}

-(void)myMasonry
{
    _labTitle.text = LocalForkey(@"天气设置");
    [_btnSetWeather setTitle:LocalForkey(@"设置天气") forState:UIControlStateNormal];
    _labWeatherType.text = LocalForkey(@"天气类型");
    _textFieldCityName.placeholder = LocalForkey(@"城市名称");
    _textFieldCurrentTemperature.placeholder = LocalForkey(@"当前气温(℃)");
    _textFieldHighTemperature.placeholder = LocalForkey(@"最高气温(℃)");
    _textFieldLowTemperature.placeholder = LocalForkey(@"最低气温(℃)");
    _btnSetWeather.layer.cornerRadius  = 10 * Proportion;
    [_textFieldCityName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(120*Proportion);
        make.width.mas_equalTo(234*Proportion);
        make.height.mas_equalTo(34*Proportion);
    }];
    [_textFieldCurrentTemperature mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_textFieldCityName.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(234*Proportion);
        make.height.mas_equalTo(34*Proportion);
    }];
    [_textFieldHighTemperature mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_textFieldCurrentTemperature.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(234*Proportion);
        make.height.mas_equalTo(34*Proportion);
    }];
    [_textFieldLowTemperature mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_textFieldHighTemperature.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(234*Proportion);
        make.height.mas_equalTo(34*Proportion);
    }];
    
    [_labWeatherType mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_textFieldLowTemperature.mas_bottom).offset(30*Proportion);
        make.width.mas_equalTo(300*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_pickerViewWeatherType mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_labWeatherType.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(Width);
        make.height.mas_equalTo(160*Proportion);
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
    if(deviceData.dataType == setWeather)
    {
        
        [PishumToast showToastWithMessage:LocalForkey(@"设置天气成功!") Length:TOAST_SHORT ParentView:self.view];
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

#pragma mark PickViewDelegate
#pragma mark UIPickViewDataResource
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    return 1;
}

- (CGFloat)pickerView:(UIPickerView *)pickerView rowHeightForComponent:(NSInteger)component

{
    return 40*Proportion;
}



// returns the # of rows in each component..
- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component
{
    return arrayWeatherType.count;
}


- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView *)view
{
    
    UILabel *myView = nil;
    myView = [[UILabel alloc] initWithFrame:CGRectMake(0.0, 0.0, Width, 40*Proportion)];
    myView.textAlignment = NSTextAlignmentCenter;
    myView.text = [NSString stringWithFormat:@"%@",[arrayWeatherType objectAtIndex:row]];
    myView.font = [UIFont systemFontOfSize:30];         //用label来设置字体大小
    myView.backgroundColor = [UIColor clearColor];
    
    
    
    return myView;
}

#pragma mark UITextFieldDelegate

- (BOOL)textField:(UITextField*)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString*)string
{
    //
    
    if(textField.tag>0){
        //密码长度限制
        if (range.length == 1 && string.length == 0) {
            return YES;
        }  else if (textField.text.length >= 3) {
            
            textField.text = [textField.text substringToIndex:3];
            return NO;
        }
        
        //只能是数字和英文
        NSCharacterSet * cs = [[NSCharacterSet characterSetWithCharactersInString:TEMPERATURE] invertedSet];
        NSString *filtered = [[string componentsSeparatedByCharactersInSet:cs] componentsJoinedByString:@""];
        return [string isEqualToString:filtered];
    }
    else
        return YES;
    
    
}

-(BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return  YES;
}


- (IBAction)setWeather:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        
        if(_textFieldCityName.text.length>0&&_textFieldCurrentTemperature.text.length>0&&_textFieldLowTemperature.text.length>0&&_textFieldHighTemperature.text.length>0){
            MyWeatherParameter   weatherParameter;
            weatherParameter.strCity = _textFieldCityName.text;
            weatherParameter.weatherType = (int)[_pickerViewWeatherType selectedRowInComponent:0];
            weatherParameter.currentTemperature = _textFieldCurrentTemperature.text.intValue;
            weatherParameter.highestTemperature = _textFieldHighTemperature.text.intValue;
            weatherParameter.lowestTemperature = _textFieldLowTemperature.text.intValue;
            NSMutableData * data = [[BleSDK sharedManager] setWeather:weatherParameter];
            [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
        }
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}


@end
