//index.js
import util from '../../utils/util.js';
import * as echarts from '../../ec-canvas/echarts';
const app = getApp().globalData;
const itemWidth = 84;
Page({
  data: {
    imgUrl: app.url,
    movies: [
      { "patriarchId": 8, "relationCode": "03", "childrenId": 82, "realName": "eason", "idCard": null, "haveIdCard": "0", "height": 1550, "weight": 450, "bmi": 18, "provinceId": 510, "cityId": 510100000000, "schoolType": "1", "schoolId": 2420, "grade": 1, "childrenClass": 1, "gender": "1", "haveGuardian": null, "childrenAge": 8, "dec": "#A188D4", "id": 0, "headImg": app.url + 'Patriarch/head-portrait.png',}
    ],
    thisnum: 0,
    physiqueEc: {lazyLoad: true},
    peopleEc: {lazyLoad: true},
    boxWidth: 0,
    isLoading: false, 
    TestAgeResult:{}, 
    StatisticList:[],
    childId: 0,
    pageNo: 1,
    pageSize: 10,
    height: 260,
    totalTime: 0,
    dayTime: 0,
    weekTime: 0,
    totalDay: 0,
    continueDay: 0,
    isMore:false,
    childrenId:48,
    heights: 300,
    cardiopulmonaryFunctionValue:0,
    cardiopulmonaryFunctionValues:0,
    bmiValue:0,
    bmiValues:0,
    keyList:[],
    keyListStatus:false,
    peopleNumList: [],
    array: [],
    array1: [],
    array2: [],
    unregistered: 3,//1用户未注册，2用户注册但未添加孩子信息，3用户注册并添加了孩子信息，但系统没有该用户数据
    isLogin:false,//用户未注册或者未添加孩子的时候不显示再次测试和选择锻炼计划
  },
  onLoad(e) { },
  init_bar() {
    this.barComponent.init((canvas, width, height) => {
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getBarOption());
      return barChart;
    });
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
  getBarOption(){
    var option = {
      backgroundColor: '#fff',
      radar: [
        {
          indicator: [],
          center: ['50%', '50%'],
          radius: '80%',
          startAngle: 60,
          splitNumber: 10,
          shape: 'circle',
          name: {
            textStyle: {
              color: '#666',
              fontSize: 14
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(0, 0, 0, 0)']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E6E6E6'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#E6E6E6'
            }
          }
        }
      ],
      series: [
        {
          name: '体质统计',
          type: 'radar',
          data: [
            {
              value: [],
              name: '图1',
              symbol: 'circle',
              itemStyle: {
                color: '#FDC54A'
              },
              lineStyle: {
                width: 1,
                color: '#FDC54A'
              },
              label: {
                show: true,
                color: '#FDC54A',
                fontWeight:'bold',
                fontSize:13,
                position: 'insideTopLeft',
                distance:5,
                rich: {
                  a: {
                    color: '#fff'
                  }
                }
              },
              areaStyle: {
                normal: {
                  color: '#FDC54A',
                  opacity: 0.25
                }
              }
            }
          ]
        }
      ]
    }; 
    let keyList = this.data.keyList;
    if (keyList.length>1){
      for (var i = 0, seriesArray = [], objArry = []; i < keyList.length; i++) {
        objArry.push({ "text": keyList[i].name, "max": 10 })
        seriesArray.push(parseFloat(keyList[i].pointValue).toFixed(1))
      }
      option.radar[0].indicator = objArry;
      option.series[0].data[0].value = seriesArray;
    }else{
      option.radar[0].indicator = [
        { text: '力量', max: 10 },
        { text: '速度', max: 10 },
        { text: '耐力', max: 10 },
        { text: '柔韧', max: 10 },
        { text: '协调', max: 10 }
      ];
      option.series[0].data[0].value = [0, 0, 0, 0, 0];
    }
    
    return option;
  },
  getScaOption(){
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
    if (this.data.array.length>1){
      option.series[0].data = this.data.array1;
      option.series[1].data = this.data.array2;
      option.xAxis.data = this.data.array;
    }else{
      option.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      option.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      option.xAxis.data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    }
    return option;  
  },
  onReady(e){},
  onReady(){},
  onShow(){
    const that = this;
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').oauthToken.token){
        //用户注册，判断是否添加孩子
      if (wx.getStorageSync('userInfo').childrenList.length>0){//有孩子
        let childrenList = wx.getStorageSync('userInfo').childrenList;
        for (let i = 0; i < childrenList.length;i++){
          childrenList[i].id = i;
          childrenList[i].dec = util.colorArr[i];
          childrenList[i].headImg = app.url + 'Patriarch/head-portrait.png'
        }
        that.setData({ 
          unregistered: 3 ,
          movies: childrenList,
          isLogin: !that.data.isLogin
        })
      }else{//无孩子
        that.setData({ unregistered: 2})
      }
        getStatisticList(that)
        getTestAgeResult(that)
        var interval = setInterval(function(){
          if (that.data.keyListStatus){
            that.barComponent = that.selectComponent('#mychart-dom2');
            that.init_bar();
            that.scaComponnet = that.selectComponent('#mychart-dom3');
            that.init_sca();
            clearInterval(interval)
            interval = null;
            return;
          }else{
            setTimeout(() => {
              clearInterval(interval)
              interval = null;
              return;},2000)
          }
        },500);
      }else{
        //用户未注册
        getStatisticList(that)
        that.setData({ unregistered:1})
        that.barComponent = that.selectComponent('#mychart-dom2');
        that.init_bar();
        that.scaComponnet = that.selectComponent('#mychart-dom3');
        that.init_sca();
      }
  },
  onHide(){},
  onUnload(){},
  onPullDownRefresh() {},
  onReachBottom(){},
  onShareAppMessage() {},
  Testagin() {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').oauthToken.token){
      wx.navigateTo({
        url: '../../pages/Patriarch/Test/Test',
      })
    }else{
      this.goRegister();
    }
  },
  ExerciseProgram () {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').oauthToken.token){
      wx.switchTab({
        url: '../../pages/Exercise/Exercise-Program/Exercise-Program',
      })
    }else{
      this.goRegister();
    } 
  },
  goRegister(e){
    wx.navigateTo({
      url: '../../pages/login/Register/Register',
    })
  },
  goAddChild(e){
    wx.navigateTo({
      url: '../../pages/Information/Perfect-Information/Perfect-Information',
    })
  },
  goBaike(){
    wx.navigateTo({
      url: '../../pages/h5/baike/baike',
    })
  },
  shareIndex(){
    wx.navigateTo({
      url: '../../pages/h5/shareIndex/shareIndex?childrenId=' + this.data.childrenId + '&height=' + this.data.height,
    })
  },
  swiperChange (e) {
    this.setData({
      thisnum: e.detail.current,
      childId: this.data.movies[e.detail.current].childrenId
    })
    //请求当前的孩子的信息
    getStatisticList(this)
    getTestAgeResult(this)
  },
  refreshData () {
    let _this = this;
    if (_this.data.childId == 0) {
      return;
    }
    let bWidth = itemWidth * _this.data.StatisticList.length + 60;
    _this.setData({
      isLoading: true,
      boxWidth: bWidth,
      pageNo: _this.data.pageNo+1
    });
    if (_this.data.isMore){
      _this.setData({ isLoading: false, boxWidth: (itemWidth * (_this.data.StatisticList.length) )-22})
      return;
    }else{
      getStatisticList(_this)
    }
  }
});
function getStatisticList(that){
  wx.request({
    url: app.rQUrl+'/v1/exercisePlan/getStatisticListByChildId',
    method:'GET',
    header:{
      'token': wx.getStorageSync('userInfo').oauthToken ? wx.getStorageSync('userInfo').oauthToken.token : ''
    },
    data:{
      childId: that.data.childId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      height: that.data.height
    },
    success(res){
      if(res.data.code == '10000'){
        let result = res.data.response;
        result.reverse();
        if(that.data.pageNo == 1 && result.length == 0){
          that.setData({ isLoading: false, isMore: true, boxWidth: (itemWidth*(that.data.StatisticList.length-1)-22)})
          return;
        }else if(that.data.pageNo >1 && result.length > 0){
          for (let i = 0; i < result.length; i++) {
            result[i].dataDay = result[i].dataDay.substring(result[i].dataDay.length - 2, result[i].dataDay.length);
            result[i].dataMonth = result[i].dataMonth.substring(result[i].dataDay.length - 2, result[i].dataDay.length);
            result[i].dayTime = (result[i].dayTime / 60000).toFixed(1);
          }
          let StatisticList = that.data.StatisticList.concat(result);
          that.setData({
            StatisticList: result,
            toDayItem: 'toDayItem',
            boxWidth: (itemWidth * result.length) - 22,
            isLoading: false,
          })
        }else{
          if(result.length == 0){
            that.setData({ isLoading: false, isMore: true, boxWidth: (itemWidth * (that.data.StatisticList.length) ) - 22})
            return;
          }
          for (let i = 0; i < result.length; i++) {
            result[i].dataDay = result[i].dataDay.substring(result[i].dataDay.length - 2, result[i].dataDay.length);
            result[i].dataMonth = result[i].dataMonth.substring(result[i].dataMonth.length - 2, result[i].dataMonth.length);
            result[i].dayTime = (result[i].dayTime / 60000).toFixed(1);
          }
          that.setData({
            StatisticList: result,
            toDayItem: 'toDayItem',
            boxWidth: (itemWidth * result.length) - 22,
            totalTime: (result[9].totalTime/60000).toFixed(1),
            dayTime: (result[9].dayTime / 60000).toFixed(1),
            weekTime: (result[9].weekTime / 60000).toFixed(1),
            totalDay: result[9].totalDay,
            continueDay: result[9].continueDay,
            isLoading: false,
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}
function getTestAgeResult(that){
  wx.request({
    url: app.rQUrl+'/v1/corporeityTest/getTestAgeResult',
    method:'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token},
    data:{
      childrenId: that.data.childrenId,
      height: that.data.heights,
    },
    success(res){
      if(res.data.code == "10000"){
        let result = res.data.response;
        result.cardiopulmonaryFunctionValue = result.cardiopulmonaryFunctionValue.toFixed(1);
        result.bmiValue = result.bmiValue.toFixed(1);
        let a = result.cardiopulmonaryFunctionValue;
        let b = a.split(".");
        let x = b[0];
        let y = b[1];
        let c = result.bmiValue;
        let d = c.split(".");
        let e = d[0];
        let f = d[1];
        let array = new Array();
        let array1 = new Array();
        let array2 = new Array();
        for (let i = 0; i < result.peopleNumList.length; i++) {
          if (i == result.score) {
            array1.push(result.peopleNumList[i]);
            array2.push(result.peopleNumList[i]);
            array.push(i)
            continue;
          }
          if (i % 10 == 0) {
            array1.push(result.peopleNumList[i]);
            array2.push(0);
            array.push(i)
          }
        }
        // console.log(result)
        that.setData({ 
          TestAgeResult: result,
          cardiopulmonaryFunctionValue: x,
          cardiopulmonaryFunctionValues: y,
          bmiValue:e,
          bmiValues:f,
          keyList: result.keyList,
          keyListStatus:true,
          peopleNumList: result.peopleNumList,
          array: array,
          array1: array1,
          array2: array2,
          maxCount: result.maxCount 
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}



