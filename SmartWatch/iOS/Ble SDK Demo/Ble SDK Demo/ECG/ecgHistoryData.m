//
//  ecgHistoryData.m
//  Ble SDK Demo
//
//  Created by yang sai on 2022/4/25.
//

#import "ecgHistoryData.h"
#import "ECGReportView.h"
@interface ecgHistoryData ()<MyBleDelegate>
{
    MBProgressHUD * HUD;
    BOOL haveData ;
    int ecgNumber;
    NSMutableArray * arrayECGData;
    NSDictionary * dicEcgData;
    NSMutableArray * arrayAllEcgData;
}
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UITableView *myTableView;
@property (weak, nonatomic) IBOutlet UIButton *btnGetData;
@property (weak, nonatomic) IBOutlet UIButton *btnDeleteData;

@end

@implementation ecgHistoryData

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [NewBle sharedManager].delegate = self;
    _myTableView.tableFooterView = [[UIView alloc] init];
    arrayECGData = [[NSMutableArray alloc] init];
    arrayAllEcgData = [[NSMutableArray alloc] init];
    
    [self myMasonry];
}

-(void)myMasonry
{
    _labTitle.text = LocalForkey(@"ECG历史");
    [_btnGetData setTitle:LocalForkey(@"获取数据") forState:UIControlStateNormal];
    [_btnDeleteData setTitle:LocalForkey(@"删除数据") forState:UIControlStateNormal];
    _btnGetData.layer.cornerRadius  = 10 * Proportion;
    _btnDeleteData.layer.cornerRadius  = 10 * Proportion;
    
    [_myTableView mas_makeConstraints:^(MASConstraintMaker * make)
     {
        make.centerX.mas_equalTo(self.view.mas_centerX);
        make.top.mas_equalTo(self.view.mas_top).offset(90*Proportion);
        make.width.mas_equalTo(Width);
        make.height.mas_equalTo(400*Proportion);
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


#pragma mark
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
    DeviceData * deviceData = [[DeviceData alloc] init];
    deviceData  = [[BleSDK sharedManager] DataParsingWithData:data];
    BOOL end = deviceData.dataEnd;
    if(deviceData.dataType == ECG_HistoryData)
    {
        if(end==NO){
            NSDictionary * dicData =deviceData.dicData;
            NSNumber *  dataNumber = dicData[@"dataNumber"];
            if(dataNumber.intValue==0)
            {
                haveData = YES;
                //表示这是第一条数据 Indicates that this is the first array
                dicEcgData = @{@"strEcgDataStartTime":dicData[@"strEcgDataStartTime"],@"HRV":dicData[@"HRV"],@"HeartRate":dicData[@"HeartRate"],@"Mood":dicData[@"Mood"]};
                [arrayECGData addObjectsFromArray:dicData[@"arrayEcgData"]];
            }
            else
            {
                NSArray * arrayEcgData = dicData[@"arrayEcgData"];
                [arrayECGData addObjectsFromArray:arrayEcgData];
            }
        }
        else
        {
            
            //
            //表示结束了 means it's over

            if(haveData==YES)
            {
                if(arrayECGData.count>0)
                {
                    NSDictionary *  dicTempEcgData = @{@"ecgData":dicEcgData,@"ecgArrayData":[arrayECGData mutableCopy]};
                    [arrayAllEcgData addObject:dicTempEcgData];
                    [arrayECGData removeAllObjects];
                }
                 ecgNumber +=1;
                if(ecgNumber<=0){
                    haveData = NO;
                    NSData * data = [[BleSDK sharedManager] GetECGHistoryDataWithType:ecgNumber withStartDate:nil];
                    [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
                }
                if(ecgNumber==1)
                {
                    
                    [HUD hideAnimated:YES afterDelay:1];
                    if(arrayAllEcgData.count>0)
                    {
                        _myTableView.hidden = NO;
                        [_myTableView reloadData];
                    }
                    else
                    {
                        _myTableView.hidden = YES;
                    }
                }
                
            }
            else
            {
                [HUD hideAnimated:YES afterDelay:1];
                if(arrayAllEcgData.count>0)
                {
                    _myTableView.hidden = NO;
                    [_myTableView reloadData];
                    [_myTableView mas_updateConstraints:^(MASConstraintMaker * make)
                     {
                        make.height.mas_equalTo(40*Proportion*arrayAllEcgData.count);
                    }];
                }
                else
                {
                    _myTableView.hidden = YES;
                }
            }
           
        }
        
    }
}

#pragma mark UITableViewDataSource
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *cellIdentifier = @"cell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    
    for(UIView * view in cell.contentView.subviews){
        if([view isKindOfClass:[UILabel class]])
            [view removeFromSuperview];
    }
    
    NSDictionary * dicData = arrayAllEcgData[indexPath.row];
    NSDictionary * dicEcgData = dicData[@"ecgData"];
    UILabel * labName = [[UILabel alloc] initWithFrame:CGRectMake(40*Proportion, 0, 250*Proportion, 40*Proportion)];
    labName.text =  dicEcgData[@"strEcgDataStartTime"];
    labName.font = [UIFont systemFontOfSize:16];
    labName.textColor = UIColor.blackColor;
    [cell.contentView addSubview:labName];
    
    

    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.backgroundColor = UIColor.clearColor;
    return cell;
    
    
} // 创建单元格



- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
    return  arrayAllEcgData.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(nonnull NSIndexPath *)indexPath
{
    return  40*Proportion;
}


-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{

    /*@{@"strEcgDataStartTime":dicData[@"strEcgDataStartTime"],@"HRV":dicData[@"HRV"],@"HeartRate":dicData[@"HeartRate"],@"Mood":dicData[@"Mood"]}*/
    NSDictionary * dicData = arrayAllEcgData[indexPath.row];
    NSDictionary * dicEcgData = dicData[@"ecgData"];
    NSArray * arrayEcgData = dicData[@"ecgArrayData"];
    
    ECGReportView *  myECGReportView = [[ECGReportView alloc] init];
    myECGReportView.strHR = [NSString stringWithFormat:@"%@",dicEcgData[@"HeartRate"]];
    myECGReportView.strHRV = [NSString stringWithFormat:@"%@",dicEcgData[@"HRV"]];
    myECGReportView.strBR = @"---";
    myECGReportView.strDate = [NSString stringWithFormat:@"%@",dicEcgData[@"strEcgDataStartTime"]];
    myECGReportView.dataType = @"2025E";
    myECGReportView.isFilter = NO;
    myECGReportView.arrayECGData = [NSMutableArray arrayWithArray:arrayEcgData];
    [self.navigationController pushViewController:myECGReportView animated:YES];
    
}

- (IBAction)getData:(UIButton *)sender {

    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        
        
        if(HUD)
        {
            [HUD removeFromSuperview];
            HUD = nil;
        }
        HUD = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        HUD.label.font = [UIFont boldSystemFontOfSize:12];
        HUD.label.text = LocalForkey(@"正在同步ECG数据...");
       
        
        haveData = NO;
        ecgNumber = 0;
        [arrayECGData removeAllObjects];
        [arrayAllEcgData removeAllObjects];
        NSData * data = [[BleSDK sharedManager] GetECGHistoryDataWithType:ecgNumber withStartDate:nil];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}




- (IBAction)deleteData:(UIButton *)sender {
    if([[NewBle sharedManager] isConnectOrConnecting]==YES){
        NSData * data = [[BleSDK sharedManager] GetECGHistoryDataWithType:0x99 withStartDate:nil];
        [[NewBle sharedManager] writeValue:SERVICE characteristicUUID:SEND_CHAR p:[NewBle sharedManager].activityPeripheral data:data];
    }
    else
        [PishumToast showToastWithMessage:LocalForkey(@"设备未连接") Length:TOAST_SHORT ParentView:self.view];
}
- (IBAction)back:(UIButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

@end
