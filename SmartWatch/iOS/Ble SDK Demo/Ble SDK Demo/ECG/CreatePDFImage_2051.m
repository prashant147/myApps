//
//  CreatePDFImage_2051.m
//  JC Health
//
//  Created by yang sai on 2021/8/12.
//  Copyright © 2021 杨赛. All rights reserved.
//

#import "CreatePDFImage_2051.h"
#import <CoreText/CoreText.h>
@implementation CreatePDFImage_2051
-(instancetype)initWithInfoDic:(NSDictionary*)infoDic{
    self = [super init];
    if (self) {
        // defaults File Name
        self.fileName = LocalForkey(@"心电曲线报告");
        
        
        NSString * strNickName= [UserDefaults objectForKey:@"nickName"];
        NSString * strGender = [UserDefaults objectForKey:@"gender"];
        if(strGender)
        {
            if(strGender.intValue==0)
                strGender = LocalForkey(@"女" );
            else
                strGender = LocalForkey(@"男" );
        }
        NSDictionary * dicHeight = [UserDefaults objectForKey:@"height"];
        NSString * strHeight;
        if(dicHeight)
        {
            int unitType = ((NSNumber*)dicHeight[@"unit"]).intValue;
            if(unitType==0)
                strHeight = [NSString stringWithFormat:@"%@ cm",dicHeight[@"value0"]];
            else
                strHeight = [NSString stringWithFormat:@"%@",dicHeight[@"value1"]];
        }
        NSDictionary * dicWeight = [UserDefaults objectForKey:@"weight"];
        NSString * strWeight;
        if(dicWeight)
        {
            int unitType = ((NSNumber*)dicWeight[@"unit"]).intValue;
            if(unitType==0)
                strWeight = [NSString stringWithFormat:@"%@kg",dicWeight[@"value0"]];
            else
                strWeight = [NSString stringWithFormat:@"%@lb",dicWeight[@"value1"]];
        }
        NSString * strBirthday = [UserDefaults objectForKey:@"birthday"];
        NSString * strAge;
        if(strBirthday)
            strAge = [NSString stringWithFormat:@"%d",[self ageFromBirthday:strBirthday]];
        

        // defaults String
        self.Title = LocalForkey(@"心电曲线报告(导联 I)");
        self.Message_1 = LocalForkey(@"本报告仅供参考");
//        self.Message_2 = @"Name:fabio Sex:Male Age:45 Height:170cm Weight:83kg";
        self.Message_2 = [NSString stringWithFormat:@"%@:%@ %@:%@ %@:%@ %@:%@ %@:%@",LocalForkey(@"姓名"),strNickName,LocalForkey(@"性别"),strGender,LocalForkey(@"年龄"),strAge,LocalForkey(@"身高"),strHeight,LocalForkey(@"体重"),strWeight];
        self.Message_3 = [NSString stringWithFormat:@"%@ : %@ bpm",LocalForkey(@"平均心率"),infoDic[@"HR"]];
//        self.Message_4 = @"Gain: 10mm/mv Walking speed: 25mm/s Date: 2017-11-29 11:58:28";
        self.Message_4 = infoDic[@"Date"];
        // defaults values
        self.FileWidth = 920;
        self.CellHeight = 45;
        self.CellPointCount = 5120;
        self.CellGap = 30;
        self.Top = 100;
        self.Left = 10;
        self.Right = 10;
        self.GridWidth = 18; //
        self.GridLineWidth = 0.5;
        self.LineWidth = 1.0;
        
    }
    return self;
}


-(NSString*)myDateWithString:(NSString*)strDate
{
    int month = [strDate substringWithRange:NSMakeRange(0, 2)].intValue;
    int day = [strDate substringWithRange:NSMakeRange(3, 2)].intValue;
    NSString * strMonth;
    switch (month) {
        case 1:
            strMonth  =@"January";
            break;
        case 2:
            strMonth  =@"February";
            break;
        case 3:
            strMonth  =@"March";
            break;
        case 4:
            strMonth  =@"April";
            break;
        case 5:
            strMonth  =@"May";
            break;
        case 6:
            strMonth  =@"June";
            break;
        case 7:
            strMonth  =@"July";
            break;
        case 8:
            strMonth  =@"August";
            break;
        case 9:
            strMonth  =@"September";
            break;
        case 10:
            strMonth  =@"October";
            break;
        case 11:
            strMonth  =@"November";
            break;
        case 12:
            strMonth  =@"December";
            break;
        default:
            break;
    }
    NSString * strMyDate = [NSString stringWithFormat:@"%@ %d,%@",strMonth,day,[strDate substringWithRange:NSMakeRange(6, 13)]];
    return strMyDate;
}

