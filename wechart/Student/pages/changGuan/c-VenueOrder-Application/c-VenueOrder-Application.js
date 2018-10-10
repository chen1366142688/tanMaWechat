// pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode:'',
    url: app.imgUrl,
    orderList:{},
    router:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var orderCode=options.orderCode;
    that.setData({
      orderCode: orderCode,
      router: options.router
    })
    orderApplication(that, orderCode)
  },
  modalcnt: function () {
    wx.showModal({ 
      title: '提示',
      content: '实付课程:实付课程金额,为购买课程实际付款金额（不包含优惠打折部分）。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  modalcnte: function () {
    wx.showModal({
      title: '提示',
      content: '退款扣费:退款扣费,为平台对退款金额征收的佣金,为实付金额的5%。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //提交用户申请退款信息
  subBtn:function(e){
    const that=this;
    wx.request({
      url: app.url + '/v1/order/applyOrderRefund',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method:'GET',
      data:{
        'orderCode':this.data.orderList.orderCode,
        'payCost': this.data.orderList.payCost,
        'realRefundCost': this.data.orderList.realRefundCost
      },
      success:function(res){
        if (res.data.code == '30005') {
          //跳转到首页  
          wx.navigateTo({
            url: "../../../pages/register/register"
          });
          return;
        }
        res.data.code=='10000'? wx.showToast({
          title: '申请成功',
          success:function(){
            var pages = getCurrentPages();
            if(that.data.router=='venOrder'){//这是订单列表页过来的
              var prevPage = pages[pages.length - 2];  //上一个页面
              var info = prevPage.data //取上页data里的数据也可以修改
              for (let i = 0; i < info.orderList.length; i++) {
                if (info.orderList[i].orderCode == that.data.orderList.orderCode) {
                  info.orderList[i].orderStatus = '04'
                  prevPage.setData({ orderList: info.orderList })//设置数据
                }
              }
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 300)
            } else if (that.data.router == 'venOrderItem'){//这是订单详情页过来的
              var prevPage = pages[pages.length - 3];  //上一个页面
              var info = prevPage.data //取上页data里的数据也可以修改
              for (let i = 0; i < info.orderList.length; i++) {
                if (info.orderList[i].orderCode == that.data.orderList.orderCode) {
                  info.orderList[i].orderStatus = '04'
                  prevPage.setData({ orderList: info.orderList })//设置数据
                }
              }
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 300)
              
              
            }
          }, fail() {
            wx.showToast({
              title: '网络异常，请稍后再试',
              icon: 'none'
            })}
        }) : wx.showToast({
          title: '申请失败',
        })
      },
      fail:function(info){
        wx.showToast({
          title: info,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.noType();
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
})
//获取学员申请退款订单信息
function orderApplication(that,orderCode){
  wx.request({
    url: app.url + '/v1/order/getOrderInfoForRefund',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'orderCode':orderCode
    },
    success:function(res){
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if(res.data.code=="10000"){
        res.data.response.itemStudentGrade = 'L' + res.data.response.itemStudentGrade.replace(new RegExp(",", 'g'), "L");
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