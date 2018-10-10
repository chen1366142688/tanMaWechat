const url = getApp().globalData.url; 
Page({
  data: {
    imgUrl:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/iteration/',
    curresInfo:[],
    weekList: ["日","一", "二", "三", "四", "五", "六"],
    ActiveClassInfo:{}, 
    modal: false,//弹窗
    btnLfText: '取消',//lfTxt
    btnRgText: '确定',//lfTxt
    modalTxt: '该时段已安排课程，是否挤掉该课程？',
    change: 0,
    thisTime: "08",
    thisTimeEnd: "22",
  },
  onLoad(options) {
    this.setData({
      dateTime: options.dateTime, 
    })
    let weekday = new Date(Date.parse(this.data.dateTime.replace(/\-/g, "/")))
    this.setData({
      weekday: this.data.weekList[weekday.getDay()]
    })
  },
  onReady() {},
  onShow() { getClassList(this)},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  scrolltolower(e){},
  // 选择时间
  bindDateChange(e){
    let that = this;
    let weekday = new Date(Date.parse(e.detail.value.replace(/\-/g, "/")))
    this.setData({
      dateTime: e.detail.value,
      weekday: this.data.weekList[weekday.getDay()]
    })
    getClassList(that)
  },
  bindTimeStartChange(e) { 
    let that = this;
    this.setData({
      thisTime : e.detail.value.split(":")[0]
    })
    getClassList(that)
  },
  bindTimeEndChange(e) {
    let that = this;
    this.setData({
      thisTimeEnd: e.detail.value.split(":")[0]
    })
    getClassList(that)
  },
  goAddCurrse(e){
    wx.navigateTo({
      url: '../../../pages/Timetable/NewAgenda/NewAgenda',
    })
  },
  cancel(){
    this.setData({modal:false})
    saveStuSchedule(this, classInfo)
  },
  sure(){
    const that =this;
    this.setData({ modal: false })
    if (this.data.change == 4){
      return
    }else{
      saveStuSchedule(that, that.data.ActiveClassInfo)
    }
  },
  // 添加课程
  addClass(e){
    let that = this;
    let classInfo = e.currentTarget.dataset.info;
    that.setData({ ActiveClassInfo: classInfo})
    checkByDate(that, classInfo)
  }
})
//添加课程
function saveStuSchedule(that,classInfo){
  wx.request({
    url: url + '/v1/schedule/saveStuSchedule',
    method: "POST",
    header: { "token": wx.getStorageSync("userInfo").token },
    data: {
      attendDate: classInfo.attendDate,
      attendId: classInfo.attendId,
      classId: classInfo.classId,
      classSectionId: classInfo.classSectionId,
      orderCode: classInfo.orderCode
    },
    success: function (res) {
      if (res.data.code == 10000) {
        wx.switchTab({
          url: '../Timetable/Timetable',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    }
  })
}
// 获取该时段的课程列表
function getClassList(that){
  wx.request({
    url: url + '/v1/schedule/getClassAttendInfoByDate',
    header : {"token" : wx.getStorageSync("userInfo").token},
    method : "GET",
    data : {
      attendDate : that.data.dateTime,
      dayTimeStart : that.data.thisTime + ":00",
      dayTimeEnd : that.data.thisTimeEnd+":00"
    },
    success:function(res){
      if (res.data.code == 10000){
        that.setData({
          curresInfo : res.data.response
        })
      }
    }
  })
}
//判断是否重复
function checkByDate(that, classInfo) {
  wx.request({
    url: url + '/v1/schedule/checkScheduleByDate',
    method: "GET",
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      scheduleId: '',
      attendDate: classInfo.attendDate,
      dayTimeStart: classInfo.dayTimeStart,
      dayTimeEnd: classInfo.dayTimeEnd
    },
    success(res) {
      if (res.data.code == 10000) {
        if (res.data.response == 0) {//无重复
          //判断未排课课时是否为0
          if (classInfo.spareSchedule  <= 0) {
            that.setData({
              modal: true,
              btnLfText: '取消',
              btnRgText: '确认',
              modalTxt: '您没有未安排课时',
              change: 4
            })
            return;
          }
          else {
            //添加课班日程
            saveStuSchedule(that, classInfo)
          }
        } else {//课班重复是否挤掉
          that.setData({
            modal: !that.data.modal
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: '网络异常，请重试',
        icon: 'none'
      })
    }
  })
}