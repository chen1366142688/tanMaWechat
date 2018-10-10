// pages/my/alter-Guardian/alter-Guardian.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    names:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('微信账号')
    wx.setNavigationBarTitle({
      title: options.name == 'student' ? "学员微信" : "监护人微信"
    })

    this.setData({
      names:options.name
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
    var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    console.log(wxPrevPage.data.studentAdultInfo.guardianName)
    var guardianName = wxPrevPage.data.studentAdultInfo.guardianWX ;
    this.setData({
      name: guardianName
    })
  },
  userNameInput: function (e) {
    this.setData({ name: e.detail.value })
  },
  //提交修改的监护人微信
  subMit: function (e) {
    var that = this;
    if(!that.data.name){return false;}
    var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    var userId = wxPrevPage.data.userInfo.userId;
    var urls='';
    if(that.data.names=='student'){
      urls=''
    }else{
      urls = app.url + '/v1/student/update/studentGuardianWechatByUserId';
    }
    wx.request({
      url: app.url + '/v1/student/update/studentGuardianWechatByUserId',
      method: 'GET',
      data: {
        'userId': userId,
        'wechat': that.data.name,
      },
      success: function (res) {
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

  /**
   * 用户点击右上角分享
   */
})