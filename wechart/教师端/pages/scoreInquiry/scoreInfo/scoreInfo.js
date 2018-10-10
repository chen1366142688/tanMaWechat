// pages/scoreInquiry/scoreInfo/scoreInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testType: ['请选择组名称'],
    classList: ["小学一年级"],
    classGrade: ["七班"],
    testIndex: 0,
    classIndex: 0,
    gradeIndex: 0,
    listIndex : 1,
    stuList : [{
      name : "张晓华",
      score : 85,
      sex : 1
    }, {
        name: "张晓华",
        score: 85,
        sex: 1
      }, {
        name: "张晓华",
        score: 85,
        sex: 1
      },]
  },
  // 选择列表类型
  checklist(e){
    this.setData({
      listIndex: e.currentTarget.dataset.index
    })
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