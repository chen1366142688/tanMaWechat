const app = getApp().globalData;
Page({
  data: {
    imgUrl: app.imgUrl,
    classId: '1',
    attendInfo: {},
    classAttenList: [], 
    num: 1, 
    theNum: 10,
    height: 100,
    heights:100,
    heightss:100,
    Period:false,
    footer: '已经到底了',
    id:2
  },
  onLoad: function (options) {
    console.log(options.id)
    //页面初始化 options为页面跳转所带来的参数
    this.setData({
      classId: options.classId,
      classAttenList: [],
      id: options.id
    });
    attendClassInfo(this, this.data.classId)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 获取当前手机
    var that = this;
    app.noType();
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        //获取当前手机上1像素等于多少倍数
        var width = 750 / windowWidth;
        var thisWidth = 180 / width;
        var thatHtieght = windowHeight - thisWidth;
        that.setData({
          height: thatHtieght,
          heights: windowHeight-88,
          heightss: windowHeight - 88,
        })
      }
    })
  },
  scrolltolower(e){
    classAttendList(this, this.data.classId, this.data.num, this.data.theNum)
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
//获取课程基本信息
function attendClassInfo(that, calssId) {
  wx.request({
    url: app.url + '/v1/class/getAttendClassInfo',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'classId': calssId
    },
    success: function (res) {
      console.log("请求成功，下面是返回的额参数")
      if (res.data.code == '10000') {
        if (res.data.response.itemStudentGrade) {
          res.data.response.itemStudentGrade = 'L' + res.data.response.itemStudentGrade.replace(new RegExp(",", 'g'), " L");
        }
        that.setData({
          attendInfo: res.data.response
        })
        classAttendList(that, that.data.classId, that.data.num, that.data.theNum)
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取信息失败',
      })
    }
  })
}
//获取开课情况列表
function classAttendList(that, classId, pageNum, theNumber) {
  console.log(classId, pageNum, theNumber)
  var data ={};
  if(that.data.id == 1){
    data = {
      'coachUserId': that.data.attendInfo.classCoachUserId,
      'classId': classId,
      'pageNumber': pageNum,
      'theNumber': theNumber
    };
  }else if(that.data.id == 2){
    data = {
      'classId': classId,
      'pageNumber': pageNum,
      'theNumber': theNumber
    };
  }
  wx.request({
    url: app.url + '/v1/attend/getClassAttendList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: data,
    success: function (res) {
      console.log(res)
      that.setData({ num: pageNum+1})
      if (res.data.code == '10000') {
        if(res.data.response.length==0 && pageNum==1){
          that.setData({
            Period: true,
            heights: 0,
          })
          return false;
        }
        if (res.data.response.length > 0) {
          if (pageNum==1){
            that.setData({
              classAttenList: res.data.response,
              Period: false,
              heights: that.data.heightss,
            })
          }else{
            let attentList = that.data.classAttenList;
            attentList=attentList.concat(res.data.response)
            that.setData({
              classAttenList: attentList,
              Period: false,
              heights: that.data.heightss,
            })
          } 
        } else {
          that.setData({
            Period: false,
            height: that.data.heightss,
          })
        }
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取信息失败',
      })
    }
  })
}