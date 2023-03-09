//
//  ECGView.h
//  GPS
//
//  Created by  on 2019/3/4.
//  Copyright © 2019年 杨赛. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@protocol ecgDrawEndDelegate <NSObject>
-(void)ecgDrawEnd;
@end
@interface ECGView : UIView
@property(nonatomic,assign) float ShowTime;
@property (nonatomic, assign) int SingleNumber;
@property (nonatomic, assign) float MinValue;
@property (nonatomic,assign)  float MaxValue;
@property (nonatomic, strong) UIColor *LineColor;
@property(nonatomic,strong) NSString *dataType;

@property id<ecgDrawEndDelegate>delegate;
- (instancetype)initWithFrame:(CGRect)frame WithSingleNumber:(int)singleNumber;
- (void)addShowDatasECG:(NSMutableArray *)datas;
- (void)addShowDatasECG2032:(NSMutableArray *)datas;
@end

NS_ASSUME_NONNULL_END
