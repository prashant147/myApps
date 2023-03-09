//
//  spo2HistoryData.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/22.
//

#import "spo2HistoryData.h"

@interface spo2HistoryData ()<MyBleDelegate>
{
    int count;
    NSString * strText;
}
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UISegmentedControl *segDadaType;
@property (weak, nonatomic) IBOutlet UITextView *textViewData;
@property (weak, nonatomic) IBOutlet UIButton *btnGetData;
@property (weak, nonatomic) IBOutlet UIButton *btnDeleteData;
@end

@implementation spo2HistoryData

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    [self myMasonry];
    
}

-(void)myMasonry
{
    
    _labTitle.text = LocalForkey(@"血氧数据");
    [_segDadaType setTitle:LocalForkey(@"自动血氧") forSegmentAtIndex:0];
    [_segDadaType setTitle:LocalForkey(@"手动血氧") forSegmentAtIndex:1];
    [_btnGetData setTitle:LocalForkey(@"获取数据") forState:UIControlStateNormal];
    [_btnDeleteData setTitle:LocalForkey(@"删除数据") forState:UIControlStateNormal];
    _btnGetData.layer.cornerRadius  = 10 * Proportion;
    _btnDeleteData.layer.cornerRadius  = 10 * Proportion;
    [_segDadaType mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(95*Proportion);
        make.width.mas_equalTo(350*Proportion);
        make.height.mas_equalTo(32);
    }];
    
    [_textViewData mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(_segDadaType.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(350*Proportion);
        make.height.mas_equalTo(Height-220*Proportion);
    }];
    
    [_btnGetData mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(20*Proportion);
        make.bottom.mas_equalTo(self.view.mas_bottom).offset(-20*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    [_btnDeleteData mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.right.mas_equalTo(self.view.mas_right).offset(-20*Proportion);
        make.centerY.mas_equalTo(_btnGetData.mas_centerY);
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
    BOOL end = deviceData.dataEnd;
    if(deviceData.dataType == AutomaticSpo2Data)
    {
        
        count +=1;
        NSDictionary * dicData = deviceData.dicData;
        NSArray * arrayAutomaticSpo2Data = dicData[@"arrayAutomaticSpo2Data"];
        for (int i = 0; i< arrayAutomaticSpo2Data.count; i++) {
            NSString * strTemp;
            NSDictionary * dic = arrayAutomaticSpo2Data[i];
            strTemp = [NSString stringWithFormat:@"date : %@\nautomaticSpo2Data : %@\n\n\n",dic[@"date"],dic[@"automaticSpo2Data"]];
            strText  = [strText stringByAppendingString:strTemp];
        }
        if(count==50&&end==NO)
        {
            // 继续读取剩下的数据
            NSData * data = [[BleSDK sharedManager] GetAutomaticSpo2DataWithMode:2 withStartDate:nil];
            [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
        }
        else if(end==YES)
        {
            
            if(strText.length>0)
                _textViewData.text = strText;
            else
                _textViewData.text = LocalForkey(@"无数据");
        }
    }
    if(deviceData.dataType == ManualSpo2Data)
    {
        count +=1;
        NSDictionary * dicData = deviceData.dicData;
        NSArray * arrayManualSpo2Data = dicData[@"arrayManualSpo2Data"];
        for (int i = 0; i< arrayManualSpo2Data.count; i++) {
            NSString * strTemp;
            NSDictionary * dic = arrayManualSpo2Data[i];
            strTemp = [NSString stringWithFormat:@"date : %@\nmanualSpo2Data : %@\n\n\n",dic[@"date"],dic[@"manualSpo2Data"]];
            strText  = [strText stringByAppendingString:strTemp];
        }
        
        if(count==50&&end==NO)
        {
            // 继续读取剩下的数据
            NSData * data = [[BleSDK sharedManager] GetManualSpo2DataWithMode:2 withStartDate:nil];
            [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
        }
        else if(end==YES)
        {
            
            if(strText.length>0)
                _textViewData.text = strText;
            else
                _textViewData.text = LocalForkey(@"无数据");
        }
    }
    
    
    
}


- (IBAction)getData:(UIButton *)sender {
    
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        
            count = 0;
            _textViewData.text = LocalForkey(@"正在读取数据");
            strText = @"";
        NSData * data;
        if(_segDadaType.selectedSegmentIndex==0)
            data = [[BleSDK sharedManager] GetAutomaticSpo2DataWithMode:0 withStartDate:nil];
        else
            data = [[BleSDK sharedManager] GetManualSpo2DataWithMode:0 withStartDate:nil];
        
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];

}

- (IBAction)deleteData:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        count = 0;
        _textViewData.text = LocalForkey(@"正在删除数据");
        strText = @"";
        NSData * data;
        if(_segDadaType.selectedSegmentIndex==0)
            data = [[BleSDK sharedManager] GetAutomaticSpo2DataWithMode:0x99 withStartDate:nil];
        else
            data = [[BleSDK sharedManager] GetManualSpo2DataWithMode:0x99 withStartDate:nil];
        
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}
- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}
@end
