package com.jstyle.test2025.activity;

import android.os.Bundle;
import android.text.format.DateUtils;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.jstyle.blesdk2025.Util.BleSDK;
import com.jstyle.blesdk2025.constant.BleConst;
import com.jstyle.blesdk2025.model.WomenHealth;
import com.jstyle.test2025.R;
import com.jstyle.test2025.Util.DateUtil;

import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * WomenHealth
 */
public class WomenHealthActivity extends BaseActivity {
    @BindView(R.id.info)
    TextView info;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_womenhealth);
        ButterKnife.bind(this);
    }

    @OnClick({R.id.set,R.id.get})
    public void onViewClicked(View view) {
        switch (view.getId()){
            case R.id.set://设置女性健康信息 Set women's health information
                WomenHealth womenHealth=new WomenHealth();
                //经期开始时间  Period start time yyyy-MM-dd
                womenHealth.setMenstrualPeriod_StartTime(DateUtil.getFormatTimeString(System.currentTimeMillis(),"yyyy-MM-dd"));
               // 经期长度，默认7天,2-8  Length of menstrual period, 7 days by default, 2-8
                womenHealth.setMenstrualPeriod_Lenth(7);
                //经期周期，默认30天 21-35 Menstrual period, default 30 days 21-35
                womenHealth.setMenstrualPeriod_Period(30);
                sendValue(BleSDK.SetWomenHealth(womenHealth));
                break;
            case R.id.get://获取女性健康信息 Access to women's health information
                sendValue(BleSDK.FindWomenHealthInfo());
                break;
        }
    }


    @Override
    public void dataCallback(Map<String, Object> maps) {
        super.dataCallback(maps);
        String dataType= getDataType(maps);
        Log.e("dataCallback",maps.toString());
        switch (dataType){
            case BleConst.SetWomenHealth:
            case BleConst.GetWomenHealth:
            if(null!=info){
                info.setText(maps.toString());
            }
                break;
        }}

}