-(int)ageFromBirthday:(NSString*)strBirthday
{
    NSDate * senddate = [NSDate date];
    NSCalendar * cal = [NSCalendar currentCalendar];
    NSUInteger unitFlags = NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay;
    NSDateComponents * conponent = [cal components:unitFlags fromDate:senddate];
    int year = (int)[conponent year];
    int birthdayYear = [strBirthday substringWithRange:NSMakeRange(0, 4)].intValue;
    NSDate * date1 = [[MyDate sharedManager] dateFromString:[NSString stringWithFormat:@"%d.%@.%@",year,[strBirthday substringWithRange:NSMakeRange(5, 2)],[strBirthday substringWithRange:NSMakeRange(8, 2)]] WithStringFormat:@"yyyy.MM.dd"];
    NSDate * date2 = [[MyDate sharedManager] dateFromString:[NSString stringWithFormat:@"%d.%02d.%02d",year,(int)[conponent month],(int)[conponent day]] WithStringFormat:@"yyyy.MM.dd"];
    int addYear = 0;
    if(date2.timeIntervalSince1970-date1.timeIntervalSince1970>0)
        addYear =1;
    return (year - birthdayYear-addYear)>=0?(year - birthdayYear-addYear):0;
}

- (void)CreatePdfFile:(NSArray *)array {
    
    // 1.设置页面大小
    CGFloat myPageWidth = _FileWidth;
    CGFloat myPageHeight = 100+(array.count/3000.0*45)+ (array.count/3000.0 + 1) *_CellGap+80;
    CGRect mediaBox = CGRectMake (0, 0, myPageWidth, myPageHeight);
    
    // 2.设置pdf文档存储的路径
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = paths[0];
    NSString *filePath = [documentsDirectory stringByAppendingString:[NSString stringWithFormat:@"/%@.pdf",_fileName]];
    const char *cfilePath = [filePath UTF8String];
    CFStringRef pathRef = CFStringCreateWithCString(NULL, cfilePath, kCFStringEncodingUTF8);
    
    // 3.设置当前pdf页面的属性
    CFStringRef myKeys[1];
    CFTypeRef myValues[1];
    myKeys[0] = kCGPDFContextMediaBox;
    myValues[0] = (CFTypeRef) CFDataCreate(NULL,(const UInt8 *)&mediaBox, sizeof (CGRect));
    CFDictionaryRef pageDictionary = CFDictionaryCreate(NULL, (const void **) myKeys, (const void **) myValues, 1,
                                                        &kCFTypeDictionaryKeyCallBacks, & kCFTypeDictionaryValueCallBacks);
    
    // 4.获取pdf绘图上下文
    CGContextRef myPDFContext = MyPDFContextCreate_2051 (&mediaBox, pathRef);
    
    // 5.开始描绘第一页页面
    CGPDFContextBeginPage(myPDFContext, pageDictionary);
    
    //开始画pdf
    [self drawViewss:myPDFContext width:myPageWidth height:myPageHeight array:array];
    
    // 绘制title
    CGFloat width_0 = [self getStringWidthFontSize:17 string:_Title];
    CGRect rect_0 = CGRectMake((myPageWidth - width_0) / 2.0, myPageHeight - _Top / 2.0, width_0, 20);
    [self DrawTextWith:myPDFContext string:_Title color:[UIColor blackColor] fontSize:17 rect:rect_0 fontName:CFSTR("Helvetica-Bold")];
    
    // 绘制message_1
    CGFloat width_1 = [self getStringWidthFontSize:11 string:_Message_1];
    CGRect rect_1 = CGRectMake(myPageWidth - width_1, myPageHeight - 30, width_1, 20);
    [self DrawTextWith:myPDFContext string:_Message_1 color:[UIColor grayColor] fontSize:11 rect:rect_1 fontName:CFSTR("Helvetica")];
    
    // 绘制message_2
    CGFloat width_2 = [self getStringWidthFontSize:13 string:_Message_2];
    CGRect rect_2 = CGRectMake((myPageWidth - width_2) / 2.0, myPageHeight - (_Top - 10), width_2, 20);
    [self DrawTextWith:myPDFContext string:_Message_2 color:[UIColor blackColor] fontSize:13 rect:rect_2 fontName:CFSTR("Helvetica")];
    
    CGPDFContextEndPage(myPDFContext);
    
    // 8.释放创建的对象
    CFRelease(pageDictionary);
    CFRelease(myValues[0]);
    CGContextRelease(myPDFContext);
}


