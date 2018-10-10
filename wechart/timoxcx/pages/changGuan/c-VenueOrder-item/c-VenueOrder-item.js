// pages/changGuan/c-VenueOrder-item/c-VenueOrder-item.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:['报名中','已签到'],
    url:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    orderCode:'1',
    classId:'1',
    userId:'1',
    orderItems:{},
    week: '',
    orderStates:[],
    statusArr:'',
    isDialogShow: false,
    isDialogPay: false,
    isScroll: true
  },
  //拨打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.orderItems.coachPhone ,
    })
  },
  //跳转到申请退款页面
  refund:function(e){
    this.setData({
      isDialogPay: false,
      isScroll: true
    })
    wx.navigateTo({
      url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + this.data.orderItems.orderCode,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this=this;
    _this.setData({
      orderCode: options.code,
      classId: options.classId,
      userId:options.uid,
      statusArr: options.status,
      best:options.best
    })
    getOrderList(_this, options.code);
    orderState(_this, options.classId, options.code, options.uid)
  },
  //评论课程直接跳转
  goCurriculum: function (e) {
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../../pages/changGuan/c-Venuecomment/c-Venuecomment?orderCode=' + code,
    })
  },
  //点击去付款出现的弹窗
  goPay: function (e) {
    let code = e.currentTarget.dataset.code;
    this.setData({
      isDialogShow: true,
      isScroll: false,
      goPayCode: code
    })
  },
  //更多操作（暂停课程、申请退款）
  goStops: function (e) {
    let code = e.currentTarget.dataset.code;
    console.log(code)
    this.setData({
      isDialogShow: true,
      isScroll: false,
      stopCode: code
      
    })
  },
  //申请退款直接跳转
  refundFun: function (e) {
    if (e.currentTarget.dataset.code) {
      let code = e.currentTarget.dataset.code;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code,
      })
    } else {
      let code = this.data.stopCode;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code,
      })
    }

  },
  //取消事件
  cancels: function (e) {
    console.log("用户点击了取消")
    this.setData({
      isDialogPay: false,
      isScroll: true,
      isDialogShow: false
    })  
  },
  //暂停课程
  stopCoase: function (e) {
    var that = this;
    let code = e.currentTarget.dataset.orderCode;
    if (code) {
      that.setData({
        isDialogPay: false,
        isScroll: true,
        isDialogShow: false
      })
      wx.showModal({
        title: '提示',
        content: '您确认暂停课程吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'http://192.168.3.4:8081/v1/order/updateOrderClassStatus',
              method: 'GET',
              data: {
                'orderCode': code,
                'classStatus': '01'
              },
              success: (res) => {
                console.log(res)
                if (res.data.code == '10000') {
                  let statuList = that.data.status;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '07'
                    }
                  }
                  that.setData({
                    status: statuList
                  })
                }
              },
              fail: (info) => {
                console.log("请求失败了")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    } else {
      let code = that.data.stopCode;
      that.setData({
        isisDialogPay: false,
        isScroll: true,
        isDialogShow: false
      })
      wx.showModal({
        title: '提示',
        content: '您确认暂停课程吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'http://192.168.3.4:8081/v1/order/updateOrderClassStatus',
              method: 'GET',
              data: {
                'orderCode': code,
                'classStatus': '01'
              },
              success: (res) => {
                console.log(res)
                if (res.data.code == '10000') {
                  let statuList = that.data.status;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '07'
                    }
                  }
                  that.setData({
                    status: statuList
                  })
                }
              },
              fail: (info) => {
                console.log("请求失败了")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    }
  },
  //学员取消退款
  cancelreFund: function (e) {
    console.log("what")
    var that = this;
    let code = e.currentTarget.dataset.code;
    wx.request({
      url: 'http://192.168.3.4:8081/v1/order/updateOrderRefund',
      method: 'GET',
      data: {
        'orderCode': code,
        'refundStatus': '03'
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == '10000') {
          let statuList = that.data.status;
          for (let x in statuList) {
            if (statuList[x].orderCode == code) {
              statuList[x].orderStatus = '02'
            }
          }
          that.setData({
            status: statuList
          })
        }
      },
      fail: (info) => {
        console.log("取消失败了")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
//获取学员订单详情
function getOrderList(that,code){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/order/getOrderDetailForStudent',
    method:'GET',
    data:{
      'orderCode':code
    },
    success:function(res){
      console.log(res)
      res.data.code == '10000' ? that.setData({orderItems:res.data.response}) : wx.showToast({
        title: '后台出错了',
      })
      that.setData({
        week:chinanum(res.data.response.weekDay)
      })
    },
    fail:function(info){
      console.log("失败了 ")
    }
  })
}
//获取学员订单已参加的课程情况
function orderState(_this,classId,orderCode,userId){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/attend/getClassAttendForStudent',
    method:'GET',
    data:{
      'classId': classId,
      'orderCode': orderCode,
      'userId': userId
    },
    success:(res)=>{
      console.log(res)
      if(res.data.code=='10000'){
        _this.setData({
          orderStates:res.data.response
        })
      }
    },
    fail:(info)=>{
      console.log("请求失败")
    }
  })
}
//阿拉伯数字转星期
function chinanum(num) {
  num--;
  var china = new Array('一', '二', '三', '四', '五', '六', '日');
  var arr = new Array();
  for (var i = 0; i < china.length; i++) {
    arr[0] = china[num];
  }
  return arr.join("")
}  