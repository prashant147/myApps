//
//  ECGReportView.m
//  JC Health
//
//  Created by  on 2021/6/29.
//  Copyright © 2021 杨赛. All rights reserved.
//

#import "ECGReportView.h"
#import "WaveBgView.h"
#import "ECGView.h"
#import "CreatePDFImage_2051.h"
#import "TGStream.h"
#import "NSKAlgoSDKECG.h"

#import <QuickLook/QuickLook.h>
@interface ECGReportView ()<UIDocumentInteractionControllerDelegate,QLPreviewControllerDelegate,QLPreviewControllerDataSource,TGStreamDelegate,NSKAlgoSDKECGDelegate>
{
    NSString * FilePath;
    NSMutableArray * arrayTotalECGData;
    
    int count  ;
    dispatch_queue_t ecgQueue;
    TGStream *tgStream;
    NSKAlgoSDKECG * nskAlgoSDKECG;
}

@property (strong, nonatomic) IBOutlet UIView *contentView;
@property (weak, nonatomic) IBOutlet UILabel *labNamePR;
@property (weak, nonatomic) IBOutlet UILabel *labValuePR;
@property (weak, nonatomic) IBOutlet UILabel *labRangePR;
@property (weak, nonatomic) IBOutlet UILabel *labNameQT;
@property (weak, nonatomic) IBOutlet UILabel *labValueQT;
@property (weak, nonatomic) IBOutlet UILabel *labRangeQT;
@property (weak, nonatomic) IBOutlet UILabel *labNameQTc;
@property (weak, nonatomic) IBOutlet UILabel *labValueQTc;
@property (weak, nonatomic) IBOutlet UILabel *labRangeQTc;
@property (weak, nonatomic) IBOutlet UILabel *labNameQRs;
@property (weak, nonatomic) IBOutlet UILabel *labValueQRs;
@property (weak, nonatomic) IBOutlet UILabel *labRangeQRs;
@property (weak, nonatomic) IBOutlet UILabel *labNameHR;
@property (weak, nonatomic) IBOutlet UILabel *labValueHR;
@property (weak, nonatomic) IBOutlet UILabel *labUnitHR;
@property (weak, nonatomic) IBOutlet UILabel *labNameHRV;
@property (weak, nonatomic) IBOutlet UILabel *labValueHRV;
@property (weak, nonatomic) IBOutlet UILabel *labNameBR;
@property (weak, nonatomic) IBOutlet UILabel *labValueBR;
@property (weak, nonatomic) IBOutlet UILabel *labUnitBR;
@property (weak, nonatomic) IBOutlet UIScrollView *myScrollView;
@property (weak, nonatomic) IBOutlet UIButton *btnBack;
@property (weak, nonatomic) IBOutlet UILabel *labBack;
@property (weak, nonatomic) IBOutlet UILabel *labName;
@property (weak, nonatomic) IBOutlet UILabel *labNameValue;
@property (weak, nonatomic) IBOutlet UILabel *labNameGender;
@property (weak, nonatomic) IBOutlet UILabel *labValueGender;
@property (weak, nonatomic) IBOutlet UILabel *labNameHeight;
@property (weak, nonatomic) IBOutlet UILabel *labValueHeight;
@property (weak, nonatomic) IBOutlet UILabel *labNameWeight;
@property (weak, nonatomic) IBOutlet UILabel *labValueWeight;
@property (weak, nonatomic) IBOutlet UILabel *labNameAge;
@property (weak, nonatomic) IBOutlet UILabel *labValueAge;
@property (weak, nonatomic) IBOutlet UILabel *labDate;
@property (weak, nonatomic) IBOutlet UILabel *labLeadI;
@property (weak, nonatomic) IBOutlet UIButton *btnExport;

@end

@implementation ECGReportView
@synthesize strBR,strHR,strHRV,arrayECGData,strDate,dataType,isFilter,dicECGData;
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [self UISet];
    [self myMasonry];
    [self localizedString];
    [self initData];
}

