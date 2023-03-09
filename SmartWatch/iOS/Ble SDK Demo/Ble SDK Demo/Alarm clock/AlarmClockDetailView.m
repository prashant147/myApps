//
//  AlarmClockDetailView.m
//  JC Health
//
//  Created by  on 2020/12/17.
//  Copyright © 2020 杨赛. All rights reserved.
//

#import "AlarmClockDetailView.h"
#import "ClockWeekChooseView.h"
@interface AlarmClockDetailView ()<MyBleDelegate>
{
    
    
    BOOL isSetClock;
    NSMutableArray * myArrayClock;
    NSMutableDictionary * dicClock;
    int myClockType;
    int myWeekValue;
    NSNumber * openOrClose;
    
    __weak IBOutlet UIButton *btnSetAlarmClock;
    __weak IBOutlet UIDatePicker *myDatePickerView;
    __weak IBOutlet UILabel *labContentName;
    __weak IBOutlet UITextField *textFieldContent;
    __weak IBOutlet UILabel *labRepeatName;
    __weak IBOutlet UILabel *labRepeatValue;
    __weak IBOutlet UIButton *btnChooseWeeks;
    
    __weak IBOutlet UILabel *labAlarmClockType;
    __weak IBOutlet UIButton *btnNormalAlarmClock;
    __weak IBOutlet UILabel *labNormalAlarmClock;
    __weak IBOutlet UIButton *btnTakeMedicineAlarmClock;
    __weak IBOutlet UILabel *labTakeMedicineAlarmClock;
    __weak IBOutlet UIButton *btnDrinkAlarmClock;
    __weak IBOutlet UILabel *labDrinkAlarmClock;
    __weak IBOutlet UIButton *btnFoodAlarmClock;
    __weak IBOutlet UILabel *labFoodAlarmClock;
}

- (IBAction)chooseAlarmClockType:(UIButton *)sender;

@end

@implementation AlarmClockDetailView
@synthesize numberClock;
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
   
    [btnSetAlarmClock setEnlargeEdgeWithTop:30 right:30 bottom:30 left:30];
    [btnChooseWeeks setEnlargeEdgeWithTop:30 right:30 bottom:30 left:30];
    [myDatePickerView setValue:RGBA(0x4F, 0xA6, 0xAC, 1) forKey:@"textColor"];
    [self clearSeparatorWithView:myDatePickerView];
    NSString *holderText = LocalForkey(@"闹钟内容");
    NSMutableAttributedString *placeholder = [[NSMutableAttributedString alloc] initWithString:holderText];
    [placeholder addAttribute:NSForegroundColorAttributeName
                        value:RGBA(0x11, 0x11, 0x11, 0.5)
                        range:NSMakeRange(0, holderText.length)];
    [placeholder addAttribute:NSFontAttributeName
                        value:[UIFont systemFontOfSize:15]
                        range:NSMakeRange(0, holderText.length)];
    textFieldContent.attributedPlaceholder = placeholder;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
}


- (void)clearSeparatorWithView:(UIView * )view
{
    if(view.subviews != 0  )
    {
        if(view.bounds.size.height < 5)
        {
            view.backgroundColor = [UIColor clearColor];
        }
        
        [view.subviews enumerateObjectsUsingBlock:^( UIView *  obj, NSUInteger idx, BOOL *  stop) {
            [self clearSeparatorWithView:obj];
        }];
    }
}
    


