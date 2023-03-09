//
//  WaveBgView.m
//  JC Health
//
//  Created by  on 2020/9/16.
//  Copyright © 2020 杨赛. All rights reserved.
//

#import "WaveBgView.h"

@interface WaveBgView ()
{
    NSInteger myShowTime;
    UIColor  * myLineColor;
}
@end
@implementation WaveBgView

- (instancetype)initWithFrame:(CGRect)frame showTime:(NSInteger)showTime lineColor:(UIColor*)lineColor
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        myShowTime = showTime;
        myLineColor = lineColor;
    }
    return self;
}
- (void)drawRect:(CGRect)rect {
    float chartwidth  = rect.size.width;
    float chartheight = rect.size.height;
       CGContextRef context = UIGraphicsGetCurrentContext();
       CGContextClearRect(context, rect);
       CGContextSetShouldAntialias(context, YES ); //抗锯齿
       CGContextSetStrokeColorWithColor(context, myLineColor.CGColor);  //线的颜色
      float width = rect.size.width/(myShowTime*5*5);
       CGContextSetLineWidth(context, 0.5);
       //横线
        int numberHeight  = rect.size.height/width;
       for (int i = 0; i < numberHeight ; i++) {
           if(i%5==0)
               CGContextSetLineWidth(context, 0.8);
           else
               CGContextSetLineWidth(context, 0.4);
           CGContextBeginPath(context);
           CGContextMoveToPoint(context,0,chartheight-i*width);
           CGContextAddLineToPoint(context, chartwidth, chartheight-i*width);
           CGContextStrokePath(context);
       }
       //竖线
       for (int i = 0; i < (int)(myShowTime*5*5+1); i++) {
           if(i%5==0)
               CGContextSetLineWidth(context, 1.5);
           else
               CGContextSetLineWidth(context, 0.5);
           CGContextBeginPath(context);
           CGContextMoveToPoint(context, width*i, chartheight);
           CGContextAddLineToPoint(context,width*i, 0);
           CGContextStrokePath(context);
        }
}

@end
