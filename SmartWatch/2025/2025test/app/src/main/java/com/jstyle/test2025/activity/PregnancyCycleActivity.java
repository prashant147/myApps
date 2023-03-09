package com.jstyle.test2025.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.jstyle.blesdk2025.Util.BleSDK;
import com.jstyle.blesdk2025.constant.BleConst;
import com.jstyle.blesdk2025.model.PregnancyCycle;
import com.jstyle.blesdk2025.model.WomenHealth;
import com.jstyle.test2025.R;
import com.jstyle.test2025.Util.DateUtil;

import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * PregnancyCycle
 */
public class PregnancyCycleActivity extends BaseActivity {
    @BindView(R.id.info)
    TextView info;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pregnancy_cycle);
        ButterKnife.bind(this);
    }

    @OnClick({R.id.set,R.id.get})
    public void onViewClicked(View view) {
        switch (view.getId()){
            case R.id.set://设置怀孕周期信息 Set pregnancy cycle information
                PregnancyCycle pregnancyCycle=new PregnancyCycle();
                //经期开始时间 Period start time  yyyy-MM-dd
                pregnancyCycle.setMenstrualPeriod_StartTime(DateUtil.getFormatTimeString(System.currentTimeMillis(),"yyyy-MM-dd"));
                sendValue(BleSDK.SetPregnancyCycle(pregnancyCycle));
                break;
            case R.id.get://获取怀孕周期信息 Get pregnancy cycle information
                sendValue(BleSDK.FindPregnancyCycleInfo());
                break;
        }
    }


    @Override
    public void dataCallback(Map<String, Object> maps) {
        super.dataCallback(maps);
        String dataType= getDataType(maps);
        Log.e("dataCallback",maps.toString());
        switch (dataType){
            case BleConst.SetPregnancyCycle:
            case BleConst.GetPregnancyCycle:
            if(null!=info){
                info.setText(maps.toString());
            }
                break;
        }}

}