-(void)myMasonry
{
    [btnNormalAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(38*Proportion);
        make.top.mas_equalTo(self.view.mas_top).offset(510*Proportion);
        make.width.mas_equalTo(35 * Proportion);
        make.height.mas_equalTo(31 * Proportion);
    }];
    [labNormalAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(btnNormalAlarmClock.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(545*Proportion);
        make.width.mas_equalTo(90 * Proportion);
        make.height.mas_equalTo(40 * Proportion);
    }];
    
    [btnTakeMedicineAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(125*Proportion);
        make.centerY.mas_equalTo(btnNormalAlarmClock.mas_centerY);
        make.width.mas_equalTo(35 * Proportion);
        make.height.mas_equalTo(31 * Proportion);
    }];
    [labTakeMedicineAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(btnTakeMedicineAlarmClock.mas_centerX);
        make.centerY.mas_equalTo(labNormalAlarmClock.mas_centerY);
        make.width.mas_equalTo(90 * Proportion);
        make.height.mas_equalTo(40 * Proportion);
    }];
    
    [btnDrinkAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(214*Proportion);
        make.centerY.mas_equalTo(btnNormalAlarmClock.mas_centerY);
        make.width.mas_equalTo(35 * Proportion);
        make.height.mas_equalTo(31 * Proportion);
    }];
    [labDrinkAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(btnDrinkAlarmClock.mas_centerX);
        make.centerY.mas_equalTo(labNormalAlarmClock.mas_centerY);
        make.width.mas_equalTo(90 * Proportion);
        make.height.mas_equalTo(40 * Proportion);
    }];
    
    [btnFoodAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.left.mas_equalTo(self.view.mas_left).offset(302*Proportion);
        make.centerY.mas_equalTo(btnNormalAlarmClock.mas_centerY);
        make.width.mas_equalTo(35 * Proportion);
        make.height.mas_equalTo(31 * Proportion);
    }];
    [labFoodAlarmClock mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(btnFoodAlarmClock.mas_centerX);
        make.centerY.mas_equalTo(labNormalAlarmClock.mas_centerY);
        make.width.mas_equalTo(90 * Proportion);
        make.height.mas_equalTo(40 * Proportion);
    }];
}

-(void)localizedString
{
    labContentName.text = LocalForkey(@"标签");
    labRepeatName.text  = LocalForkey(@"重复");
    labAlarmClockType.text = LocalForkey(@"闹钟类型");
    labNormalAlarmClock.text = LocalForkey(@"普通闹钟");
    labTakeMedicineAlarmClock.text = LocalForkey(@"吃药闹钟");
    labDrinkAlarmClock.text = LocalForkey(@"喝水闹钟");
    labFoodAlarmClock.text = LocalForkey(@"吃饭闹钟");
}

-(void)initData
{
    myArrayClock = [[NSMutableArray alloc] init];
    NSMutableArray * arrayClock = [UserDefaults objectForKey:@"arrayClock"];
    if(arrayClock)
        myArrayClock = [NSMutableArray arrayWithArray:arrayClock];
    if(numberClock<myArrayClock.count){
        dicClock = [NSMutableDictionary dictionaryWithDictionary:myArrayClock[numberClock]];
        openOrClose = dicClock[@"openOrClose"];
        NSString * strTime = dicClock[@"clockTime"];
        myDatePickerView.date = [[MyDate sharedManager] dateFromString:strTime WithStringFormat:@"HH:mm"];
        labRepeatValue.text = [self getStrWeekFromWeekValue:dicClock[@"week"]];
        myWeekValue = ((NSNumber*)dicClock[@"week"]).intValue;
        NSString * strText = ((NSString*)dicClock[@"text"]);
        if(strText.length>0)
            textFieldContent.text = strText;
        NSNumber * clockType = dicClock[@"clockType"];
        myClockType = clockType.intValue;
        [self changeClockType];
    }
    else
    {
        openOrClose = [NSNumber numberWithInt:1];
        myClockType = 1;
        myWeekValue =  62;
        labRepeatValue.text = [self getStrWeekFromWeekValue:[NSNumber numberWithInt:myWeekValue]];
        
    }    
    [NewBle sharedManager].delegate = self;
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
    if(deviceData.dataType == SetAlarmClock)
    {
        [UserDefaults setObject:myArrayClock forKey:@"arrayClock"];
        [UserDefaults synchronize];
        btnSetAlarmClock.enabled  = YES;
        [PishumToast showToastWithMessage:LocalForkey(@"设置闹钟成功") Length:TOAST_SHORT ParentView:self.view];
        [self performSelector:@selector(back:) withObject:nil afterDelay:1];
    }
   
    
}



