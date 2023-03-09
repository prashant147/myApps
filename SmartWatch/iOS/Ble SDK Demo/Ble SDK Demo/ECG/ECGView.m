//
//  ECGView.m
//  GPS
//
//  Created by  on 2019/3/4.
//  Copyright © 2019年 杨赛. All rights reserved.
//

#import "ECGView.h"

@interface ECGView ()
{
    
    float chartwidth;
    float chartheight;
    NSMutableArray *allDatas;
    int DataBase;//基础值
}
@end
@implementation ECGView
@synthesize ShowTime,MaxValue,MinValue,SingleNumber,LineColor,delegate;
- (instancetype)initWithFrame:(CGRect)frame WithSingleNumber:(int)singleNumber
{
    self = [super initWithFrame:frame];
    
    if (self) {
        
        
        self.backgroundColor = UIColor.clearColor;
        chartwidth = self.frame.size.width;    //上边title30,下边刻度20
        chartheight = self.frame.size.height; //左边刻度30，右边标注20
        SingleNumber = singleNumber;
        allDatas = [[[NSMutableArray alloc] init] mutableCopy];
    
    }
    
    return self;
}



- (void)drawRect:(CGRect)rect
{
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextClearRect(context, rect);
    
    CGContextSetShouldAntialias(context, YES ); //抗锯齿
    CGContextSetLineWidth(context, 1);
     CGContextSetRGBStrokeColor(context, 1 / 255.0, 0x34 / 255.0, 0x49 / 255.0, 1);   //线的颜色
//    //画粗线格子
//    float width = chartwidth/ShowTime/5.0; //每秒钟分成5格  每格200ms
//    
//    int temp = (int)(chartheight/width)+1;
//    float tempHeight = (temp * width-chartheight);
//    
//    CGContextSetLineWidth(context, 0.5);
//    //横线
//    for (int i = 0; i < (int)(chartheight/width)+1; i++) {
//        CGContextBeginPath(context);
//        CGContextMoveToPoint(context,0, chartheight-i*width-tempHeight);
//        CGContextAddLineToPoint(context, chartwidth, chartheight-i*width-tempHeight);
//        CGContextStrokePath(context);
//    }
//    
//    //竖线
//    for (int i = 0; i < (int)(chartwidth/width)+1; i++) {
//        if(i%5==0&&i!=0)
//            CGContextSetLineWidth(context, 1.5);
//        else
//            CGContextSetLineWidth(context, 0.5);
//        CGContextBeginPath(context);
//        CGContextMoveToPoint(context, width*i, chartheight);
//        CGContextAddLineToPoint(context,width*i, 0);
//        CGContextStrokePath(context);
//    }
    
    CGContextSetStrokeColorWithColor(context, LineColor.CGColor);
    if (allDatas.count) {
        for (int i = 0; i < allDatas.count-1; i++) {
            NSNumber *value1 = allDatas[i];
            NSNumber * value2 = allDatas[i+1];
            if ([self.dataType isEqualToString:@"2032"]) {
            } else {
                if(value1.floatValue>2||value1.floatValue <-1)
                    value1 = [NSNumber numberWithInt:0];
                if(value2.floatValue>2||value2.floatValue <-1)
                    value2 = [NSNumber numberWithInt:0];
            }

            
            CGPoint pointitemX1 = CGPointMake((i*chartwidth/(ShowTime*SingleNumber)),(DataBase-value1.floatValue)/((float)(MaxValue-MinValue))*chartheight);
            CGPoint pointitemX2 = CGPointMake(((i+1)*chartwidth/(ShowTime*SingleNumber)),(DataBase-value2.floatValue)/((float)(MaxValue-MinValue))*chartheight);
            CGContextMoveToPoint(context, pointitemX1.x, pointitemX1.y);
            CGContextAddLineToPoint(context, pointitemX2.x, pointitemX2.y);
            CGContextStrokePath(context);
        }

    }
  //  [delegate ecgDrawEnd];
    
    /*
     CGContextSetStrokeColorWithColor(context, LineColor.CGColor); //线的颜色
    for (int i = 0; i < allDatas.count; i++) {
        
        NSNumber *value = allDatas[i];
        if(value.floatValue>2||value.floatValue <-1)
            value = [NSNumber numberWithInt:0];
        CGPoint pointitem = CGPointMake((i*chartwidth/(ShowTime*SingleNumber)),(DataBase-value.floatValue)/((float)(MaxValue-MinValue))*chartheight);
        if (i==0) {
            CGContextBeginPath(context);
            CGContextMoveToPoint(context, pointitem.x, pointitem.y);
        }
        else if (i != allDatas.count - 1) {
            CGContextAddLineToPoint(context, pointitem.x, pointitem.y);
        }
    
        else {
            CGContextStrokePath(context);
            [delegate ecgDrawEnd];
        }
    }
     */
    
    
}


- (void)addShowDatasECG:(NSMutableArray *)datas
{
    allDatas = [NSMutableArray arrayWithArray:datas];
    self.MaxValue = 2;
    self.MinValue = -2;
    DataBase = 2;
    [self setNeedsDisplay];
}

- (void)addShowDatasECG2032:(NSMutableArray *)datas
{
    allDatas = [NSMutableArray arrayWithArray:datas];
    self.MaxValue = 100;
    self.MinValue = -100;
    DataBase = 50;
    [self setNeedsDisplay];
}




@end
