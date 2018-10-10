// pages/my/student/student.js
const app = getApp().globalData;
var stystm = wx.getSystemInfoSync()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    right:420,
    value:'',
    studentList:[],
    height:0,
    pageNumber:1,
    theNumber:10,
    classId:'',
    Period:false

  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //屏幕高度
    
    this.setData({ height: stystm.windowHeight-44})
    //学员列表
    studentList(this);
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
  inputContent(e){
    this.setData({ value : e.detail.value })
  },
  search(){
    wx.navigateTo({ 
      url: '../../../pages/my/coach-student/coach-student?nickName=' + this.data.value,
    })
  },
  studentItem(e){
    this.setData({classId: e.currentTarget.dataset.classid})
    wx.navigateTo({
      url: '../../../pages/my/coach-student/coach-student?classId=' + e.currentTarget.dataset.classid,
    })
  }, 
  //滚动到底部
  scrolltolower(e){
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
//默认学员列表
function studentList(that){
  wx.request({
    url: app.url + '/v1/order/getClassListForMyLearner',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {},
    success(res) {
      console.log("请求成功")
      console.log(res)
      if(res.data.code == '10000'){
        if(res.data.response.length==0){
          that.setData({
            Period:true,
            height:0
          })
          return false;
        }else{
          that.setData({
            studentList: res.data.response,
            Period: false,
            height: stystm.windowHeight - 44
          })
        }
      }else{
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
      } 
    },
    fial(info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
}