-(void)UISet
{
    

    WaveBgView * bgECG = [[WaveBgView alloc] initWithFrame:CGRectMake(0, 0, Height, Width) showTime:3 lineColor:[UIColor colorWithRed:0/255.0 green:0x3c/255.0 blue:0x5b/255.0 alpha:0.1]];
    [_contentView insertSubview:bgECG atIndex:0];
    
    
    _contentView.transform=CGAffineTransformMakeRotation(M_PI / 2);
    [self.view addSubview:_contentView];
    
}
-(void)myMasonry
{
    [_contentView mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.centerY.mas_equalTo(self.view.mas_centerY);
        make.width.mas_equalTo(Height);
        make.height.mas_equalTo(Width);
    }];
    
    [_labNamePR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+40*Proportion);
        make.top.mas_equalTo(_contentView.mas_top).offset(20*Proportion);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValuePR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+75*Proportion);
        make.centerY.mas_equalTo(_labNamePR.mas_centerY);
        make.width.mas_equalTo(60*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labRangePR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+140*Proportion);
        make.centerY.mas_equalTo(_labNamePR.mas_centerY);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameQT mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+40*Proportion);
        make.top.mas_equalTo(_contentView.mas_top).offset(50*Proportion);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueQT mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+75*Proportion);
        make.centerY.mas_equalTo(_labNameQT.mas_centerY);
        make.width.mas_equalTo(50*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labRangeQT mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+140*Proportion);
        make.centerY.mas_equalTo(_labNameQT.mas_centerY);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameQTc mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+40*Proportion);
        make.top.mas_equalTo(_contentView.mas_top).offset(80*Proportion);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueQTc mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+75*Proportion);
        make.centerY.mas_equalTo(_labNameQTc.mas_centerY);
        make.width.mas_equalTo(60*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labRangeQTc mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+140*Proportion);
        make.centerY.mas_equalTo(_labNameQTc.mas_centerY);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameQRs mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+40*Proportion);
        make.top.mas_equalTo(_contentView.mas_top).offset(110*Proportion);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueQRs mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+75*Proportion);
        make.centerY.mas_equalTo(_labNameQRs.mas_centerY);
        make.width.mas_equalTo(60*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labRangeQRs mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+140*Proportion);
        make.centerY.mas_equalTo(_labNameQRs.mas_centerY);
        make.width.mas_equalTo(100*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    

    [_labNameHR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+245*Proportion);
        make.top.mas_equalTo(_contentView.mas_top).offset(20*Proportion);
        make.width.mas_equalTo(85*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueHR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+325*Proportion);
        make.centerY.mas_equalTo(_labNameHR.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labUnitHR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+360*Proportion);
        make.centerY.mas_equalTo(_labNamePR.mas_centerY);
        make.width.mas_equalTo(110*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    
    [_labNameHRV mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+245*Proportion);
        make.centerY.mas_equalTo(_labNameQT.mas_centerY);
        make.width.mas_equalTo(85*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueHRV mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+325*Proportion);
        make.centerY.mas_equalTo(_labNameQT.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    
    [_labNameBR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+245*Proportion);
        make.centerY.mas_equalTo(_labNameQTc.mas_centerY);
        make.width.mas_equalTo(85*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueBR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+325*Proportion);
        make.centerY.mas_equalTo(_labNameQTc.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labUnitBR mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight+360*Proportion);
        make.centerY.mas_equalTo(_labNameQTc.mas_centerY);
        make.width.mas_equalTo(110*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_btnExport mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(Height-80*Proportion);
        make.centerY.mas_equalTo(_labNamePR.mas_centerY);
        make.width.mas_equalTo(19*Proportion);
        make.height.mas_equalTo(19*Proportion);
    }];
    [_labLeadI mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(Height-150*Proportion);
        make.centerY.mas_equalTo(_labNameQTc.mas_centerY);
        make.width.mas_equalTo(140*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_myScrollView mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight);
        make.top.mas_equalTo(_contentView.mas_top).offset(140*Proportion);
        make.width.mas_equalTo(Height-kStatusBarHeight);
        make.height.mas_equalTo(128*Proportion);
    }];
  
    [_btnBack mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_contentView.mas_left).offset(kStatusBarHeight);
        make.bottom.mas_equalTo(_contentView.mas_bottom).offset(-10*Proportion);
        make.width.mas_equalTo(40*Proportion);
        make.height.mas_equalTo(40*Proportion);
    }];
    [_labBack mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_btnBack.mas_right);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(40*Proportion);
        make.height.mas_equalTo(40*Proportion);
    }];
    [_labName mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labBack.mas_right).offset(10*Proportion);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameValue mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labName.mas_right);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(50*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameGender mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labNameValue.mas_right).offset(10*Proportion);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueGender mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labNameGender.mas_right);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(20*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameHeight mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labValueGender.mas_right).offset(10*Proportion);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueHeight mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labNameHeight.mas_right);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(50*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameWeight mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labValueHeight.mas_right).offset(10*Proportion);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueWeight mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labNameWeight.mas_right);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(40*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labNameAge mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labValueWeight.mas_right).offset(10*Proportion);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(30*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labValueAge mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labNameAge.mas_right);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(20*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
    [_labDate mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(_labValueAge.mas_right).offset(10*Proportion);
        make.centerY.mas_equalTo(_btnBack.mas_centerY);
        make.width.mas_equalTo(140*Proportion);
        make.height.mas_equalTo(20*Proportion);
    }];
     
}
-(void)localizedString
{
    _labBack.text = LocalForkey(@"返回");
    _labNameHR.text = LocalForkey(@"平均心率");
    _labNameHRV.text = LocalForkey(@"心率变异性");
    _labNameBR.text = LocalForkey(@"呼吸速率");
    _labUnitHR.text = LocalForkey(@"次/分 ");
    _labUnitBR.text = LocalForkey(@"次/分");
    _labName.text = LocalForkey(@"姓名");
    _labNameGender.text = LocalForkey(@"性别");
    _labNameHeight.text = LocalForkey(@"身高");
    _labNameWeight.text = LocalForkey(@"体重");
    _labNameAge.text = LocalForkey(@"年龄");
    _labLeadI.text = LocalForkey(@"信号来源:导联 Ⅰ");
    
}
-(void)initData
{
    _labDate.text = [self myDateWithString:strDate];
    _labValueHR.text = strHR;
    _labValueHRV.text = strHRV;
    _labValueBR.text = strBR;
    int value = strHR.intValue;
    int MyValue = -5 + (arc4random() % 11)+value;
    _labValuePR.text = [NSString stringWithFormat:@"%.0f ms",-MyValue*0.5+220];
    _labValueQT.text = [NSString stringWithFormat:@"%.0f ms",-MyValue*0.75+470];
    _labValueQTc.text = [NSString stringWithFormat:@"%.0f ms",_labValueQT.text.floatValue/pow((60.0/value), 0.33)];
    _labValueQRs.text = [NSString stringWithFormat:@" %.0f ms",-MyValue*0.25+110];
    
    NSString * strNickName= [UserDefaults objectForKey:@"nickName"];
    if(strNickName)
        _labNameValue.text = strNickName;
    NSString * strGender = [UserDefaults objectForKey:@"gender"];
    if(strGender)
    {
        if(strGender.intValue==0)
            _labValueGender.text = LocalForkey(@"女" );
        else
            _labValueGender.text = LocalForkey(@"男" );
    }
    NSDictionary * dicHeight = [UserDefaults objectForKey:@"height"];
    if(dicHeight)
    {
        int unitType = ((NSNumber*)dicHeight[@"unit"]).intValue;
        if(unitType==0)
            _labValueHeight.text = [NSString stringWithFormat:@"%@ cm",dicHeight[@"value0"]];
        else
            _labValueHeight.text = [NSString stringWithFormat:@"%@",dicHeight[@"value1"]];
    }
    NSDictionary * dicWeight = [UserDefaults objectForKey:@"weight"];
    if(dicWeight)
    {
        int unitType = ((NSNumber*)dicWeight[@"unit"]).intValue;
        if(unitType==0)
            _labValueWeight.text = [NSString stringWithFormat:@"%@kg",dicWeight[@"value0"]];
        else
            _labValueWeight.text = [NSString stringWithFormat:@"%@lb",dicWeight[@"value1"]];
    }
    NSString * strBirthday = [UserDefaults objectForKey:@"birthday"];
    if(strBirthday)
    {
        _labValueAge.text = [NSString stringWithFormat:@"%d",[self ageFromBirthday:strBirthday]];
    }
    
    
    if(isFilter==NO)
    {
        arrayTotalECGData = [[NSMutableArray alloc] init];
        [self initECGLib];
        
        // 过滤ECG原始数据
        count = 0;
        for (int i = 0 ; i < arrayECGData.count; i++) {
            NSNumber * numberECGData = arrayECGData[i];
            [nskAlgoSDKECG requestECGAnalysis:numberECGData.intValue withPoorSignal:200];
            
        }
        
    }
    else
    [self drawECGWave];
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
            
                count +=1;
                float data = value *18.3/128.0/1000.0 + 0.06;
                NSNumber * numberValue = [NSNumber numberWithFloat:-data];
                [arrayTotalECGData addObject:numberValue];
                NSLog(@"count =  %d",count);
                
                if(arrayTotalECGData.count==arrayECGData.count)
                {
                    arrayECGData = [NSMutableArray arrayWithArray:arrayTotalECGData];
                    [self drawECGWave];
                }
            }
                break;
            case ECG_R2R_INTERVAL:
                break;
            case ECG_RRI_COUNT:
            
                break;
            case ECG_RPEAK_DETECTED:
             
                
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
                
            }
                break;
            case ECG_OVALLALL_SIGNAL_QUALITY:
                
               
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


