//
//  EcgAndPPGView.m
//  BleSDKDemo
//
//  Created by  on 2020/4/22.
//  Copyright © 2020 杨赛. All rights reserved.
//

#import "EcgAndPPGView.h"
#import "ECGReportView.h"
@interface EcgAndPPGView ()<MyBleDelegate,TGStreamDelegate,NSKAlgoSDKECGDelegate>
{
    //ECG
       dispatch_queue_t ecgQueue;
       TGStream *tgStream;
       NSKAlgoSDKECG * nskAlgoSDKECG;
    CustomeChartView * chartView_ECG;
    __weak IBOutlet UILabel *labHeartRate;
    __weak IBOutlet UILabel *labHRV;
    
    NSMutableArray * arrayECGData;
    NSMutableArray * arrayAllECGData;
    NSMutableArray * arraySignal;
    
}
@property (weak, nonatomic) IBOutlet UIButton *btnStart;
@property (weak, nonatomic) IBOutlet UIButton *btnStop;
@property (weak, nonatomic) IBOutlet UILabel *labHRName;
@property (weak, nonatomic) IBOutlet UILabel *labHRVName;

@end

@implementation EcgAndPPGView

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    arrayECGData = [[NSMutableArray alloc] init];
    arraySignal = [[NSMutableArray alloc] init];
    arrayAllECGData = [[NSMutableArray alloc] init];
    [NewBle sharedManager].delegate = self;
    [self initECGLib];
    [self addECGAndPPGView];
    [self myMasonry];
}


-(void)myMasonry
{
    [_btnStart mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(20*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(125*Proportion);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    [_btnStop mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.right.mas_equalTo(self.view.mas_right).offset(-20*Proportion);
        make.centerY.mas_equalTo(_btnStart.mas_centerY);
        make.width.mas_equalTo(160*Proportion);
        make.height.mas_equalTo(50*Proportion);
    }];
    [_labHRName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_btnStart.mas_left);
        make.top.mas_equalTo(_btnStart.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [labHeartRate mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labHRName.mas_right).offset(5*Proportion);
        make.centerY.mas_equalTo(_labHRName.mas_centerY);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    
    [_labHRVName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_btnStop.mas_left);
        make.top.mas_equalTo(_btnStop.mas_bottom).offset(10*Proportion);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
    [labHRV mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labHRVName.mas_right).offset(5*Proportion);
        make.centerY.mas_equalTo(_labHRVName.mas_centerY);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(30*Proportion);
    }];
}

#pragma mark ECG库初始化

-(void)initECGLib
{
    tgStream =[TGStream sharedInstance];
    tgStream.delegate=self;
    NSString * licenseKey = @"4DYD5nkbZHYoJBqIxT3nc/QIB58doR7BiRxuH62Ayhs=";
    int sampleRate = 512;
    nskAlgoSDKECG = [[NSKAlgoSDKECG alloc]init];
    [nskAlgoSDKECG setDelegate:self];
    [nskAlgoSDKECG setupSDKProperty:licenseKey withSampleRate:sampleRate enableSmoothed:1];
    
    [nskAlgoSDKECG enableNSLogMessages:true];
    ecgQueue=dispatch_queue_create("ecg_queue", DISPATCH_QUEUE_SERIAL);
}

#pragma mark  TGStreamDelegate
-(void)onDataReceived:(NSInteger)datatype data:(int)data obj:(NSObject *)obj deviceType:(DEVICE_TYPE)deviceType
{
    
}
#pragma mark NSKAlgoSDKECGDelegate
- (void)dataReceived:(ECGAlgorithmsData)algo results:(int)value
{
    dispatch_async(dispatch_get_main_queue(), ^{
        switch (algo)
        {
            case ECG_SMOOTHED_WAVE:
            {
                float data = value *18.3/128.0/1000.0 + 0.06;
                NSNumber * numberValue = [NSNumber numberWithFloat:-data];
                [arrayECGData addObject:numberValue];
                [arrayAllECGData addObject:numberValue];
                if(arraySignal.count<1000)
                    [arraySignal addObject:numberValue];
                if(arrayECGData.count!=0){
                    if(arraySignal.count==1000){
                        NSNumber * maxSignal =  [arraySignal valueForKeyPath:@"@max.floatValue"];
                        NSArray * arrayTemp = [arrayECGData copy]; if(maxSignal.floatValue>0.12&&maxSignal.floatValue<0.5)
                        {
                            float amp_Coef =  0.5/maxSignal.floatValue;
                            for (int i = 0; i<arrayECGData.count; i++)
                            {
                                float dataTemp = ((NSNumber*)arrayECGData[i]).floatValue;
                                if(dataTemp>0){
                                    dataTemp *= amp_Coef;
                                    [arrayECGData replaceObjectAtIndex:i withObject:[NSNumber numberWithFloat:dataTemp]];
                                    [arrayAllECGData replaceObjectAtIndex:(arrayAllECGData.count-arrayECGData.count+i) withObject:[NSNumber numberWithFloat:dataTemp]];
                                }
                            }
                        }
                        [arraySignal removeObjectsInRange:NSMakeRange(0, 50)];
                        [arraySignal addObjectsFromArray:arrayTemp];
                    }
                    
                    [chartView_ECG addShowDatasECG:arrayECGData];
                    [arrayECGData removeAllObjects];
                }
            }
                break;
            case ECG_R2R_INTERVAL:
                NSLog(@"ECG_R2R_INTERVAL");
                break;
            case ECG_RRI_COUNT:
                
                NSLog(@"ECG_RRI_COUNT");
                break;
            case ECG_RPEAK_DETECTED:
                NSLog(@"R-peak detected.");
                
                break;
            case ECG_HEART_RATE:
            {
                
            }
                break;
            case ECG_ROBUST_HEART_RATE:
            {
                
                
            }
                break;
            case ECG_HRV:
            {
                
                
            }
                break;
            case ECG_SIGNAL_QUALITY:
            {
                //                signalStrength = value;
            }
                break;
            case ECG_OVALLALL_SIGNAL_QUALITY:
                
                NSLog(@"ECG_OVALLALL_SIGNAL_QUALITY");
                break;
            default:
                NSLog(@"Unknown ID: %lu", (unsigned long)algo);
                break;
                
        }
    });
}



