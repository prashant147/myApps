//
//  ClockWeekChooseView.m
//  GPS
//
//  Created by  on 2018/9/3.
//  Copyright © 2018年 杨赛. All rights reserved.
//

#import "ClockWeekChooseView.h"

@interface ClockWeekChooseView ()<UITableViewDelegate,UITableViewDataSource>
{
    
    
    NSMutableArray * weekArray;
    __weak IBOutlet UIButton *btnBack;
    __weak IBOutlet UILabel *labTitle;
    __weak IBOutlet UIImageView *imgLine;
    __weak IBOutlet UITableView *MyTableView;
}


- (IBAction)back:(UIButton *)sender;
@end

@implementation ClockWeekChooseView
@synthesize MyWeekValue;
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    weekArray = [[NSMutableArray alloc] initWithObjects:LocalForkey(@"周日"),LocalForkey(@"周一"),LocalForkey(@"周二"),LocalForkey(@"周三"),LocalForkey(@"周四"),LocalForkey(@"周五"),LocalForkey(@"周六"), nil];
    MyTableView.tableFooterView = [[UIView alloc] init];
    //[self MyConstraint];
    [self MyLocalizedString];
}

-(void)MyLocalizedString
{
    labTitle.text = LocalForkey(@"重复星期");
    
}

-(void)MyConstraint
{
    [labTitle mas_makeConstraints:^(MASConstraintMaker * make)
     {
         make.centerX.mas_equalTo(self.view.mas_centerX);
         make.top.mas_equalTo(self.view.mas_top).offset(35*Proportion);
         make.width.mas_equalTo(204*Proportion);
         make.height.mas_equalTo(30*Proportion);
     }];
    [btnBack mas_makeConstraints:^(MASConstraintMaker * make)
     {
         make.left.mas_equalTo(self.view.mas_left).offset(10*Proportion);
         make.top.mas_equalTo(self.view.mas_top).offset(30*Proportion);
         make.width.mas_equalTo(40*Proportion);
         make.height.mas_equalTo(40*Proportion);
     }];
    [imgLine mas_makeConstraints:^(MASConstraintMaker * make)
     {
         make.centerX.mas_equalTo(self.view.mas_centerX);
         make.top.mas_equalTo(self.view.mas_top).offset(69*Proportion);
         make.width.mas_equalTo(Width);
         make.height.mas_equalTo(1*Proportion);
     }];
    [MyTableView mas_makeConstraints:^(MASConstraintMaker * make)
     {
         make.centerX.mas_equalTo(self.view.mas_centerX);
         make.top.mas_equalTo(self.view.mas_top).offset(90*Proportion);
         make.width.mas_equalTo(Width);
         make.height.mas_equalTo(350*Proportion);
     }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark UITableViewDelegate
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 50*Proportion;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 7;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    // 定义一个静态标识符
    static NSString *cellIdentifier = @"cell";
    // 检查是否限制单元格
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    // 创建单元格
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    // 给cell内容赋值
    int myValue = (int)indexPath.row;
    int Temp = 1;
    if(myValue==0)
        myValue =1;
    else
    {
        for (int i =0; i<myValue; i++)
            Temp*=2;
    }
    if(MyWeekValue&Temp)
    {
        // R:250 G:85 B:40
        [cell setAccessoryType:UITableViewCellAccessoryCheckmark];
        cell.tintColor  = UIColor.blackColor;
    }
    else
        [cell setAccessoryType:UITableViewCellAccessoryNone];
    NSString *week;
    if(indexPath.row==0)
        week = weekArray[6];
    else
        week = weekArray[indexPath.row-1];
    cell.textLabel.text = week;
    cell.textLabel.font = [UIFont systemFontOfSize:14];
    cell.textLabel.textColor = UIColor.blackColor;
    cell.backgroundColor = [UIColor clearColor];
    cell.contentView.backgroundColor = [UIColor clearColor];
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    int MyValue = (int)indexPath.row;
    int Temp = 1;
    if(MyValue==0)
        MyValue =1;
    else
    {
        for (int i =0; i<MyValue; i++)
            Temp*=2;
    }
    if(MyWeekValue&Temp)
        MyWeekValue-=Temp;
    else
        MyWeekValue +=Temp;
    NSLog(@"my =%d",MyWeekValue);
    [tableView reloadData];
}



- (IBAction)back:(UIButton *)sender {
    __weak typeof(self) weakself = self;
    if (weakself.returnValueBlock) {
        //将自己的值传出去，完成传值
        weakself.returnValueBlock(MyWeekValue);
    }
    [self.navigationController popViewControllerAnimated:YES];
}



@end
