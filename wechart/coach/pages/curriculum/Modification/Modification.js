// pages/curriculum/Modification/Modification.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    orderCode:'',
    orderInfo:'',
    isSubmit:false,
    isSuccess:false,
    courseFee:0

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm=this;
    let orderCode = options.orderCode;
   // orderCode = 5;
    vm.setData({
      orderCode: orderCode
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
    var vm=this;
    app.noType();
    getOrderInfo(vm)
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
  
  },
  spareTime:function (e){
    // console.log(e)
    var vm=this;
    let spareTime = e.detail.value;
    vm.setData({
      spareTime: spareTime
    })
  },
  submit:function(e){
    var vm=this;
    let spareTime = vm.data.spareTime;
    if (spareTime<=0){
      wx.showModal({
        title: '提示',
        content: '剩余课时不能为0',
        showCancel: false
      });
      return false;
    }
    // if (spareTime == vm.data.orderInfo.spareTime){
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入小于剩余课时数量',
    //     showCancel: false
    //   });
    //   return false;
    // }
    if(!spareTime){
      wx.showModal({
        title: '提示',
        content: '请输入剩余课时',
        showCancel: false
      });
      return false;
    }
    let isSubmit = vm.data.isSubmit;
    let isSuccess = vm.data.isSuccess;
    if (isSubmit && isSuccess) {
      wx.showModal({
        title: '提示',
        content: '请勿重复提交',
        showCancel: false
      })
      return false;
    };
    if (isSubmit && !isSuccess) {
      wx.showModal({
        title: '提示',
        content: '您提交得太频繁了，休息一下吧',
        showCancel: false
      })
      return false;
    }
    vm.setData({
      isSubmit: true
    });
    var contentModal="";
    if (vm.data.orderInfo.payType=='2'){
      contentModal = '学员:' + vm.data.orderInfo.studentName + '  的剩余课时修改为 ' + vm.data.spareTime +  '，是否确认？';
    }else{
      contentModal = '学员:' + vm.data.orderInfo.studentName + '  的剩余课时修改为 ' + vm.data.spareTime + ' 课时（课程余额：' + vm.data.spareTime *vm.data.courseFee / 100 + '元），是否确认？';
    }
    wx.showModal({
      title: '修改剩余课时',
      content: contentModal,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          submit(vm)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
});
function getOrderInfo(vm){
  let orderCode = vm.data.orderCode;
  wx.request({
    url: app.url + '/v1/order/getOrderInfoForModify',
    data: {
      "orderCode": orderCode
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        vm.setData({
          orderInfo: data,
          courseFee: data.spareCost / data.spareTime
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '请稍后再试',
          showCancel: false
        });
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })

};
function submit(vm){
  let orderCode = vm.data.orderCode;
  let spareTime = vm.data.spareTime;
  wx.request({
    url: app.url + '/v1/order/updateOrderSpareTime',
    data: {
      "orderCode": orderCode,
      "spareTime":spareTime
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          success: function (res) {
            //返回上一页
            wx.navigateBack({
              delta: 1
            })
          }
        });  
        let orderInfo = vm.data.orderInfo;
        orderInfo.spareTime = spareTime;
        orderInfo.spareCost = spareTime * vm.data.courseFee;
        vm.setData({
          isSuccess: true,
          orderInfo: orderInfo
        });   
      } else {
        wx.showModal({
          title: '提示',
          content: '修改失败，请稍后再试',
          showCancel: false
        });
        vm.setData({
          isSuccess: false,
          isSubmit: false
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
}