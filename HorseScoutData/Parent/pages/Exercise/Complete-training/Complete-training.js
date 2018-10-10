// pages/Exercise/Complete-training/Complete-training.js
import * as echarts from '../../../ec-canvas/echarts';
Page({
  data: {
    peopleEc: {
      onInit: initChartPeople
    }
  },
  //回到首页
  returnhome: function () {
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
  //写心得
  training: function () {
    wx.navigateTo({
      url: '../../../pages/Exercise/Training-feelings/Training-feelings',
    })
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})
function initChartPeople(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '0-100分',
      textStyle: {
        color: '#666',
        fontSize: 13,
        fontWeight: 'normal'
      },
      right: '4%',
      top: 8
    },
    /*tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#fff'
            }
        }
    },*/
    grid: {
      left: '3%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    },
    yAxis: {
      type: 'value',
      name: '人数(人)',
      nameGap: 35,
      nameTextStyle: {
        color: '#666',
        fontSize: 13
      },
      splitNumber: 2,
      splitLine: {
        lineStyle: {
          color: '#e2e2e2',
          type: 'solid'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        data: [0, 10, 90, 18, 30, 45, 55, 70, 88, 37, 0],
        type: 'line',
        showSymbol: false,
        symbolSize: 2,
        smooth: true,
        itemStyle: {
          normal: {
            color: "#F882B6"
          },
        },
        lineStyle: {
          width: 1
        },
        areaStyle: {
          normal: {
            color: '#F882B6',
            opacity: 0.3
          }
        },
        markPoint: {
          symbol: 'roundRect',
          symbolSize: [34, 24],
          symbolOffset: [16, -20],
          label: {
            formatter: function (param) {
              return param.value + '人';
            }
          },
          itemStyle: {
            color: '#5cd3c9'
          },
          data: [{
            name: '最大值',
            type: 'max'
          }]
        }
      },
      {
        type: 'bar',
        barWidth: '1',
        itemStyle: {
          normal: {
            color: "#fff"
          },
        },
        data: [0, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0],

      }
    ]
  };

  chart.setOption(option);
  return chart;
}