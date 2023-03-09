//
//  AlarmClockView.m
//  JC Health
//
//  Created by  on 2020/12/16.
//  Copyright © 2020 杨赛. All rights reserved.
//

#import "AlarmClockView.h"
#import "AlarmClockDetailView.h"
@interface AlarmClockView ()<MyBleDelegate>
{
    __weak IBOutlet UIButton *btnEdit;
    __weak IBOutlet UITableView *myTableView;
    __weak IBOutlet UILabel *labAddAlarmClock;
    __weak IBOutlet UIImageView *imgNoAlarmClock;
    __weak IBOutlet UILabel *labNoAlarmClock;
    
    NSMutableArray * arrayAlarmClock;
    
}
@end

@implementation AlarmClockView


-(void)viewWillAppear:(BOOL)animated
{
    if(myTableView.editing==YES)
    {
        myTableView.editing = NO;
        [btnEdit setTitle:LocalForkey(@"编辑") forState:UIControlStateNormal];
    }
    
    NSArray * arrayClock = [UserDefaults arrayForKey:@"arrayClock"];
    if(arrayClock.count >0)
        arrayAlarmClock = [[NSMutableArray alloc] initWithArray:arrayClock];
    //蓝牙处理方法
    [NewBle sharedManager].delegate = self;
    if([[NewBle sharedManager] isConnectOrConnecting]==YES)
    {
        [arrayAlarmClock removeAllObjects];
        NSData * data =   [[BleSDK sharedManager] GetAlarmClock];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
        
    }
    else
    {
        if(arrayAlarmClock.count>0)
        {
            imgNoAlarmClock.hidden = YES;
            labNoAlarmClock.hidden = YES;
        }
    }
}

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
    
    myTableView.tableFooterView = [[UIView alloc] init];
    myTableView.allowsSelectionDuringEditing = YES;
}

-(void)myMasonry
{

}

-(void)localizedString
{
    labNoAlarmClock.text = LocalForkey(@"暂无智能闹钟");
    labAddAlarmClock.text = LocalForkey(@"添加");
    [btnEdit setTitle:LocalForkey(@"编辑") forState:UIControlStateNormal];
}

-(void)initData
{
    
    arrayAlarmClock = [[NSMutableArray alloc] init];
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
    if(deviceData.dataType == GetAlarmClock)
    {
        NSDictionary * dicData = deviceData.dicData;
        BOOL isEnd = deviceData.dataEnd;
        NSArray * arrayClock = dicData[@"arrayAlarmClock"];
        if(arrayClock.count>0||arrayAlarmClock.count>0)
        {
            imgNoAlarmClock.hidden = YES;
            labNoAlarmClock.hidden = YES;
            [arrayAlarmClock addObjectsFromArray:arrayClock];
        }
        else
        {
            imgNoAlarmClock.hidden = NO;
            labNoAlarmClock.hidden = NO;
        }
        if(isEnd==YES)
        {
            [UserDefaults setObject:arrayAlarmClock forKey:@"arrayClock"];
            [UserDefaults synchronize];
            [myTableView reloadData];
        }
    }
    if(deviceData.dataType == SetAlarmClock)
    {
        if(arrayAlarmClock.count==0)
        {
            imgNoAlarmClock.hidden = NO;
            labNoAlarmClock.hidden = NO;
        }
        [UserDefaults setObject:arrayAlarmClock forKey:@"arrayClock"];
        [UserDefaults synchronize];
    }
}

