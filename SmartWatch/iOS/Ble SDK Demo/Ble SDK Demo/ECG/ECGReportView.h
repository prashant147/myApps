//
//  ECGReportView.h
//  JC Health
//
//  Created by  on 2021/6/29.
//  Copyright © 2021 杨赛. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface ECGReportView : UIViewController
@property(nonatomic,retain) NSString * strDate;
 @property(nonatomic,retain) NSString * strHR;
@property(nonatomic,retain) NSString * strBR;
@property(nonatomic,retain) NSString * strHRV;
@property (nonatomic,retain) NSMutableArray * arrayECGData;
@property(nonatomic,assign) NSString * dataType;
@property(nonatomic,assign) NSDictionary *  dicECGData;
@property BOOL isFilter;



@end

NS_ASSUME_NONNULL_END
