package com.jstyle.test2025.activity;

import android.os.Bundle;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import com.jstyle.blesdk2025.Util.BleSDK;
import com.jstyle.blesdk2025.constant.BleConst;
import com.jstyle.blesdk2025.constant.DeviceKey;
import com.jstyle.test2025.R;
import com.jstyle.test2025.adapter.HeartRateDataAdapter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
/**
 *获得静态心率历史数据 (Get static heart rate historical data)
 */
public class HeartRateStaticInfoActivity extends BaseActivity {
    @BindView(R.id.RecyclerView_heartData)
    RecyclerView RecyclerViewHeartData;
    private HeartRateDataAdapter heartRateDataAdapter;
    byte ModeStart=0x00;       //开始获取数据 start getting data
    byte ModeContinue=0x02;    //继续读取数据 continue reading data
    byte ModeDelete=(byte) 0x99;//删除数据  delete data
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_heart_rate_static_info);
        ButterKnife.bind(this);
        init();
    }
    private void init() {
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        linearLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        RecyclerViewHeartData.setLayoutManager(linearLayoutManager);
        heartRateDataAdapter = new HeartRateDataAdapter();
        RecyclerViewHeartData.setAdapter(heartRateDataAdapter);
        DividerItemDecoration dividerItemDecoration=new DividerItemDecoration(this,DividerItemDecoration.VERTICAL);
        RecyclerViewHeartData.addItemDecoration(dividerItemDecoration);

    }

    @OnClick({R.id.bt_readData, R.id.bt_DeleteData})
    public void onViewClicked(View view) {
            switch (view.getId()) {
                case R.id.bt_readData://获得静态心率历史数据 Get static heart rate historical data
                    list.clear();
                    dataCount=0;
                    GetStaticHRWithMode(ModeStart);
                    break;
                case R.id.bt_DeleteData://删除静态心率历史数据 Deleting static heart rate history data
                    GetStaticHRWithMode(ModeDelete);
                    break;
        }
    }
    List<Map<String,String>>list=new ArrayList<>();
    int dataCount=0;
    private static final String TAG = "HeartRateInfoActivity";
    @Override
    public void dataCallback(Map<String, Object> maps) {
        super.dataCallback(maps);
        String dataType= getDataType(maps);
        boolean finish=getEnd(maps);
        switch (dataType){
            case BleConst.Delete_GetStaticHR://删除历史静态心率历史返回结果 Delete History Static Heart Rate History Return Results
                showDialogInfo(maps.toString());
                break;
            case BleConst.GetStaticHR://获取历史静态心率历史返回结果 Get historical static heart rate historical return results
                dataCount++;
                list.addAll((List<Map<String,String>>)maps.get(DeviceKey.Data));
                if(finish){
                    heartRateDataAdapter.setData(list,HeartRateDataAdapter.GET_ONCE_HEARTDATA);
                }
                if(dataCount==50){
                    dataCount=0;
                    if(finish){
                        heartRateDataAdapter.setData(list,HeartRateDataAdapter.GET_ONCE_HEARTDATA);
                    }else{
                        GetStaticHRWithMode(ModeContinue);
                    }
                }
                break;
        }
    }


    private void GetStaticHRWithMode(byte mode){
        /**
         * dateOfLastData 设备返回所有数据后最后的时间戳，第一次没有的情况为null，或者“”，同步数据后保存数据库
         *dateOfLastData The last timestamp after the device returns all data,
         * null if there is no data for the first time, or "", save the database after synchronizing the data
         */
        sendValue(BleSDK.GetStaticHRWithMode(mode,""));

    }
}
