// pages/Timetable/CourseDetails/CourseDetails.js
const app = getApp().globalData
Page({
  data: {
    pariseList:[],
    tabLoad:true,
    showFooter:false,
    evalType : 0, //写评价的类型，默认未评价
    evalInput : "",
    isWriteEval : false,
    isPlan : false,
    orderCode : 0,
    weekList :["一","二","三","四","五","六","日"],
    pageNumber : 1,
    isMore : true,
    imgUrl:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/iteration/',
    month:'',
    date:'',
    modalTxt:'是否要退出该课班？',
    classInfo:{},
    commentCount:0,
    isShow:true,
    dateShow:true,
    bottom:0,
    align:'center',
    iphoneX:false
  },
  onLoad(options) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (options.noShowFoot == '1') { that.setData({ isShow: false })}
    if (options.orderCode){
      this.setData({
        orderCode: options.orderCode,
        dateShow:false
      })
      getStuScheduleClassInfo(that)
    }else{
      this.setData({
        scheduleId: options.scheduleId,
        isPlan : true,
        dateShow: true
      })
      getStuScheduleAttendInfo(that)
    }
  },
  onReady() {},
  onShow() {
    const that = this;
    app.noType();
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf("iPhone X") >= 0) {
           that.setData({ bottom: 34, align: 'flex-end', iphoneX:true})
        }
      }
    });
  },
  onHide() {},
  
  onPullDownRefresh() {},
  //分享 
  onShareAppMessage(res) {
    const that = this;
    return {
      title: '课程详情',
      path: '/pages/keChen/coursedetails/coursedetails?classId=' + that.data.classInfo.classId + "&shar=shareBtn",
    }
  },
  onReachBottom() {
    const that = this;
    if (!that.data.isMore){
      return false;
    }
    let i = that.data.pariseList.length;
    getScheduleClassComment(that)
  },
  // 请假
  vacate(){
    let that = this;
    that.setData({
      modal : true
    })
  },
  // 取消请假
  cancel(){
    this.setData({
      modal : !this.data.modal
    })
  },
  // 确认请假
  sure(){
    let that = this;
    deleteStuSchedule(that,0)
  },
  // 写评价
  writeEval(){
    this.setData({
      isWriteEval : !this.data.isWriteEval
    })
  },
  writeInput(e){
    this.setData({
      isWriteInput : true,
      focus: true,
      evalType: e.currentTarget.dataset.type
    })
  },
  evalInput(e){
    this.setData({
      evalInput : e.detail.value
    })
  },
  // 发送评论
  evalbtn(){
    let that = this;
    if (this.data.evalInput == ""){
      that.setData({
        isWriteEval: false,
        isWriteInput: false
      })
      return false;
    }
    wx.request({
      url: app.url + '/v1/schedule/saveClassComment',
      method: "POST",
      header: { "token": wx.getStorageSync("userInfo").token },
      data: {
        orderCode: this.data.orderCode,
        classId : this.data.classInfo.classId,
        content: this.data.evalInput,
        grade: this.data.evalType
      },
      success : function(res){
        if (res.data.code == 10000){
          let classInfo = that.data.classInfo;
          classInfo.commentCount += 1;
          that.setData({
            isWriteEval: false,
            isWriteInput: false,
            pariseList: [],
            pageNumber: 1,
            isMore:true,
            classInfo: classInfo
          })
          getScheduleClassComment(that)
        }
      }
    })
  },
  // 关闭评论
  closeEval(){
    this.setData({
      isWriteEval: false,
      isWriteInput : false
    })
  },
  // 分享
  shareClass(){
    
  },
  // 打电话
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.classInfo.phoneNum
    })
  },
  // 更改排课时间
  changeClassTime(e){
    wx.setStorageSync('changeTime', 1)
    wx.setStorageSync('longStatus', e.currentTarget.dataset.longstatus)
    wx.setStorageSync('classId', this.data.classInfo.classId)
    wx.switchTab({ 
      url: '../Timetable/Timetable',
    })
  }
})
// 获取排课详情
function getStuScheduleAttendInfo(that){
  wx.request({
    url: app.url + '/v1/schedule/getStuScheduleAttendInfo',
    method: "GET",
    header: { "token": wx.getStorageSync("userInfo").token },
    data: {
      scheduleId: that.data.scheduleId
    },
    success: function (res) {
      setTimeout(() => { wx.hideLoading() }, 800)
      if (res.data.code == 10000) {
        let arr = res.data.response.attendDate.split('-');
        that.setData({
          classInfo: res.data.response,
          month: arr[1],
          date:arr[2] 
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        var info = prevPage.data //取上页data里的数据也可以修改
        prevPage.setData({ 'orderCode': res.data.response.orderCode })//设置数据
        getScheduleClassComment(that)
      }else{
        if(res.data.code == 30004){
          wx.showModal({
            title: '提示',
            content: '教练已修改课程时间，请重新排课',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta:1
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        
      }
    },fail(info){
      setTimeout(() => { wx.hideLoading() }, 800)
    }
  })
}

// 获取订单详情
function getStuScheduleClassInfo(that){
  wx.request({
    url: app.url +'/v1/schedule/getStuScheduleClassInfo',
    method : "GET",
    header : {"token" : wx.getStorageSync("userInfo").token},
    data : {
      orderCode: that.data.orderCode
    },
    success :function(res){
      setTimeout(() => { wx.hideLoading() }, 800)
      if (res.data.code == 10000){
        that.setData({
          classInfo : res.data.response
        })
        getScheduleClassComment(that)
      }
    },fail(info){
      setTimeout(() => { wx.hideLoading() }, 800)
    }
  })
}
// 获取评论
function getScheduleClassComment(that){
  that.setData({
    tabLoad : true
  })
  wx.request({
    url: app.url + '/v1/schedule/getScheduleClassComment',
    method: "POST",
    header: { "token": wx.getStorageSync("userInfo").token },
    data: {
      classId: that.data.classInfo.classId,
      pageNumber: that.data.pageNumber,
      theNumber  : 5
    },
    success: function (res) {
      if (res.data.code == 10000){
        if (res.data.response.length == 0){
          that.setData({
            isMore : false,
            tabLoad : false
          })
          return false;
        }
      //  let arr =  that.data.pariseList.concat(res.data.response)
        that.setData({
          pariseList: that.data.pariseList.concat(res.data.response),
          pageNumber: that.data.pageNumber + 1,
          tabLoad : false,
          // commentCount: arr.length
        })
      }
    }
  })
}

// 请假
function deleteStuSchedule(that,change){
  wx.request({
    url: app.url + '/v1/schedule/deleteStuSchedule',
    method: "GET",
    header: { "token": wx.getStorageSync("userInfo").token },
    data: {
      scheduleId: that.data.scheduleId
    },
    success : function(res){
      if (res.data.code == 10000){
        if (change == 1){
          wx.switchTab({
            url: '../Timetable/Timetable?changeTime=' + change,
          })
        }else{
          wx.switchTab({
            url: '../Timetable/Timetable',
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }
  })
}