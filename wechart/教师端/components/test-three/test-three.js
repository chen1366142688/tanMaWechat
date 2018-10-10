// components/test-three/test-three.js
const app = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabParams: {
      type: Object
    },
    testDetail: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9],
    count1 : [0,1,2,3,4,5,6,7,8,9],
    first: 0,
    second: 0,
    third: 0,
    timerCount: "00.0",
    millisecond: 0,
    second1: 0,
    second2: 0,
    second3: 0,
    timer: "",
    isTimer: false,
    isReset: false,
    value:[10,10,10],
    checkFinish : false
  },
  ready: function () {
    this.setData({
      timerCount: (this.data.tabParams.maxTime) / 1000 + "." + (this.data.tabParams.maxTime % 1000),
      second2: parseInt(this.data.tabParams.maxTime / 10000),
      second1: parseInt(this.data.tabParams.maxTime / 1000) % 10,
      millisecond: (this.data.tabParams.maxTime % 1000),      
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    testStart: function (e) {
      let that = this;

      if (that.data.second2 == 0 && that.data.second1 == 0 && that.data.millisecond == 0) {
        return;
      }

      if (that.data.isTimer) {
        clearInterval(that.data.timer);
        that.setData({
          isTimer: false,
          isReset: true
        })
      } else {
        that.setData({
          isTimer: true,
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
    reset: function () {
      clearInterval(this.data.timer);
      this.setData({
        value: [10, 10, 10],
        first: 0,
        second: 0,
        third: 0,
        isTimer: false,
        timerCount: (this.data.tabParams.maxTime) / 1000 + "." + (this.data.tabParams.maxTime % 1000),
        second2: parseInt(this.data.tabParams.maxTime / 10000),
        second1: parseInt(this.data.tabParams.maxTime / 1000) % 10,
        millisecond: (this.data.tabParams.maxTime % 1000), 
        isReset: false
      })
    },
    bindChange: function (e) {
      let that = this;
      countRule(that, e)
      this.setData({
        first: e.detail.value[0] >= 10 ? e.detail.value[0] - 10 : e.detail.value[0],
        second: e.detail.value[1] >= 10 ? e.detail.value[1] - 10 : e.detail.value[1],
        third: e.detail.value[2] >= 10 ? e.detail.value[2] - 10 : e.detail.value[2],
      })
      
    },
    pushBtn: function () {
      clearInterval(this.data.timer);
      this.setData({
        isTimer: false,
        isReset: true
      })
      let value = this.data.tabParams.testType == 1 ?
        "" + this.data.first + this.data.second + this.data.third : this.data.checkFinish;
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
          if (res.data.code === 10000) {
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
    getUp: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})

function jishi(that) {
  that.setData({
    millisecond: that.data.millisecond - 50
  })
  if (that.data.second2 == 0 && that.data.second1 == 0 && that.data.millisecond == 0) {
    clearInterval(that.data.timer)
    that.setData({
      isTimer: false,
      isReset: true
    })
    return ;
  }
  if (that.data.millisecond <= 0) {
    that.setData({
      second1: that.data.second1 - 1,
      millisecond: 1000
    })
  }
  if (that.data.second1 < 0) {
    that.setData({
      second1: 9,
      second2: that.data.second2 - 1
    })
  }
}

function countRule(that,e){
  
}

