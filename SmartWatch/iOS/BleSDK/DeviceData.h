//
//  DeviceData.h
//  BleSDK
//
//  Created by yang sai on 2022/4/27.
//

#import <Foundation/Foundation.h>
#import "BleSDK_Header.h"
NS_ASSUME_NONNULL_BEGIN

@interface DeviceData : NSObject
@property  DATATYPE dataType;
@property(nullable,nonatomic) NSDictionary * dicData;
@property BOOL dataEnd;
@end

NS_ASSUME_NONNULL_END
