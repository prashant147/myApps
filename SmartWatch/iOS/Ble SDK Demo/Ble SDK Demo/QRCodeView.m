//
//  QRCodeView.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/27.
//

#import "QRCodeView.h"
#import "QiCodeScanningViewController.h"

@interface QRCodeView ()<MyBleDelegate>
{
    BOOL connect ;
    NSString * strMacAddress;
    MBProgressHUD * HUD;
}
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UIButton *btnScan;

@end

@implementation QRCodeView

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    if([[NewBle sharedManager] isConnectOrConnecting]==YES)
    [[NewBle sharedManager] Disconnect];
    [self myMasory];
}

-(void)myMasory
{
    _btnScan.layer.cornerRadius  = 10 *Proportion;
    _labTitle.text = LocalForkey(@"二维码配对");
    [_btnScan setTitle:LocalForkey(@"扫描") forState:UIControlStateNormal];
}


#pragma mark MyBleDelegate
-(void)ConnectSuccessfully
{
    
}
-(void)Disconnect:(NSError *_Nullable)error
{
    
}
-(void)scanWithPeripheral:(CBPeripheral*_Nonnull)peripheral advertisementData:(NSDictionary<NSString *, id> *_Nonnull)advertisementData RSSI:(NSNumber *_Nonnull)RSSI
{
    int value = RSSI.intValue;
    NSString * strName = peripheral.name;
    if([[advertisementData allKeys]containsObject:@"kCBAdvDataLocalName"])
        strName = advertisementData[@"kCBAdvDataLocalName"];
    
    if(value>-80&&strName.length>0)
    {
        
        if([[advertisementData allKeys]containsObject:@"kCBAdvDataManufacturerData"])
        {
            NSData * data = advertisementData[@"kCBAdvDataManufacturerData"];
            Byte * bytes  = (Byte*)data.bytes;
            if(data.length>=8)
            {
                NSString * strTempMacAddress = [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x",bytes[2],bytes[3],bytes[4],bytes[5],bytes[6],bytes[7]];
                NSLog(@"strTempMacAddress = %@",strTempMacAddress);
                if([strTempMacAddress.lowercaseString isEqualToString:strMacAddress]==YES)
                {
                    [[NewBle sharedManager] Stopscan];
                    [[NewBle sharedManager] connectDevice:peripheral];
                }
            }
        }
    }
}
-(void)ConnectFailedWithError:(nullable NSError *)error
{
    
}
-(void)EnableCommunicate
{
    //发送解除二维码
   NSMutableData  * data =  [[BleSDK sharedManager] unlockScreen];
    [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    HUD.label.text = LocalForkey(@"请在手表上点击是否配对");
}

-(void)BleCommunicateWithPeripheral:(CBPeripheral*)Peripheral data:(NSData *)data
{
    DeviceData * deviceData = [[DeviceData alloc] init];
    deviceData  = [[BleSDK sharedManager] DataParsingWithData:data];
    
    if(deviceData.dataType==clickYesWhenUnLockScreen)
    {
        connect = YES;
        HUD.label.text = LocalForkey(@"手表配对成功!");
        [HUD hideAnimated:YES afterDelay:1];
    }
   else if(deviceData.dataType==clickNoWhenUnLockScreen)
    {
        //
        HUD.label.text = LocalForkey(@"手表配对取消");
        [HUD hideAnimated:YES afterDelay:1];
        [[NewBle sharedManager] Disconnect];
        [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(checkConnect) object:nil];
        
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


- (IBAction)scan:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==NO){
        connect = NO;
        QiCodeScanningViewController*vc = [[QiCodeScanningViewController alloc]init];
        vc.sureBlock = ^(NSString* code) {
            NSLog(@"扫描结果：%@",code);
            if([code rangeOfString:@"imei"].location!=NSNotFound)
            {
                
                
                if(HUD)
                {
                    [HUD removeFromSuperview];
                    HUD = nil;
                }
                HUD = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
                HUD.label.font = [UIFont systemFontOfSize:12];
                HUD.label.text = LocalForkey(@"正在配对...");
                [self performSelector:@selector(checkConnect) withObject:nil afterDelay:20];
                NSUInteger location = [code rangeOfString:@"imei"].location;
                strMacAddress = [code substringWithRange:NSMakeRange(location+5, 12)];
                // strMacAddress = @"698700000000";
                //然后开始搜索对应的设备
                [self getDevices];
            }
            else
                [PishumToast showToastWithMessage:LocalForkey(@"二维码错误") Length:TOAST_SHORT ParentView:self.view];
            
        };
        vc.hidesBottomBarWhenPushed = YES;
        [self.navigationController pushViewController:vc animated:YES];
        
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备已连接") Length:TOAST_SHORT ParentView:self.view];
}

-(void)getDevices
{
    
    
    [[NewBle sharedManager] startScanningWithServices:nil];
    
}

-(void)checkConnect
{
    if([[NewBle sharedManager] isConnectOrConnecting]==NO||connect==NO)
    {
        HUD.label.text = LocalForkey(@"配对失败...");
        [[NewBle sharedManager] Stopscan];
        
        [HUD hideAnimated:YES afterDelay:0.01];
       
    }
}

@end