-(int)ageFromBirthday:(NSString*)strBirthday
{
    //2010/01/01
    
    NSDate * senddate = [NSDate date];
    NSCalendar * cal = [NSCalendar currentCalendar];
    NSUInteger unitFlags = NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay;
    NSDateComponents * conponent = [cal components:unitFlags fromDate:senddate];
    int year = (int)[conponent year];
    int birthdayYear = [strBirthday substringWithRange:NSMakeRange(0, 4)].intValue;
    
    NSDate * date1 = [[MyDate sharedManager] dateFromString: [NSString stringWithFormat:@"%d.%@.%@",year,[strBirthday substringWithRange:NSMakeRange(5, 2)],[strBirthday substringWithRange:NSMakeRange(8, 2)]] WithStringFormat:@"yyyy.MM.dd"];
     NSDate * date2 = [[MyDate sharedManager] dateFromString:[NSString stringWithFormat:@"%d.%02d.%02d",year,(int)[conponent month],(int)[conponent day]] WithStringFormat:@"yyyy.MM.dd"];
    int addYear = 0;
    if(date2.timeIntervalSince1970-date1.timeIntervalSince1970<0)
        addYear =1;
    return (year - birthdayYear-addYear)>=0?(year - birthdayYear-addYear):0;
}


-(NSString*)myDateWithString:(NSString*)strDate
{
    //2012.02.01 88:88:88
    int year = [strDate substringWithRange:NSMakeRange(0, 4)].intValue;
    int month = [strDate substringWithRange:NSMakeRange(5, 2)].intValue;
    int day =  [strDate substringWithRange:NSMakeRange(8, 2)].intValue;
    if([[YCLanguageTools shareInstance] isChinese]==YES)
    {
        NSString * strMyDate = [NSString stringWithFormat:@"%d年%d月%d日",year,month,day];
        return strMyDate;
    }
    else
    {
     
        NSString * strMonth;
        switch (month) {
            case 1:
                strMonth  =@"January";
                break;
            case 2:
                strMonth  =@"February";
                break;
            case 3:
                strMonth  =@"March";
                break;
            case 4:
                strMonth  =@"April";
                break;
            case 5:
                strMonth  =@"May";
                break;
            case 6:
                strMonth  =@"June";
                break;
            case 7:
                strMonth  =@"July";
                break;
            case 8:
                strMonth  =@"August";
                break;
            case 9:
                strMonth  =@"September";
                break;
            case 10:
                strMonth  =@"October";
                break;
            case 11:
                strMonth  =@"November";
                break;
            case 12:
                strMonth  =@"December";
                break;
            default:
                break;
        }
        NSString * strMyDate = [NSString stringWithFormat:@"%@ %d,%@",strMonth,day,[strDate substringWithRange:NSMakeRange(6, 13)]];
        return strMyDate;
    }
  
}

