// pages/gradeTable/gradeDetail/gradeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listIndex:1,
    classInfo : {
      classList : "五年级",
      classGrade : "二班",
      scoreYet : "20",
      scoreNot : "05"
    },
    stuList: [{
      name: "张晓华",
      score: 85,
      sex: 1
    }, {
      name: "张晓华",
      score: 85,
      sex: 1
    }, {
      name: "张晓华",
      score: 85,
      sex: 1
    }]
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