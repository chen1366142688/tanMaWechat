const app = getApp().globalData;
Page({
  data: {
    urlc: app.imgUrl,
    classId:'',
    attendInfo:{},
    classAttenList: [],
    num:1,
    theNum:10,
    height:100,
    footer:'————已全部显示————',
    Period:0,
    thatHtieght:0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      classId: options.classId,
      classAttenList:[]
    });
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
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        //获取当前手机上1像素等于多少倍数
        var width=750/windowWidth;
        var thisWidth=180/width;
        var thatHtieght=windowHeight-thisWidth;
        that.setData({
          height: thatHtieght,
          thatHtieght: thatHtieght
        })
      }
    })
    that.setData({
      Period: 0,
      footer: ''
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
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'classId': calssId
    },
    success:function(res){
      if(res.data.code=='10000'){
        if (res.data.response.itemStudentGrade){
          res.data.response.itemStudentGrade = 'L' + res.data.response.itemStudentGrade.replace(new RegExp(",", 'g'), "L");
        }
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
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'classId': classId,
      'pageNumber': pageNum,
      'theNumber': theNumber
      },
      success:function(res){
        console.log(res)
        if(res.data.code=='10000'){
          if (pageNum == 1 && res.data.response.length == 0) {
            that.setData({
              Period: 1,
              height: 0,
              footer:''
            })
            return false;
          }
          if(res.data.response.length>0){
            that.setData({
              classAttenList: res.data.response,
              Period: 0,
              height: that.data.thatHtieght,
              footer: ''
            })
          }else{
            // wx.showToast({
            //   title: '还没有历史开班信息！',
            //   icon:"none"
            // })
            that.setData({
              footer: '没有更多历史信息',
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