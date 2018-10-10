// components/test-one/test-one.js
const app = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabParams : {
      type : Object
    },
    testDetail :{
      type: Object
    }
  },
  asd : {
    type : String
  },
  /**
   * 组件的初始数据
   */
  data: {
    count : [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9],
    second: 0,
    third: 0,
    fourth: 0,
    timerCount : "00.0",
    millisecond : 0,
    second1 : 0,
    second2 : 0,
    timer : "",
    isTimer: false,
    isReset : false,
    value :[10,10,10]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    testStart : function(e){
      let that = this;

      let max1 = parseInt(that.data.tabParams.maxTime / 10000),
        max2 = parseInt(that.data.tabParams.maxTime / 1000) % 10,
        max3 = (that.data.tabParams.maxTime % 1000);
      if (that.data.second2 == max1 && that.data.second1 == max2 && that.data.millisecond == max3) {
        return;
      }

      if (that.data.isTimer){
        clearInterval(that.data.timer);
        that.setData({
          value: [that.data.second2 +10, that.data.second1 +10, ("" + (that.data.millisecond + 10)).slice(0, 1)],
          second: that.data.second2,
          third: that.data.second1,
          fourth: ("" + that.data.millisecond).slice(0, 1),
          isTimer : false,
          isReset : true
        })
      }else{
        that.setData({
          isTimer : true,
          isReset: false
        })
        that.data.timer = setInterval(function () {
          jishi(that)
          that.setData({
            timerCount: "" + that.data.second2 + that.data.second1 + "." + ("" + that.data.millisecond).slice(0, 1)
          })
        }, 50)
      }
    },
    // 复位
    reset : function(){
      clearInterval(this.data.timer);
      this.setData({
        value: [10,10,10],
        second: 0,
        third: 0,
        fourth: 0,
        isTimer: false,
        millisecond : 0,
        second2 : 0,
        second1 : 0,
        isReset : false,
        timerCount : "00.0"
      })
    },
    bindChange : function(e){
      this.setData({
        second: e.detail.value[0] >= 10 ? e.detail.value[0] - 10 : e.detail.value[0],
        third: e.detail.value[1] >= 10 ? e.detail.value[1] - 10: e.detail.value[1],
        fourth: e.detail.value[2] >= 10 ? e.detail.value[2] - 10 : e.detail.value[2]
      })
    },
    pushBtn: function(){
      clearInterval(this.data.timer);
      this.setData({
        value: [this.data.second2 + 10, this.data.second1 + 10, ("" + (this.data.millisecond + 10)).slice(0, 1)],
        second: this.data.second2,
        third: this.data.second1,
        fourth: ("" + this.data.millisecond).slice(0, 1),
        isTimer: false,
        isReset: true
      })
      let value = this.data.tabParams.testType == 1 ?
        "" + this.data.second + this.data.third + "." + this.data.fourth : this.data.checkFinish;
        console.log(value)
      let pushObj = {
        childId: this.data.testDetail.childId,
        parentId: wx.getStorageSync('userInfo').userId,
        testId: this.data.testDetail.testId,
        list: [{
          orderIndex: this.data.tabParams.orderIndex,
          testTabId: this.data.tabParams.testTabId,
          testValue: value
        }]
      }
      wx.request({
        url: app.rQUrl + '/v1/corporeityTest/addTestResult',
        method: 'POST',
        header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
        data: pushObj,
        success: function (res) {
          if (res.data.code === 10000){
            wx: wx.navigateTo({
              url: '../../../pages/Exercise/Test-complete/Test-complete?childrenid=' + pushObj.childId + "&testId=" + pushObj.testId,
            })
          }
        }
      })
    },
    finish: function () {
      this.setData({
        checkFinish: true
      })
    },
    unfinish: function () {
      this.setData({
        checkFinish: false
      })
    },
    getUp : function(){
      wx.navigateBack({
        delta: 1
      })
    }
  }
})

function jishi(that){
  let max1 = parseInt(that.data.tabParams.maxTime / 10000),
    max2 = parseInt(that.data.tabParams.maxTime / 1000) % 10,
    max3 = (that.data.tabParams.maxTime % 1000);
  if (that.data.second2 == max1 && that.data.second1 == max2 && that.data.millisecond == max3) {
    clearInterval(that.data.timer)
    that.setData({
      isTimer: false,
      isReset: true,
      second : max1,
      third : max2,
      fourth : max3,
      value : [max1+10,max2+10,max3+10]
    })
    return ;
  }
  that.setData({
    millisecond: that.data.millisecond + 50
  })
  if (that.data.millisecond >= 1000){
    that.setData({
      second1 : that.data.second1 + 1,
      millisecond : 0
    })
  }
  if (that.data.second1 >= 10){
    that.setData({
      second1 : 0,
      second2 : that.data.second2 + 1
    })
  }
}
