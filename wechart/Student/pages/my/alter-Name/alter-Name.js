// pages/my/alter-Name/alter-Name.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    userId:'', 
    holder:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name=options.name;
    var userId = options.userId;
    this.setData({ name: name, userId: userId, studentType: options.studentType, mike: options.mike})
    if (options.mike == '1') {
      wx.setNavigationBarTitle({
        title: '修改昵称'
      })
      this.setData({holder:'请输入昵称'})
    }else{
      wx.setNavigationBarTitle({
        title: '修改姓名'
      })
      this.setData({ holder: '请输入姓名' })
    }
  },
  userName:function(e){
    this.setData({name:e.detail.value})
  },
  subName:function(e){
    var that=this;
    var userId=this.data.userId;
    var name=this.data.name;
    var studentType = this.data.studentType;
    if(this.data.mike=='1'){
      wx.request({
        url: app.url + '/v1/student/update/studentNickNameByUserId',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': userId,
          'nikeName': name
        },
        success: function (res) {
          if (res.data.code == '10000') {
            wx.showToast({
              title: '操作成功！',
              icon: 'none'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }else{
      wx.request({
        url: app.url + '/v1/student/update/studentRealNameByUserId',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': userId,
          'realName': name
        },
        success: function (res) {
          if (res.data.code == '10000') {
            wx.showToast({
              title: '操作成功！',
              icon: 'none'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
    
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