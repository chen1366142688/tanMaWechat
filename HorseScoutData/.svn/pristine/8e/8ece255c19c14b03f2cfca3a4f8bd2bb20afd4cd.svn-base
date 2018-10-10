// components/test-two/test-two.js
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
    count: [0,1,2,3,4,5,6,7,8,9,0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    outShort : true,
    value : [10,10,10,10]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    click : function(){
      this.setData({
        outShort : !this.data.outShort
      })
    },
    bindChange: function (e) {
      this.setData({
        first: e.detail.value[0] >= 10 ? e.detail.value[0] - 10 : e.detail.value[0],
        second: e.detail.value[1] >= 10 ? e.detail.value[1] - 10 : e.detail.value[1],
        third: e.detail.value[2] >= 10 ? e.detail.value[2] - 10 : e.detail.value[2],
        fourth: e.detail.value[3] >= 10 ? e.detail.value[3] - 10 : e.detail.value[3]
      })
    },
    pushBtn: function () {
      clearInterval(this.data.timer);
      let value = this.data.tabParams.testType == 1 ? 
              "" + this.data.first + this.data.second + this.data.third + "." + this.data.fourth : this.data.checkFinish ;
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
    finish : function(){
      this.setData({
        checkFinish : true
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
