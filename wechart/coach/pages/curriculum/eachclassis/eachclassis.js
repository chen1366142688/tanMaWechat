var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({
  data: {
    imgUrl: app.imgUrl,
    classId:'1',
    attendInfo:{},
    classAttenList: [
      ],
    num:1,
    theNum:10,
    height:100,
    footer:'已经到底了'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    attendClassInfo(this,this.data.classId)
    console.log(this.data.classId, this.data.num, this.data.theNum)
    classAttendList(this, this.data.classId, this.data.num, this.data.theNum)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 获取当前手机
    var that=this;
    app.noType();
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        //获取当前手机上1像素等于多少倍数
        var width=750/windowWidth;
        var thisWidth=180/width;
        var thatHtieght=windowHeight-thisWidth;
        that.setData({
          height: thatHtieght
        })
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
//获取课程基本信息
function attendClassInfo(that,calssId){
  wx.request({
    url: app.url + '/v1/class/getAttendClassInfo',
    method:'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data:{
      'classId': calssId
    },
    success:function(res){
      console.log("请求成功，下面是返回的额参数")
      if(res.data.code=='10000'){
        that.setData({
          attendInfo:res.data.response
        })
      }
    },
    fail:function(info){
      wx.showToast({
        title: '获取信息失败',
      })
    }
  })
}
//获取开课情况列表
function classAttendList(that, classId, pageNum, theNumber){
  console.log(classId, pageNum, theNumber)
  wx.request({
    url: app.url + '/v1/attend/getClassAttendList',
    method:'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data:{
      'classId': classId,
      'pageNumber': pageNum,
      'theNumber': theNumber
      },
      success:function(res){
        console.log(res)
        if(res.data.code=='10000'){
          if(res.data.response.length>0){
            that.setData({
              classAttenList: res.data.response
            })
          }else{
            wx.showToast({
              title: '没有数据',
            })
            that.setData({
              footer: '没有数据'
            })
          }
        }
      },
      fail:function(info){
        wx.showToast({
          title: '获取信息失败',
        })
      }
  })
}