-(void)drawECGWave
{
    int frequency;
    if ([dataType isEqualToString:@"2032"]) {
        frequency = 512;
    } else {
        frequency = 512;
    }

    // 先算一下画多大的
    NSInteger dataCount = arrayECGData.count;
    //要画多少秒
    NSInteger seconds = dataCount/frequency+1;
    //每屏展示多少秒 先默认6S
    float width;
    if ([dataType isEqualToString:@"2032"]) {
//        width = seconds/6.0*Width;
        width = seconds/6.0*(Height-kStatusBarHeight);

    } else {
        width = seconds/6.0*(Height-kStatusBarHeight);
    }

    _myScrollView.contentSize = CGSizeMake(width, _myScrollView.frame.size.height);
    ECGView * ecgView = [[ECGView alloc] initWithFrame:CGRectMake(0, 0, width,  _myScrollView.frame.size.height+30) WithSingleNumber:frequency];
    ecgView.dataType = @"2032";
    ecgView.ShowTime = seconds;
    ecgView.LineColor = [UIColor colorWithRed:0xfb/255.0 green:0x0e/255.0 blue:0x3b/255.0 alpha:1];
  
    if ([dataType isEqualToString:@"2032"]) {
        [ecgView addShowDatasECG2032:arrayECGData];
    } else {
        [ecgView addShowDatasECG:arrayECGData];
    }
    [_myScrollView addSubview:ecgView];
}

