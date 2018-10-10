const app = getApp().globalData;
const formatNumber = n => { return n >= 10 ? n : '0' + n }
Page({
  data: {
    startDate: '2018-09-06',
    dayTimeStart: '08:00',
    dayTimeEnd: '10:00', 
    scheduleId:"",
    name:'',
    itemContent:'',
    changeFlag:"1" 
  },
  onLoad: function(options) {
    this.setData({ scheduleId: options.scheduleId || ""})
    wx.setNavigationBarTitle({
      title: options.scheduleId ? '编辑日程' : '新增日程'
    })
    if (options.scheduleId){
      StuSelfSchedule(this)
    }else{
      const date = new Date();
      const month = parseInt(date.getMonth()) + 1;
      let years = date.getFullYear() + '-' + formatNumber(month) + '-' + formatNumber(date.getDate());
      this.setData({ startDate: years})
    }
  },
  // 选择日期
  startDateChange: function(e) {
    this.setData({
      startDate: e.detail.value,
    })
  },
  // 开始时间
  starTimeChange: function(e) {
    this.setData({
      dayTimeStart: e.detail.value
    })
  },
  // 结束时间
  endTimeChange: function(e) {
    this.setData({
      dayTimeEnd: e.detail.value
    })
  },

  // 日程名称
  placeName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  palceItem(e) {
    this.setData({
      itemContent: e.detail.value
    })
  },
  // 保存
  subContent: function(e) {
    let that = this;
    let dayTimeStart = parseInt(that.data.dayTimeStart.replace(":", ""))
    let dayTimeEnd = parseInt(that.data.dayTimeEnd.replace(":", ""))
    if (dayTimeStart >= dayTimeEnd) {
      wx.showToast({
        title: '课程开始时间必须大于结束时间！',
        icon: 'none'
      })
      return false;
    }
    checkTime(that) 
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},

})
// 学员日程-获取自定义日程信息
function StuSelfSchedule(that) {
  wx.request({
    url: app.url + '/v1/schedule/getStuSelfSchedule',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'scheduleId': that.data.scheduleId || ""
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let result = res.data.response;
        that.setData({
          name: result.scheduleName,
          itemContent: result.scheduleDescribe,
          changeFlag: result.changeFlag,
          startDate: result.attendDate,
          dayTimeStart: result.dayTimeStart,
          dayTimeEnd: result.dayTimeEnd,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }
  })
}
// 提交验证，学员日程-验证排课时间是否重复:返回 数字0无重复， 其他数字代表重复条数
function checkTime(that){
  wx.request({
    url: app.url + '/v1/schedule/checkScheduleByDate',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'attendDate': that.data.startDate,
      'dayTimeEnd': that.data.dayTimeEnd,
      'dayTimeStart': that.data.dayTimeStart,
      'scheduleId': that.data.scheduleId || ""
    },
    success: function (res) {
      if (res.data.code == '10000') {
        if (res.data.response == 0){
          saveStuSelfSchedule(that)
        }else{
          wx.showToast({
            title: "此时间段课时有重复",
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },fail(info){
      wx.showToast({
        title: '后台开小差了，稍等一下！',
        icon: 'none'
      })
    }
  })
}
// 提交新增日程
function saveStuSelfSchedule(that){
  if (that.data.name === "" || that.data.itemContent === "" ){
    wx.showToast({
      title: '名称或描述不能为空',
      icon:'none'
    })
    return false;
  }
  wx.request({
    url: app.url + '/v1/schedule/saveStuSelfSchedule',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'attendDate': that.data.startDate,
      'dayTimeEnd': that.data.dayTimeEnd,
      'dayTimeStart': that.data.dayTimeStart,
      'scheduleDescribe': that.data.itemContent,
      'scheduleName': that.data.name,
      'scheduleId': that.data.scheduleId || ""
    },
    method: "POST",
    success: function (res) {
      if (res.data.code == '10000') {
        wx.switchTab({
          url: '../../../pages/Timetable/Timetable/Timetable',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '后台开小差了，稍等一下！',
        icon:'none'
      })
    }
  })
}