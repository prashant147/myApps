package com.jstyle.test2025.activity;

import android.os.Bundle;
import android.support.v7.widget.SwitchCompat;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.TextView;
import com.jstyle.blesdk2025.Util.BleSDK;
import com.jstyle.blesdk2025.constant.BleConst;
import com.jstyle.test2025.R;
import java.util.Map;
import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * 测量控制 HRV,心率，血氧（Health measurement control）
 */
public class MeasurementActivity extends BaseActivity {
    @BindView(R.id.radioGroup_mian)
    RadioGroup radioGroup_mian;
    @BindView(R.id._switch)
    SwitchCompat _switch;
    @BindView(R.id.data_info)
    TextView data_info;
    @BindView(R.id.data_info2)
    TextView data_info2;

    @BindView(R.id.send)
    Button send;

    @BindView(R.id.ppgppi_LinearLayout)
    LinearLayout ppgppi_LinearLayout;
    @BindView(R.id._ppgswitch)
    SwitchCompat _ppgswitch;
    @BindView(R.id._ppiswitch)
    SwitchCompat _ppiswitch;

    int type=1;
    boolean open=false;
    boolean openppg=false;
    boolean openppi=false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_measurement);
        ButterKnife.bind(this);
        radioGroup_mian.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                switch (checkedId){
                    case R.id.hrv://HRV测量
                        type=1;
                        ppgppi_LinearLayout.setVisibility(View.VISIBLE);
                        break;
                    case R.id.heart://心率测量
                        type=2;
                        ppgppi_LinearLayout.setVisibility(View.GONE);
                        break;
                    case R.id.oxygen://血氧测量
                        type=3;
                        ppgppi_LinearLayout.setVisibility(View.GONE);
                        break;
                }

            }
        });
        _switch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                open=isChecked;
            }
        });
        _ppgswitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                openppg=isChecked;
            }
        });
        _ppiswitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                openppi=isChecked;
            }
        });
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(1==type){
                    sendValue(BleSDK.StartDeviceMeasurementWithHrv(open,openppg,openppi));
                }else{
                    sendValue(BleSDK.StartDeviceMeasurementWithType(type,open));
                }
            }
        });

    }




    @Override
    public void dataCallback(Map<String, Object> maps) {
        super.dataCallback(maps);
        String dataType= getDataType(maps);
        Log.e("dataCallback",maps.toString());
        switch (dataType){
            case BleConst.MeasurementHeartCallback:
            case BleConst.MeasurementOxygenCallback:
            case BleConst.realtimePPGData:
                data_info.setText("");
                data_info.setText(maps.toString());
                break;

            case BleConst.realtimePPIData:
                data_info2.setText("");
                data_info2.setText(maps.toString());
                break;
        }}

}