- (void)DrawTextWith:(CGContextRef)context string:(NSString *)string color:(UIColor *)color fontSize:(NSInteger)fontSize rect:(CGRect)rect fontName:(CFStringRef)fontName {
    
    

    
    CTFontRef ctfont = CTFontCreateWithName(fontName, fontSize, NULL);
    //CTFontRef ctfont = CTFontCreateWithName(CFSTR("STHeitiSC-Medium"), fontSize, NULL);
    CGColorRef ctColor = [color CGColor];
    
    // Create an attributed string
    CFStringRef keys[] = { kCTFontAttributeName,kCTForegroundColorAttributeName };
    CFTypeRef values[] = { ctfont,ctColor};
    CFDictionaryRef attr = CFDictionaryCreate(NULL, (const void **)&keys, (const void **)&values,
                                              sizeof(keys) / sizeof(keys[0]), &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
    
    
    CFStringRef ctStr = CFStringCreateWithCString(nil, [string UTF8String], kCFStringEncodingUTF8);
    CFAttributedStringRef attrString = CFAttributedStringCreate(NULL,ctStr, attr);
    
    CTLineRef line = CTLineCreateWithAttributedString(attrString);
    CGContextSetTextMatrix(context, CGAffineTransformIdentity);
    CGContextSetTextPosition(context, rect.origin.x, rect.origin.y);
    CTLineDraw(line, context);
    CFRelease(line);
    CFRelease(attrString);
    CFRelease(ctStr);
    
    // Clean up
    CFRelease(attr);
    CFRelease(ctfont);
}


//获取字符串宽度
-(CGFloat)getStringWidthFontSize:(NSInteger)sizeFont string:(NSString *)string {
    CGRect rect = [string boundingRectWithSize:CGSizeMake(MAXFLOAT, 14) options:NSStringDrawingTruncatesLastVisibleLine | NSStringDrawingUsesFontLeading | NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont boldSystemFontOfSize:sizeFont]} context:nil];
    return rect.size.width + 5;
}

