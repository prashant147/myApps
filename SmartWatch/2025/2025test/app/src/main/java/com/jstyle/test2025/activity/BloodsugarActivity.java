package com.jstyle.test2025.activity;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.jstyle.blesdk2025.Util.BleSDK;
import com.jstyle.blesdk2025.constant.BleConst;
import com.jstyle.blesdk2025.constant.DeviceKey;
import com.jstyle.test2025.R;
import com.jstyle.test2025.Util.CustomCountDownTimer;
import com.jstyle.test2025.ble.BleManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import lecho.lib.hellocharts.gesture.ContainerScrollType;
import lecho.lib.hellocharts.gesture.ZoomType;
import lecho.lib.hellocharts.model.Axis;
import lecho.lib.hellocharts.model.AxisValue;
import lecho.lib.hellocharts.model.Line;
import lecho.lib.hellocharts.model.LineChartData;
import lecho.lib.hellocharts.model.PointValue;
import lecho.lib.hellocharts.model.Viewport;
import lecho.lib.hellocharts.view.AbstractChartView;
import lecho.lib.hellocharts.view.LineChartView;

/**
 * 血糖  blood sugar
 */
public class BloodsugarActivity extends BaseActivity {
    @BindView(R.id.progress)
    TextView progress;
    @BindView(R.id.info)
    TextView info;

    @BindView(R.id.lineChartView_ppg)
    LineChartView lineChartView_ppg;



    CustomCountDownTimer customCountDownTimer;//计时器 timer
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_blood_sugar);
        ButterKnife.bind(this);
        initDataChartView(lineChartView_ppg, 0, 60000, 500, 20000);
        lineChartView_ppg.setLineChartData(getEcgLineChartData(new ArrayList<Double>())) ;
        final float alltime=5*60*1000f;//五分钟 Five Minutes
        customCountDownTimer=   new CustomCountDownTimer((long) alltime, 1000, new CustomCountDownTimer.TimerTickListener() {
            @SuppressLint("DefaultLocale")
            @Override
            public void onTick(final long millisLeft) {
                if(null!=progress){
                    BloodsugarActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            float baifenbi=(alltime-millisLeft)/alltime*100f;
                            if(baifenbi>99){
                                baifenbi=100.0f;
                            }
                            //Log.e("sdnbamndamdn","ssdsds");
                            if(baifenbi-Float.valueOf(baifenbi).intValue()==0){
                                progress.setText(Float.valueOf(baifenbi).intValue()+"%");
                                BleManager.getInstance().writeValue(BleSDK.ppgWithMode(4,(int) baifenbi));
                            }
                        }
                    });
                }
            }
            @Override
            public void onFinish() {
                this.onCancel();
                Toast.makeText(BloodsugarActivity.this,"After the blood glucose data test is completed, it needs to be sent to the server to get the results",Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onCancel() { }
        }) {};
    }

    @OnClick({R.id.start,R.id.suspend,R.id.Stop})
    public void onViewClicked(View view) {
        switch (view.getId()){
            case R.id.start:
                customCountDownTimer.start();
                BleManager.getInstance().writeValue(BleSDK.ppgWithMode(1,2));
                break;
            case R.id.suspend:
                customCountDownTimer.pause();
                BleManager.getInstance().writeValue(BleSDK.ppgWithMode(3,0));
                break;
            case R.id.Stop:
                customCountDownTimer.cancel();
                BleManager.getInstance().writeValue(BleSDK.ppgWithMode(5,0));
                finish();
                break;
        }
    }

    List<Double> q1=new ArrayList<>();
    @Override
    public void dataCallback(Map<String, Object> maps) {
        super.dataCallback(maps);
        String dataType= getDataType(maps);
        Log.e("dataCallback",maps.toString());
        switch (dataType){
            case BleConst.realtimePPIData:
                Map<String,String> DD= getData(maps);
                String[] realtimePPIData = DD.get(DeviceKey.KPPGData).split(",");

                for ( int i=0;i<realtimePPIData.length;i++){
                    Log.e("jdnandand",realtimePPIData[i]);
                    q1.add(Double.valueOf(realtimePPIData[i])) ;
                    if(null!=lineChartView_ppg){
                        lineChartView_ppg.setLineChartData(getEcgLineChartData(q1)) ;
                    }
                }

                break;
            case BleConst.ppgStartSucessed:
            case BleConst.ppgResult:
            case BleConst.ppgStop:
            case BleConst.ppgMeasurementProgress:
            case BleConst.ppgQuit:
            case BleConst.ppgStartFailed:
                if(null!=info){
                    info.setText(maps.toString());
                }
                break;
        }}






    LineChartData getEcgLineChartData(List<Double> queue) {

        if(q1.size()>=500){
            q1.remove(0) ;
        }
        List<PointValue> listPoint = new ArrayList<>();
        LineChartData lineChartData = new LineChartData();
        List<Line> listLines = new ArrayList<>();
        for (int i = 0; i < queue.size(); i++) {
            Double data = queue.get(i);
            PointValue pointValue = new PointValue();
            if (data != null) {
                double v = data;
                pointValue.set(i, (float) v);
                listPoint.add(pointValue);
            }
        }
        Line line = new Line();
        line.setValues(listPoint);
        line.setColor(Color.GREEN);
        line.setCubic(false);
        line.setStrokeWidth(1);
        line.setHasPoints(false);


        List<AxisValue> values=new ArrayList<>();

        values.add(new AxisValue(60000, "6W".toCharArray()));
        values.add(new AxisValue(0, "0".toCharArray()));
        Axis axis=new Axis();
        axis.setTextColor(Color.BLACK);
        axis.setValues(values);
        axis.setHasLines(true);
        axis.setMaxLabelChars(4);
        lineChartData.setAxisYLeft(axis);
        Line linethere = new Line();

        linethere.setColor(Color.RED);
        linethere.setCubic(false);
        linethere.setStrokeWidth(1);
        linethere.setHasPoints(false);
        listLines.add(line);
        lineChartData.setLines(listLines);
        return lineChartData;
    }


    public static void initDataChartView(AbstractChartView chart, float left, float top, float right, float bottom) {
        Viewport viewport = chart.getCurrentViewport();
        viewport.top = top;
        viewport.bottom = bottom;
        viewport.left = left;
        viewport.right = right;
        chart.setScrollEnabled(true);
        chart.setContainerScrollEnabled(true, ContainerScrollType.VERTICAL);
        chart.setViewportCalculationEnabled(false);
        chart.setMaximumViewport(viewport);
        chart.setZoomType(ZoomType.HORIZONTAL_AND_VERTICAL);
        chart.setCurrentViewport(viewport, false);
    }

}
