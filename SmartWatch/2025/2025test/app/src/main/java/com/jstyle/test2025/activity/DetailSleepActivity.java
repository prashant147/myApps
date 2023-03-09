package com.jstyle.test2025.activity;

import android.os.Bundle;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import com.jstyle.blesdk2025.Util.BleSDK;
import com.jstyle.blesdk2025.constant.BleConst;
import com.jstyle.blesdk2025.constant.DeviceKey;
import com.jstyle.test2025.R;
import com.jstyle.test2025.adapter.DetailDataAdapter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * 睡眠历史数据 （sleep history data）
 */
public class DetailSleepActivity extends BaseActivity {
    @BindView(R.id.RecyclerView_detailData)
    RecyclerView RecyclerViewDetailData;
    private DetailDataAdapter detailDataAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sleep_data);
        ButterKnife.bind(this);
        init();
    }

    private void init() {
        LinearLayoutManager linearLayoutManager=new LinearLayoutManager(this);
        linearLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        RecyclerViewDetailData.setLayoutManager(linearLayoutManager);
        detailDataAdapter=new DetailDataAdapter();
        RecyclerViewDetailData.setAdapter(detailDataAdapter);
        DividerItemDecoration dividerItemDecoration=new DividerItemDecoration(this,DividerItemDecoration.VERTICAL);
        RecyclerViewDetailData.addItemDecoration(dividerItemDecoration);

    }

    byte ModeStart=0x00;       //开始获取数据 start getting data
    byte ModeContinue=0x02;    //继续读取数据 continue reading data
    byte ModeDelete=(byte) 0x99;//删除数据  delete data
    @OnClick({R.id.bt_readData, R.id.bt_DeleteData})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.bt_readData://获取睡眠历史数据 Get sleep history data
                list.clear();
                dataCount=0;
                getDetailData(ModeStart);
                break;
            case R.id.bt_DeleteData://删除睡眠历史数据 Delete sleep history data
                list.clear();
                detailDataAdapter.Clear();
                getDetailData(ModeDelete);
                break;
        }
    }
    List<Map<String,String>>list=new ArrayList<>();
    int dataCount=0;
    private static final String TAG = "DetailDataActivity";
    @Override
    public void dataCallback(Map<String, Object> maps) {
        super.dataCallback(maps);
        String dataType= getDataType(maps);
        boolean finish=getEnd(maps);
        switch (dataType){
            case BleConst.GetDetailSleepData://睡眠数据返回字段 Sleep data return field
                list.addAll((List<Map<String,String>>)maps.get(DeviceKey.Data));
                dataCount++;
                if(finish){
                    disMissProgressDialog();
                    detailDataAdapter.setData(list,DetailDataAdapter.GET_SLEEP_DETAIL);
                }
                if(dataCount==50){
                    dataCount=0;
                    if(finish){
                        disMissProgressDialog();
                        detailDataAdapter.setData(list,DetailDataAdapter.GET_SLEEP_DETAIL);
                    }else{
                        getDetailData(ModeContinue);
                    }
                }
                break;

            case BleConst.Delete_GetDetailSleepData://删除睡眠数据后返回字段 Return field after deleting sleep data
                showDialogInfo(maps.toString());
                disMissProgressDialog();
                break;
        }

    }
    private void getDetailData(byte mode){
        showProgressDialog("Synchronous Data");//同步数据
        /**
         * dateOfLastData 设备返回所有数据后最后的时间戳，第一次没有的情况为null，或者“”，同步数据后保存数据库
         *dateOfLastData The last timestamp after the device returns all data, null if there is no data for the first time, or "", save the database after synchronizing the data
         */
        sendValue(BleSDK.GetDetailSleepDataWithMode(mode,""));//发送命令给设备 send command to device

    }
}