#pragma mark UITableViewDelegate
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 120*Proportion;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
  
    return 1;
    
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return arrayAlarmClock.count+1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    // 定义一个静态标识符
    static NSString *cellIdentifier = @"cell";
    // 检查是否限制单元格
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    // 创建单元格
    if (cell == nil)
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    for(UIView * view in cell.contentView.subviews){
        if([view isKindOfClass:[UILabel class]]||[view isKindOfClass:[UIImageView class]]||[view isKindOfClass:[UISwitch class]])
            [view removeFromSuperview];
    }
    for(UIView * view in cell.subviews){
        if([view isKindOfClass:[UILabel class]]||[view isKindOfClass:[UIImageView class]]||[view isKindOfClass:[UISwitch class]])
            [view removeFromSuperview];
    }
    
    
    if(indexPath.row!= arrayAlarmClock.count){
        UIImageView * imgLine = [[UIImageView alloc] initWithFrame:CGRectMake(20*Proportion, 120*Proportion-1, Width-20*Proportion, 1)];
        imgLine.backgroundColor = RGBA(0xe7, 0xe7, 0xe7, 1);
        [cell addSubview:imgLine];
    }
    
    if(indexPath.row==0)
    {
        UIImageView * imgIcon = [[UIImageView alloc] initWithFrame:CGRectMake(20*Proportion, 40*Proportion, 22*Proportion, 21 * Proportion)];
        imgIcon.image = [UIImage imageNamed:@"闹钟图标"];
        
        UILabel * labTitle = [[UILabel alloc] initWithFrame:CGRectMake(50*Proportion, 40*Proportion, 300*Proportion, 21 * Proportion)];
        labTitle.backgroundColor = UIColor.clearColor;
        labTitle.textAlignment = NSTextAlignmentLeft;
        labTitle.textColor = RGBA(0x11, 0x11, 0x11, 1);
        labTitle.text = LocalForkey(@"智能闹钟列表");
        labTitle.font = [UIFont systemFontOfSize:18];
        
        UILabel * labContent = [[UILabel alloc] initWithFrame:CGRectMake(20 * Proportion, 60 * Proportion, 300 * Proportion, 40 * Proportion)];
        labContent.backgroundColor = UIColor.clearColor;
        labContent.textAlignment = NSTextAlignmentLeft;
        labContent.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
        labContent.text = LocalForkey(@"振动过程中，触摸设备按键即可停止");
        labContent.font = [UIFont systemFontOfSize:12];
        
        [cell addSubview: imgIcon];
        [cell addSubview: labTitle];
        [cell addSubview: labContent];
        
    }
    else
    {
        
        /*[NSDictionary dictionaryWithObjectsAndKeys:clockOpenOrClose,@"openOrClose",clockType,@"clockType",strTime,@"clockTime",weekValue,@"week",textLenght,@"textLenght",strText,@"text",nil]*/
        
        
        
        NSDictionary * dicAlarmClock = arrayAlarmClock[indexPath.row-1];
        
        NSNumber * numberOpenOrClose = dicAlarmClock[@"openOrClose"];
        NSNumber * numberAlarmClockType = dicAlarmClock[@"clockType"];
        NSNumber * numberWeekValue = dicAlarmClock[@"week"];
        NSString * strAlarmClockTime = dicAlarmClock[@"clockTime"];
        NSString * strContent = dicAlarmClock[@"text"];
        
        UIImageView * imgAlarmClockType = [[UIImageView alloc] initWithFrame:CGRectMake(20*Proportion, 24.5*Proportion, 35 * Proportion, 31 * Proportion)];
        imgAlarmClockType.image = [self getAlarmClockWithAlarmClockType:numberAlarmClockType];
        
        UILabel * labAlarmClockName = [[UILabel alloc] initWithFrame:CGRectMake(60 * Proportion, 20* Proportion, 300 * Proportion, 40* Proportion)];
        labAlarmClockName.textAlignment = NSTextAlignmentLeft;
        labAlarmClockName.lineBreakMode = NSLineBreakByWordWrapping;
        labAlarmClockName.numberOfLines = 0;
        labAlarmClockName.backgroundColor = UIColor.clearColor;
        labAlarmClockName.attributedText = [self getAlarmClockContentWithAlarmClockType:numberAlarmClockType alarmClockContent:strContent];
        
        UILabel * labAlarmClock = [[UILabel alloc] initWithFrame:CGRectMake(25 * Proportion, 60 * Proportion, 80*Proportion, 50*Proportion)];
        labAlarmClock.backgroundColor = UIColor.clearColor;
        labAlarmClock.textAlignment = NSTextAlignmentLeft;
        labAlarmClock.textColor = RGBA(0x11, 0x11, 0x11, 1);
        labAlarmClock.text =  strAlarmClockTime;
        labAlarmClock.font = [UIFont systemFontOfSize:30];
        
        UILabel * labWeek = [[UILabel alloc] initWithFrame:CGRectMake(100 * Proportion, 75 * Proportion, 200*Proportion, 30*Proportion)];
        labWeek.numberOfLines = 0;
        labWeek.lineBreakMode = NSLineBreakByWordWrapping;
        labWeek.backgroundColor = UIColor.clearColor;
        labWeek.textAlignment = NSTextAlignmentLeft;
        labWeek.textColor = RGBA(0x11, 0x11, 0x11, 0.5);
        labWeek.text =  strAlarmClockTime;
        labWeek.font = [UIFont systemFontOfSize:10];
        labWeek.text = [self getAlarmClockWeekWithAlarmClockWeek:numberWeekValue];
        
        UISwitch * switchView = [[UISwitch alloc] initWithFrame:CGRectMake(Width - 69, (120*Proportion-31)/2.0, 49, 31)];
        switchView.tag = indexPath.row;
        switchView.onTintColor = RGBA(1, 0xa8,0xae, 1);
        switchView.on = numberOpenOrClose.intValue==1?YES:NO;
        [switchView addTarget:self action:@selector(switchAction:) forControlEvents:UIControlEventValueChanged];
        if(tableView.isEditing==YES)
        {
            switchView.hidden = YES;
            cell.editingAccessoryType = UITableViewCellAccessoryDisclosureIndicator;
        }
        else
        {
            switchView.hidden = NO;
            cell.editingAccessoryType = UITableViewCellAccessoryNone;
        }
        
        [cell.contentView addSubview:imgAlarmClockType];
        [cell.contentView addSubview:labAlarmClockName];
        [cell.contentView addSubview:labAlarmClock];
        [cell.contentView addSubview:labWeek];
        [cell.contentView addSubview:switchView];
        
    }
    cell.selectionStyle  = UITableViewCellSelectionStyleNone;
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if(tableView.editing==YES&&indexPath.row!=0)
    {
        AlarmClockDetailView * alarmClockDetailView = [[AlarmClockDetailView alloc] init];
        alarmClockDetailView.numberClock = (int)indexPath.row-1;
        [self.navigationController pushViewController:alarmClockDetailView animated:YES];
    }
}