-(void)exceptionECGMessage:(ECGException)excepType{
    NSLog(@"exception happend %d",(int)excepType);
}


-(void)ConnectSuccessfully
{
    
}
-(void)Disconnect:(NSError *_Nullable)error
{
    
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
    {
        DeviceData * deviceData = [[DeviceData alloc] init];
        deviceData  = [[BleSDK sharedManager] DataParsingWithData:data];
        switch (deviceData.dataType) {
            case ECG_RawData:
            {
                NSArray * arrayEcgData = deviceData.dicData[@"arrayEcgData"];
                for (int i = 0; i<arrayEcgData.count; i++) {
                    NSNumber * numberEcgData = arrayEcgData[i];
                    [nskAlgoSDKECG requestECGAnalysis:numberEcgData.intValue withPoorSignal:200];
                }
            }
                break;
         
           case ECG_Success_Result:
            {
                NSDictionary * dicData = deviceData.dicData;
                NSLog(@"ECG_Success_Result %@",deviceData.dicData);
                labHRV.text = [NSString stringWithFormat:@"%@",dicData[@"hrv"]];
                labHeartRate.text = [NSString stringWithFormat:@"%@",dicData[@"heartRate"]];
                
                
                ECGReportView *  myECGReportView = [[ECGReportView alloc] init];
                myECGReportView.strHR = [NSString stringWithFormat:@"%@",dicData[@"heartRate"]];
                myECGReportView.strHRV = [NSString stringWithFormat:@"%@",dicData[@"hrv"]];
                myECGReportView.strBR = [NSString stringWithFormat:@"%@",dicData[@"breathingRate"]];
                myECGReportView.strDate = [NSString stringWithFormat:@"%@",dicData[@"date"]];
                myECGReportView.dataType = @"2025E";
                myECGReportView.isFilter = YES;
                myECGReportView.arrayECGData = arrayAllECGData;
                [self.navigationController pushViewController:myECGReportView animated:YES];
                
                
                
                
                /* NSDictionary * dicData = [NSDictionary dictionaryWithObjectsAndKeys:strDate,@"date",@"---",@"blood",numberHR,@"heartRate",numberLowBP,@"---",numberHighBP,@"---",numberHRV,@"hrv",@"---",@"stress",numberMood,@"mood",@"---",@"breathingRate",nil];*/
                
                
                
            }
                break;
            case ECG_Failed:
            {
                NSLog(@"ecg failed");
                [PishumToast showToastWithMessage:LocalForkey(@"ECG测量失败") Length:TOAST_SHORT ParentView:self.view];
            }
                break;
            case ECG_Status:
            {
                NSLog(@"%@",deviceData.dicData[@"ecgAndPpgStatusData"]);
                [PishumToast showToastWithMessage:[NSString stringWithFormat:@"%@",deviceData.dicData[@"ecgAndPpgStatusData"]] Length:TOAST_SHORT ParentView:self.view];
                
            }
                break;
            case StartECG:
                NSLog(@"StartECG");
                break;
            case StopECG:
                NSLog(@"StopECG");
                break;
            default:
                break;
        }
    }
}

#pragma mark addECGAndPPGView
-(void)addECGAndPPGView
{

    chartView_ECG = [[CustomeChartView alloc] initWithFrame:CGRectMake(0, 260*Proportion,Width,200*Proportion) WithSingleNumber:512 WithMaxSeconds:3];
    //fb0e3b
    chartView_ECG.LineColor = [UIColor colorWithRed:0xfb/255.0 green:0x0e/255.0 blue:0x3b/255.0 alpha:1];
    chartView_ECG.LineWidth = 1.0;
    chartView_ECG.blankCount = 200;
    [self.view addSubview:chartView_ECG];
    

}

- (IBAction)start:(UIButton *)sender {
    
    [arrayECGData removeAllObjects];
    [arrayAllECGData removeAllObjects];
    
   NSMutableData * data = [[BleSDK sharedManager] StartECGMode];
    [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];

}

- (IBAction)stop:(UIButton *)sender {
    NSMutableData * data = [[BleSDK sharedManager] StopECGMode];
    [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
}

- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}


- (IBAction)btnStart:(id)sender {
}
@end
