//
//  QiCodeScanningViewController.h
//  QiQRCode
//
//  Created by huangxianshuai on 2018/11/13.
//  Copyright © 2018年 QiShare. All rights reserved.
//
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface QiCodeScanningViewController : UIViewController

@property (nonatomic, strong) UIView *navigationV;
@property(nonatomic,copy)  void (^sureBlock)(NSString* code);


@end

NS_ASSUME_NONNULL_END
