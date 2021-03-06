// pages/Exercise/Test-complete/Test-complete.js
import * as echarts from '../../../ec-canvas/echarts';
const app = getApp().globalData;
Page({
  data: {
    // peopleEc: {
    //   onInit: initChartPeople
    // },
    finalScore : 0,
    score : 0,
    NowScore : 0,
    scoreTimer : "",
    defeatProportion : 0,
    remainNum : 0,
    pageNo : 1,
    childId : 0,
    testId : 0,
    historyLst : [],
    list : [],
    array : []
  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      childId: options.childrenid,
      testId: options.testId
    })
    getHistoryTestResult(this.data.childId,this.data.testId,that,this.data.pageNo)
    wx.request({
      url: app.rQUrl + '/v1/corporeityTest/getTestResult',
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
      data: {
        parentId: wx.getStorageSync('userInfo').userId,
        childrenId: parseFloat(options.childrenid)
      },
      success: function (res) {
        if (res.data.code == 10000){
          let result = res.data.response;
          let array = new Array();
          let array1 = new Array();
          let array2 = new Array();
          for (let i = 0; i < result.list.length; i++) {
            if (i == result.score) {
              array1.push(result.list[i]);
              array.push(i)
              continue;
            }
            if (i % 10 == 0) {
              array1.push(result.list[i]);
              array.push(i)
            }
          }
          console.log(array1)
          that.setData({
            finalScore : res.data.response.score,
            defeatProportion: res.data.response.defeatProportion,
            remainNum: res.data.response.remainNum ,
            list : array1,
            // peopleNumList: res.data.response.peopleNumList,
            array : array
          })
          const ctx = wx.createCanvasContext('circle');
          var linearGradient = ctx.createLinearGradient(100, 0, 0, 100);
          linearGradient.addColorStop(0, "#72B9E7");
          linearGradient.addColorStop(1, "#4DD0C8");
          that.data.scoreTimer = setInterval(function () {
            if (that.data.NowScore <= parseInt(that.data.finalScore) / 50) {
              that.setData({
                NowScore: that.data.NowScore + 0.05,
                score: parseInt(that.data.NowScore * 50 + 2.5)
              })
              initCircle(that.data.NowScore, linearGradient, ctx)
            }
            else {
              clearInterval(that.data.scoreTimer)
            }
          }, 30)
        }
      }
    })
  },
  init_sca() {
    this.scaComponnet.init((canvas, width, height) => {
      const scaChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      scaChart.setOption(this.getScaOption());
      return scaChart;
    });
  },
  getScaOption() {
    var option = {
      title: {
        text: '分值0-100分',
        textStyle: {
          color: '#666',
          fontSize: 13,
          fontWeight: 'normal'
        },
        right: '4%',
        top: 8
      },
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
        name: '分值总人数',
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
          data: [],
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
        },
        {
          type: 'bar',
          barWidth: '2',
          itemStyle: {
            normal: {
              color: "#fff"
            },
          },
          data: [],
          markPoint: {
            symbol: 'roundRect',
            symbolSize: [28, 20],
            symbolOffset: [16, -20],
            label: {
              formatter: function (param) {
                return param.value + '分';
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
        }
      ]
    };
    if (this.data.array.length > 1) {
      option.series[0].data = this.data.list;
      option.xAxis.data = this.data.array;
    } else {
      option.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      option.xAxis.data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    }
    return option;
  },
  onReady: function () {

  },
  onShow: function () {
    this.scaComponnet = this.selectComponent('#mychart3');
    this.init_sca();
  },
  //回到首页
  returnhome: function () {
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
  testAgain(){
    wx.navigateBack({
      delta: 1
    })
  },
  testOthers(){
    wx.navigateTo({
      url: '../../../pages/Exercise/Physical-Test/Physical-Test?childrenid=' + this.data.childId,
    })
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  onReachBottom() {
    let that = this;
    getHistoryTestResult(this.data.childId, this.data.testId, that, this.data.pageNo)
  }
})
// 画圆
function initCircle(c, linearGradient, ctx){
  ctx.setStrokeStyle(linearGradient)
  ctx.setLineWidth(4);
  ctx.beginPath();
  ctx.arc(64, 64, 60, - 0.5 * Math.PI,  (c - 0.5) * Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.draw()
}


// function initChartPeople(canvas, width, height) {
//   const chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   });
//   canvas.setChart(chart);

//   var option = {
//     title: {
//       text: '0-100分',
//       textStyle: {
//         color: '#666',
//         fontSize: 13,
//         fontWeight: 'normal'
//       },
//       right: '4%',
//       top: 8
//     },
//     /*tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             lineStyle: {
//                 color: '#fff'
//             }
//         }
//     },*/
//     grid: {
//       left: '3%',
//       right: '4%',
//       bottom: '2%',
//       containLabel: true
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       axisLine: {
//         show: false
//       },
//       axisTick: {
//         show: false
//       },
//       data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
//     },
//     yAxis: {
//       type: 'value',
//       name: '人数(人)',
//       nameGap: 35,
//       nameTextStyle: {
//         color: '#666',
//         fontSize: 13
//       },
//       splitNumber: 2,
//       splitLine: {
//         lineStyle: {
//           color: '#e2e2e2',
//           type: 'solid'
//         }
//       },
//       axisLine: {
//         show: false
//       },
//       axisTick: {
//         show: false
//       }
//     },
//     series: [
//       {
//         data: [0, 10, 90, 18, 30, 45, 55, 99, 88, 37, 0],
//         type: 'line',
//         showSymbol: false,
//         symbolSize: 2,
//         smooth: true,
//         itemStyle: {
//           normal: {
//             color: "#F882B6"
//           },
//         },
//         lineStyle: {
//           width: 1
//         },
//         areaStyle: {
//           normal: {
//             color: '#F882B6',
//             opacity: 0.3
//           }
//         },
//         markPoint: {
//           symbol: 'roundRect',
//           symbolSize: [34, 24],
//           symbolOffset: [16, -20],
//           label: {
//             formatter: function (param) {
//               return param.value + '人';
//             }
//           },
//           itemStyle: {
//             color: '#5cd3c9'
//           },
//           data: [{
//             name: '最大值',
//             type: 'max'
//           }]
//         }
//       },
//       {
//         type: 'bar',
//         barWidth: '1',
//         itemStyle: {
//           normal: {
//             color: "#fff"
//           },
//         },
//         data: [0, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0],

//       }
//     ]
//   };
//   chart.setOption(option);
//   return chart;
// }

function getHistoryTestResult(childId,testId,that,pageNo){
  wx.request({
    url: app.rQUrl + '/v1/corporeityTest/getHistoryTestResult',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: {
      testId: parseFloat(testId),
      childrenId: parseFloat(childId),
      pageNo: pageNo,
      pageSize: 5
    },
    success: function (res) {
      if (res.data.code == 10000) {
          that.setData({
            historyLst: that.data.historyLst.concat(res.data.response),
            pageNo: that.data.pageNo + 1
          })
      }else{
        that.setData({
          isMore: true
        })
      }
    }
  })
}