/*删除用到的函数*/
-(void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle ==UITableViewCellEditingStyleDelete)
    {
        //删除数组里的数据
        [arrayAlarmClock   removeObjectAtIndex:[indexPath row]-1];
        
        [myTableView beginUpdates];
       
        if(arrayAlarmClock.count<=0)
            [arrayAlarmClock removeAllObjects];
//            [tableView deleteSections:[NSIndexSet indexSetWithIndex:indexPath.section] withRowAnimation:UITableViewRowAnimationLeft];
        
        //删除最后一条数据
        [myTableView   deleteRowsAtIndexPaths:[NSMutableArray arrayWithObject:indexPath]withRowAnimation:UITableViewRowAnimationLeft];  //删除对应数据的cell
        [myTableView endUpdates];
        if(arrayAlarmClock.count==0)
        {
           NSData * data =  [[BleSDK sharedManager] DeleteAllAlarmClock];
            [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
        }
        else
        {
            NSMutableArray * arrayData = [NSMutableArray arrayWithArray:[[BleSDK sharedManager] SetAlarmClockWithAllClock:[arrayAlarmClock mutableCopy]]];
            for (int i  = 0;  i<arrayData.count; i++) {
                NSMutableData * data = arrayData[i];
                [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
            }
        }
    }
}

-(UITableViewCellEditingStyle)tableView:(UITableView *)tableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row == 0)
    {
        return UITableViewCellEditingStyleNone;
    }
    else
    {
        return UITableViewCellEditingStyleDelete;
    }
}