- (void)drawViewss:(CGContextRef)context width:(CGFloat)view_w height:(CGFloat)view_h array:(NSArray *)array {
    
    // 最大值
    CGFloat max = 2.5;
    // 一行中波形绘制的范围（高度）
    CGFloat height = _CellHeight;
    // 每行有多少个点
    CGFloat pointCount = _CellPointCount;
    // 每行之间两个点的间距
    CGFloat gap = view_w / pointCount;
    
    // 行间距
    NSInteger cellGap = _CellGap;
    
    
    CGFloat left = _Left;
    CGFloat right = _Right;
    CGFloat top = _Top;
    
    
    // 绘制网格
    CGFloat k = _GridWidth;
    
    // 横线
    NSInteger cellCount = ceilf(array.count / pointCount);
    
    NSInteger hei = cellCount * height + (cellCount + 1) * cellGap;
    CGFloat start_y = view_h - top;
    
    CGContextSetLineWidth(context, _GridLineWidth);
    CGContextSetStrokeColorWithColor(context, [UIColor redColor].CGColor);
    for (int i = 0; i <= hei / k; i ++) {
        CGContextMoveToPoint(context, left , start_y);
        CGContextAddLineToPoint(context, view_w - right, start_y);
        CGContextStrokePath(context);
        start_y -= k;
    }
    
    // 竖线
    NSInteger vCount = floorf((view_w - left - right) / k);
    for (int i = 0; i <= vCount; i ++) {
        
        CGContextMoveToPoint(context, left + k * i, view_h - top);
        if(i%5==0){
            CGContextSetStrokeColorWithColor(context, [UIColor blackColor].CGColor);
            CGContextAddLineToPoint(context, left + k * i, start_y + k-10);
            
            [self DrawTextWith:context string:[NSString stringWithFormat:@"%d",i/5] color:[UIColor blackColor] fontSize:13 rect:CGRectMake(left + k * i-10, start_y + k-20, 20, 10) fontName:CFSTR("Helvetica-Bold")];
        }
        else
        {
            CGContextSetStrokeColorWithColor(context, [UIColor redColor].CGColor);
            CGContextAddLineToPoint(context, left + k * i, start_y + k);
        }
        CGContextStrokePath(context);
    }
    CGContextSetStrokeColorWithColor(context, [UIColor redColor].CGColor);
    // 绘制波形
    CGContextSetLineWidth(context, _LineWidth);
    CGContextSetStrokeColorWithColor(context, [UIColor blackColor].CGColor);
    NSInteger count = 0;
    NSInteger cell = 0;
    
    for (int i = 0; i < array.count - 1; i ++) {
        
        //6000
        float k_1 = [array[i] floatValue]+1.5;
        float k_2 = [array[i + 1] floatValue]+1.5;
        
        if (k_1 > max) {
            k_1 = max;
        }
        if (k_1 < 0) {
            k_1 = 0;
        }
        
        if (k_2 > max) {
            k_2 = max;
        }
        if (k_2 < 0) {
            k_2 = 0;
        }
        
        CGFloat x_1 = left + count * gap;
        CGFloat kk = (height - k_1 / 1.0 / max * height);
        
        CGFloat y_1 = view_h - (cell * (height + cellGap) + kk) - top - cellGap;
        CGPoint point_1 = CGPointMake(x_1, y_1);
        
        CGFloat x_2 = left + (count + 1) * gap;
        CGFloat y_2 = view_h - (cell * (height + cellGap) + (height - k_2 / 1.0 / max * height)) - top - cellGap;
        CGPoint point_2 = CGPointMake(x_2, y_2);
        
        CGContextMoveToPoint(context, point_1.x  ,point_1.y);
        CGContextAddLineToPoint(context, point_2.x, point_2.y);
        CGContextStrokePath(context);
        
        count ++;
        
        ///*
        if (x_2 >= view_w - right) {
            count = 0;
            cell ++;
        }
        //*/
        
        /*
         if (count >= pointCount) {
         count = 0;
         cell ++;
         }
         */
    }
    // 绘制message_3
    CGFloat width_3 = [self getStringWidthFontSize:13 string:_Message_3];
    CGRect rect_3 = CGRectMake((view_w - width_3), view_h - top - 15, width_3, 20);
    [self DrawTextWith:context string:_Message_3 color:[UIColor blackColor] fontSize:13 rect:rect_3 fontName:CFSTR("Helvetica")];
    
    // 绘制message_4
    CGFloat width_4 = [self getStringWidthFontSize:13 string:_Message_4];
    CGRect rect_4 = CGRectMake((view_w - width_4), start_y + 25, width_4, 20);
    [self DrawTextWith:context string:_Message_4 color:[UIColor blackColor] fontSize:13 rect:rect_4 fontName:CFSTR("Helvetica")];
    
}

/*
 * 获取pdf绘图上下文
 * inMediaBox指定pdf页面大小
 * path指定pdf文件保存的路径
 */
CGContextRef MyPDFContextCreate_2051 (const CGRect *inMediaBox, CFStringRef path) {
    CGContextRef myOutContext = NULL;
    CFURLRef url;
    CGDataConsumerRef dataConsumer;
    
    url = CFURLCreateWithFileSystemPath (NULL, path, kCFURLPOSIXPathStyle, false);
    
    if (url != NULL) {
        dataConsumer = CGDataConsumerCreateWithURL(url);
        if (dataConsumer != NULL) {
            myOutContext = CGPDFContextCreate (dataConsumer, inMediaBox, NULL);
            CGDataConsumerRelease (dataConsumer);
        }
        CFRelease(url);
    }
    return myOutContext;
}

- (void)setFileName:(NSString *)fileName {
    _fileName = fileName;
}

- (void)setTitle:(NSString *)Title {
    _Title = Title;
}
@end
