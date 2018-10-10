// pages/competition/competition-list.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      activityList:[],
      haveActivity:true
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
    let that = this;
    wx.request({
      url: app.tanmaCompetitionUrl + '/v1/app/account/queryActivityList',
      data: {
      },
      method: 'GET',
      ContentType: 'application/json;charset=UTF-8',
      success: (res) => {
        console.log(res);
        if (res.data.code == 1){
          that.setData({
            activityList: res.data.data
          })
        }
        if (res.data.data == null || res.data.data.length <= 0 ){
          that.setData({
            haveActivity: false
          })
        }else{
          that.setData({
            haveActivity: true
          })
        }
      },
      fail: (info) => {

      }
    })
  },

  toCompetitionDetail(e){
    var orgId = e.currentTarget.dataset.orgid; //科目ID
    console.log(orgId);
    wx.navigateTo({
      url: '../../../pages/competition/competition-detail/competition-detail?organizationId=' + orgId,
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
  onShareAppMessage: function () {
  
  }
})