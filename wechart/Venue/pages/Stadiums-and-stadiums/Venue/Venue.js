// pages/Venue/Venue.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    backgroundUrl: app.imgUrl,
    backgroundUrlFill: app.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    gethomeLoginInfoByUserId(vm);
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

  imageClick:function(e){
      //audit_status 审核状态0未审核，1审核通过，2审核未通过
      //account_state 账号状态1开启2关闭
      var userInfo=wx.getStorageSync('userInfo');
      if (userInfo.auditStatus=='1' 
        && userInfo.accountState=='1'){
        wx.navigateTo({
          url: '../../../'+e.target.dataset.url,
        });
      }else{
          var content="你的账号已被关闭,不能进行此操作！";
          if (userInfo.auditStatus=='0'){
            content ="你的账号未审核,不能进行此操作！";
          } else if (userInfo.auditStatus == '2'){
            content = "你的账号审核未通过,不能进行此操作！";
          }                 
          wx.showModal({
            title: '提示',
            content: content,
            showCancel: false,
          });

      }
  }

})
//页面初始化
function gethomeLoginInfoByUserId(vm){
  if (wx.getStorageSync('userInfo').userId==undefined){
      setTimeout(function(){
        gethomeLoginInfoByUserId(vm);
      },100);
      return;
  }
  wx.request({
    url: app.url + '/v1/home/get/homeLoginInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      "userId": wx.getStorageSync('userInfo').userId
    },
    success: (res) => {
      console.log(res)
      if (res.data.code == '30005') {
        //跳转到注册页  
        wx.redirectTo({
          url: "../../../pages/Stadiums-and-stadiums/venue-register/venue-register"
        });
        return;
      }
      if (res.data.code == '10000') {
        var data = res.data.response;
        //场馆名称
        wx.setNavigationBarTitle({
          title: data.homeName
        });
        //场馆图片
        //homeId
        wx.setStorageSync('homeId', data.homeId);
        // wx.setStorageSync('homeId', 2);
        vm.setData({
          nickName: data.nickName,
          backgroundUrl: data.photoAddr,
          backgroundUrlFill: data.photoAddr + '?x-oss-process=image/resize,m_fill,h_180,w_180'
        });
      } else {
        console.log(res.data.msg)
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  });
}