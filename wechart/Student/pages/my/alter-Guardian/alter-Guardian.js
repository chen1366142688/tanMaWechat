// pages/my/alter-Guardian/alter-Guardian.js
const app=getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    numbers:''
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
    var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    console.log(wxPrevPage.data.studentAdultInfo.guardianName )
    var guardianName = wxPrevPage.data.studentAdultInfo.guardianName;
    var identityCode = wxPrevPage.data.studentAdultInfo.identityCode;
    this.setData({
      name: guardianName,
      numbers: identityCode
    })
  }, 
  userNameInput:function(e){
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
    this.setData({name:e.detail.value})
  },
  userNumInput:function(e){
    this.setData({ numbers: e.detail.value })
  },
  subMit:function(e){
    var that=this;
    var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    var userId = wxPrevPage.data.userInfo.userId;
    wx.request({
      url: app.url+'/v1/student/update/studentGuardianNameAndCodeIdByUserId',
      method:'GET',
      data:{
        'userId': userId,
        'guardianName': that.data.name,
        'identityCode': that.data.numbers
      },
      success:function(res){
        if (res.data.code == '10000') {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
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