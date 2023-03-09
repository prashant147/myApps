//
//  ClockWeekChooseView.h
//  GPS
//
//  Created by  on 2018/9/3.
//  Copyright © 2018年 杨赛. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void (^ReturnValueBlock) (int weekValue);
@interface ClockWeekChooseView : UIViewController
@property(nonatomic, copy) ReturnValueBlock returnValueBlock;
@property int MyWeekValue;

@end