#pragma mark - keyboard events -
///键盘显示事件
- (void) keyboardWillShow:(NSNotification *)notification {
    
    
    //获取键盘高度，在不同设备上，以及中英文下是不同的
    CGFloat kbHeight = [[notification.userInfo objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue].size.height;
    
    //计算出键盘顶端到inputTextView panel底端的距离(加上自定义的缓冲距离INTERVAL_KEYBOARD)
    CGFloat offset = (textFieldContent.frame.origin.y+textFieldContent.frame.size.height+32) - (self.view.frame.size.height - kbHeight);
    
    // 取得键盘的动画时间，这样可以在视图上移的时候更连贯
    double duration = [[notification.userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    
    //将视图上移计算好的偏移
    if(offset > 0) {
        [UIView animateWithDuration:duration animations:^{
            self.view.frame = CGRectMake(0.0f, -offset, self.view.frame.size.width, self.view.frame.size.height);
        }];
    }
    
}

///键盘消失事件
- (void) keyboardWillHide:(NSNotification *)notify {
    // 键盘动画时间
    double duration = [[notify.userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    //视图下沉恢复原状
    [UIView animateWithDuration:duration animations:^{
        self.view.frame = CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height);
    }];
}

#pragma mark UITextFieldDelegate

- (BOOL)textField:(UITextField*)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString*)string
{
   
    //密码长度限制

        if (range.length == 1 && string.length == 0) {
            return YES;
        }  else if (textField.text.length >= 30) {
            
            textField.text = [textField.text substringToIndex:30];
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
    return YES;
}

- (BOOL)textFieldShouldClear:(UITextField *)textField
{
    return YES;
}

#pragma mark getStrWeekFromWeekValue
-(NSString*)getStrWeekFromWeekValue:(NSNumber*)week
{

    int weekValue= week.intValue;

    NSString * strSunday = ((weekValue&1)==1)?LocalForkey(@"周日 "):@"";
    NSString * strMonday = ((weekValue&2)==2)?LocalForkey(@"周一 "):@"";
    NSString * strTuesday = ((weekValue&4)==4)?LocalForkey(@"周二 "):@"";
    NSString * strWednesday = ((weekValue&8)==8)?LocalForkey(@"周三 "):@"";
    NSString * strThursday = ((weekValue&16)==16)?LocalForkey(@"周四 "):@"";
    NSString * strFriday = ((weekValue&32)==32)?LocalForkey(@"周五 "):@"";
    NSString * strSaturday = ((weekValue&64)==64)?LocalForkey(@"周六 "):@"";
    NSString * strAll = [NSString stringWithFormat:@"%@%@%@%@%@%@%@",strSunday,strMonday,strTuesday,strWednesday,strThursday,strFriday,strSaturday];
    return strAll;
}

#pragma mark changeClockType
-(void)changeClockType
{
    switch (myClockType) {
        case 1:
        {
            [btnNormalAlarmClock setBackgroundImage:[UIImage imageNamed:@"闹钟-已选中"] forState:UIControlStateNormal];
            labNormalAlarmClock.textColor = RGBA(0x4F, 0xA6, 0xAC, 1);
            [btnTakeMedicineAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃药-未选中"] forState:UIControlStateNormal];
            labTakeMedicineAlarmClock.textColor =RGBA(0x11, 0x11, 0x11, 0.5) ;
            [btnDrinkAlarmClock setBackgroundImage:[UIImage imageNamed:@"喝水-未选中"] forState:UIControlStateNormal];
            labDrinkAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
            [btnFoodAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃饭-未选中"] forState:UIControlStateNormal];
            labFoodAlarmClock.textColor =RGBA(0x11, 0x11, 0x11, 0.5);
        }
            break;
        case 2:
        {
            [btnNormalAlarmClock setBackgroundImage:[UIImage imageNamed:@"闹钟-未选中"] forState:UIControlStateNormal];
            labNormalAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
            [btnTakeMedicineAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃药-已选中"] forState:UIControlStateNormal];
            labTakeMedicineAlarmClock.textColor =RGBA(0x4F, 0xA6, 0xAC, 1) ;
            [btnDrinkAlarmClock setBackgroundImage:[UIImage imageNamed:@"喝水-未选中"] forState:UIControlStateNormal];
            labDrinkAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
            [btnFoodAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃饭-未选中"] forState:UIControlStateNormal];
            labFoodAlarmClock.textColor =RGBA(0x11, 0x11, 0x11, 0.5);
        }
            break;
        case 3:
        {
            [btnNormalAlarmClock setBackgroundImage:[UIImage imageNamed:@"闹钟-未选中"] forState:UIControlStateNormal];
            labNormalAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
            [btnTakeMedicineAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃药-未选中"] forState:UIControlStateNormal];
            labTakeMedicineAlarmClock.textColor =RGBA(0x11, 0x11, 0x11, 0.5) ;
            [btnDrinkAlarmClock setBackgroundImage:[UIImage imageNamed:@"喝水-已选中"] forState:UIControlStateNormal];
            labDrinkAlarmClock.textColor = RGBA(0x4F, 0xA6, 0xAC, 1);
            [btnFoodAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃饭-未选中"] forState:UIControlStateNormal];
            labFoodAlarmClock.textColor =RGBA(0x11, 0x11, 0x11, 0.5);
        }
            break;
        case 4:
        {
            [btnNormalAlarmClock setBackgroundImage:[UIImage imageNamed:@"闹钟-未选中"] forState:UIControlStateNormal];
            labNormalAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
            [btnTakeMedicineAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃药-未选中"] forState:UIControlStateNormal];
            labTakeMedicineAlarmClock.textColor =RGBA(0x11, 0x11, 0x11, 0.5) ;
            [btnDrinkAlarmClock setBackgroundImage:[UIImage imageNamed:@"喝水-未选中"] forState:UIControlStateNormal];
            labDrinkAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
            [btnFoodAlarmClock setBackgroundImage:[UIImage imageNamed:@"吃饭-已选中"] forState:UIControlStateNormal];
            labFoodAlarmClock.textColor =RGBA(0x4F, 0xA6, 0xAC, 1);
        }
            break;
        default:
            break;
    }
}


#pragma  mark 设置闹钟
-(void)SetData
{
    if([[NewBle sharedManager] isConnectOrConnecting]==YES)
    {
        btnSetAlarmClock.enabled = NO;
        NSMutableArray * arrayData = [NSMutableArray arrayWithArray:[[BleSDK sharedManager] SetAlarmClockWithAllClock:myArrayClock]];
        for (int i  = 0;  i<arrayData.count; i++) {
            NSMutableData * data = arrayData[i];
            [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
        }

    }
    else
    {
        btnSetAlarmClock.enabled = YES;
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
    }
}


- (IBAction)chooseAlarmClockType:(UIButton *)sender {
    myClockType = (int)sender.tag;
    [self changeClockType];
}

- (IBAction)setAlarmClock:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        if(isSetClock==NO){
            if(myArrayClock.count>0)
            {
                if(numberClock<myArrayClock.count)
                {
                    [dicClock setObject:[[MyDate sharedManager] stringFromDate:myDatePickerView.date WithStringFormat:@"HH:mm"] forKey:@"clockTime"];
                    [dicClock setObject:[NSNumber numberWithInt:myWeekValue] forKey:@"week"];
                    [dicClock setObject:[NSNumber numberWithInt:myClockType] forKey:@"clockType"];
                    [dicClock setObject:[NSNumber numberWithInt:(int)textFieldContent.text.length] forKey:@"textLenght"];
                    [dicClock setObject:textFieldContent.text forKey:@"text"];
                    
                    [myArrayClock replaceObjectAtIndex:numberClock withObject:dicClock];
                }
                else
                {
                    // NSNumber * textLenght = dicClock[@"textLenght"];
                    // NSString * strText = dicClock[@"text"];
                    NSMutableDictionary * dicTemp = [NSMutableDictionary dictionaryWithObjectsAndKeys:openOrClose,@"openOrClose",[NSNumber numberWithInt:myClockType],@"clockType",[[MyDate sharedManager] stringFromDate:myDatePickerView.date WithStringFormat:@"HH:mm"],@"clockTime",[NSNumber numberWithInt:myWeekValue],@"week",[NSNumber numberWithInt:(int)textFieldContent.text.length],@"textLenght",textFieldContent.text,@"text",nil];
                    [myArrayClock addObject:dicTemp];
                    
                }
                
            }
            else
            {
                NSMutableDictionary * dicTemp = [NSMutableDictionary dictionaryWithObjectsAndKeys:openOrClose,@"openOrClose",[NSNumber numberWithInt:myClockType],@"clockType",[[MyDate sharedManager] stringFromDate:myDatePickerView.date WithStringFormat:@"HH:mm"],@"clockTime",[NSNumber numberWithInt:myWeekValue],@"week",[NSNumber numberWithInt:(int)textFieldContent.text.length],@"textLenght",textFieldContent.text,@"text",nil];
                [myArrayClock addObject:dicTemp];
            }
            isSetClock = YES;
            [self SetData];
        }
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}


- (IBAction)chooseWeeks:(UIButton *)sender {
    ClockWeekChooseView *  clockWeekChooseView = [[ClockWeekChooseView alloc] init];
    clockWeekChooseView.MyWeekValue = myWeekValue;
    clockWeekChooseView.returnValueBlock = ^(int weekValue) {
        labRepeatValue.text = [self getStrWeekFromWeekValue:[NSNumber numberWithInt:weekValue]];
        myWeekValue = weekValue;
    };
    [self.navigationController pushViewController:clockWeekChooseView animated:YES];
}


- (IBAction)back:(UIButton *)sender {
    isSetClock = NO;
    [self.navigationController popViewControllerAnimated:YES];
}

@end