#pragma mark 获取闹钟的图片和文字
-(UIImage*)getAlarmClockWithAlarmClockType:(NSNumber*)numberAlarmClockType
{
    switch (numberAlarmClockType.intValue) {
        case 1:
        
            return [UIImage imageNamed:@"闹钟-已选中"];
        
            break;
        case 2:
            
            return [UIImage imageNamed:@"吃药-已选中"];
            
            break;
        case 3:
            
            return [UIImage imageNamed:@"喝水-已选中"];
            
            break;
        case 4:
            
            return [UIImage imageNamed:@"吃饭-已选中"];
            
            break;
        default:
            return [UIImage imageNamed:@"闹钟-已选中"];
            break;
    }
}

-(NSMutableAttributedString*)getAlarmClockContentWithAlarmClockType:(NSNumber*)numberAlarmClockType alarmClockContent:(NSString*)strContent
{
    NSString * strType ;
    switch (numberAlarmClockType.intValue) {
        case 1:
            
            strType = LocalForkey(@"普通闹钟");
            
            break;
        case 2:
            
            strType = LocalForkey(@"吃药闹钟");;
            
            break;
        case 3:
            
            strType = LocalForkey(@"喝水闹钟");;
            
            break;
        case 4:
            
            strType = LocalForkey(@"吃饭闹钟");;
            
            break;
        default:
            strType = LocalForkey(@"普通闹钟");;
            break;
    }
    
    NSMutableAttributedString *  attributedString;
    if(strContent.length>0)
        attributedString = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%@\n%@",strType,strContent]];
    else
        attributedString = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%@",strType]];
    NSDictionary  * dicAttribute =  @{NSFontAttributeName:[UIFont systemFontOfSize:16],NSForegroundColorAttributeName:RGBA(0x11, 0x11, 0x11, 0.8)};
    [attributedString addAttributes:dicAttribute range:[[attributedString string] rangeOfString:strType]];
    
    if(strContent.length>0){
        dicAttribute =  @{NSFontAttributeName:[UIFont systemFontOfSize:12],NSForegroundColorAttributeName:RGBA(0x11, 0x11, 0x11, 0.5)};
        [attributedString addAttributes:dicAttribute range:[[attributedString string] rangeOfString:strContent]];
    }
    return  attributedString;
    
};

-(NSString*)getAlarmClockWeekWithAlarmClockWeek:(NSNumber*)week
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

#pragma mark

-(void)switchAction:(UISwitch*)switchView
{
    NSInteger tag = switchView.tag;
    NSMutableDictionary * dicAlarmClock = [NSMutableDictionary dictionaryWithDictionary:arrayAlarmClock[tag-1]];
    NSNumber *  openOrClose;
    if(switchView.on==YES)
        openOrClose = [NSNumber numberWithInt:1];
    else
       openOrClose = [NSNumber numberWithInt:0];
    [dicAlarmClock setObject:openOrClose forKey:@"openOrClose"];
    [arrayAlarmClock replaceObjectAtIndex:tag-1 withObject:dicAlarmClock];
    
    
    NSMutableArray * arrayData = [NSMutableArray arrayWithArray:[[BleSDK sharedManager] SetAlarmClockWithAllClock:[arrayAlarmClock mutableCopy]]];
    for (int i  = 0;  i<arrayData.count; i++) {
        NSMutableData * data = arrayData[i];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    
}
- (IBAction)editAlarmClock:(UIButton *)sender {
    if(arrayAlarmClock.count>0){
        if(myTableView.editing==NO)
        {
            [btnEdit setTitle:LocalForkey(@"完成") forState:UIControlStateNormal];
            [myTableView setEditing:YES animated:YES];
        }
        else
        {
            [btnEdit setTitle:LocalForkey(@"编辑") forState:UIControlStateNormal];
            [myTableView setEditing:NO animated:YES];
        }
        [myTableView reloadData];
    }
    
}

- (IBAction)addAlarmClock:(UIButton *)sender {
    
    if(arrayAlarmClock.count<10){
    AlarmClockDetailView * alarmClockDetailView = [[AlarmClockDetailView alloc] init];
    alarmClockDetailView.numberClock = (int)arrayAlarmClock.count;
    [self.navigationController pushViewController:alarmClockDetailView animated:YES];
    }
    else
    {
        [PishumToast showToastWithMessage:LocalForkey(@"超过可设置闹钟的上限(10)") Length:TOAST_SHORT ParentView:self.view];
    }
}

- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

@end
