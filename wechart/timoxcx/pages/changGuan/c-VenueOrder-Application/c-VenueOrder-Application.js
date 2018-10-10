// pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode:'',
    url:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    orderList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      orderCode:options.orderCode
    })
    orderApplication(that, options.orderCode)
  },
  //提交用户申请退款信息
  subBtn:function(e){
    wx.request({
      url: 'http://192.168.3.4:8081/v1/order/applyOrderRefund',
      method:'GET',
      data:{
        'orderCode':this.data.orderList.orderCode,
        'payCost': this.data.orderList.payCost,
        'realRefundCost': this.data.orderList.realRefundCost
      },
      // data: {
      //   'orderCode': this.data.orderList.orderCode,
      //   'payCost': 500,
      //   'realRefundCost': 100
      // },
      success:function(res){
        console.log(res.data)
        res.data.code=='10000'? wx.showToast({
          title: '申请成功',
        }) : wx.showToast({
          title: '申请失败',
        })
      },
      fail:function(info){
        console.log("请求失败了：信息如下："+info)
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
//获取学员申请退款订单信息
function orderApplication(that,orderCode){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/order/getOrderInfoForRefund',
    method:'GET',
    data:{
      'orderCode':orderCode
    },
    success:function(res){
      console.log("请求成功，下面返回的参数")
      console.log(res.data)
      if(res.data.code=="10000"){
        that.setData({
          orderList:res.data.response
        })
      }
    },
    fail:function(info){
      console.log("请求失败返回信息是："+info)
    }
  })
}