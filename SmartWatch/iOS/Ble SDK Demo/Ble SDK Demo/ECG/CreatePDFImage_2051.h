//
//  CreatePDFImage_2051.h
//  JC Health
//
//  Created by yang sai on 2021/8/12.
//  Copyright © 2021 杨赛. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CreatePDFImage_2051 : NSObject
@property (nonatomic, strong) NSString *Title;

@property (nonatomic, strong) NSString *Message_1;

@property (nonatomic, strong) NSString *Message_2;

@property (nonatomic, strong) NSString *Message_3;

@property (nonatomic, strong) NSString *Message_4;


@property (nonatomic, strong) NSString *fileName;

@property (nonatomic) CGFloat FileWidth;

@property (nonatomic) CGFloat CellHeight;

@property (nonatomic) CGFloat CellPointCount;

@property (nonatomic) CGFloat CellGap;

@property (nonatomic) CGFloat Top;

@property (nonatomic) CGFloat Left;

@property (nonatomic) CGFloat Right;

@property (nonatomic) CGFloat GridWidth;

@property (nonatomic) CGFloat GridLineWidth;

@property (nonatomic) CGFloat LineWidth;

-(instancetype)initWithInfoDic:(NSDictionary*)infoDic;
- (void)CreatePdfFile:(NSArray *)array;

@end

NS_ASSUME_NONNULL_END