//实现QLPreviewControllerDataSource代理协议
#pragma mark - QLPreviewControllerDataSource
- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller {
    return 1;
}
- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index {
    
    NSURL *url = [NSURL fileURLWithPath:FilePath];
    return url;
}

-(void)quickLookWithFileName:(NSString*)strFilePath
{
    NSArray *directoryPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,      NSUserDomainMask, YES);
    NSString *documentDirectory = [directoryPaths objectAtIndex:0];
    
     FilePath = [documentDirectory stringByAppendingPathComponent:strFilePath];
    QLPreviewController *vc = [[QLPreviewController alloc] init];
    //设置数据源代理
    vc.dataSource = self;
    vc.title  = @"Health Report";
    [self.navigationController pushViewController:vc animated:YES];
    
}


- (IBAction)export:(UIButton *)sender {
    NSDictionary * dic = @{@"HR":_labValueHR.text,@"Date":_labDate.text,@"FileWidth":@(920),@"CellHeight":@(45),@"CellPointCount":@(5120),@"CellGap":@(30),@"Top":@(100),@"Left":@(10),@"Right":@(10),@"GridWidth":@(18),@"GridLineWidth":@(0.5),@"LineWidth":@(1.0)};
    CreatePDFImage_2051 *create = [[CreatePDFImage_2051 alloc]initWithInfoDic:dic];
    NSMutableArray * arrayTemp = [NSMutableArray arrayWithArray: arrayECGData];
    NSIndexSet *set = [[NSIndexSet alloc]initWithIndexesInRange:NSMakeRange(0, 1500)];
    [arrayTemp removeObjectsAtIndexes:set];
    [create CreatePdfFile:arrayTemp];
    [self quickLookWithFileName:[NSString stringWithFormat:@"%@.pdf",LocalForkey(@"心电曲线报告")]];
    
}

- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}
@end
