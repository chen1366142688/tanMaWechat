// pages/my/coach-student/coach-student.js
const app = getApp().globalData;
var stystm = wx.getSystemInfoSync()
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    studentList:[],
    pageNumber:1,
    theNumber:10,
    value:'',
    height: 0,
    options:{}, 
    ismore:false,//是否允许下次加载
    more: false,//是否允许下次加载
    padding:0,
    Period:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //屏幕高度
    
    if(options.classId){
      this.setData({ height: stystm.windowHeight-55, options: options ,padding:20,value:options.nickName})
    }else{
      this.setData({ height: stystm.windowHeight - 55, options: options, value: options.nickName })
    }
    searchStudent(this,1)    
  },
  searchInput(e){
    this.setData({value:e.detail.value})
  },
  search(e){
    let options=this.data.options;
    //options.nickName = ''
    // if(this.data.value == ''){
    //   this.setData({value:""})
    // }else{
    //   this.setData({ value: options.nickName })
    // }
    this.setData({ ismore: false, more: true, pageNumber: 1,options:options})
    searchStudent(this,2)
  },
  scrolltolower(){
    if (!this.data.more){//说明上一次请求没有数据了
      let page = this.data.pageNumber;
      page = parseInt(page) + 1
      this.setData({ ismore: true, pageNumber: page })
      searchStudent(this, 1)
    }
  },
  studentInformation(e){
    console.log(e.currentTarget.dataset.studentid)
    wx.navigateTo({
      url: '../../../pages/my/Student-Information/Student-Information?studentId='+e.currentTarget.dataset.studentid,
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
//搜索学员列表
function searchStudent(that,num) {
  wx.request({
    url: app.url + '/v1/order/getClassStudentForMyLearner',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      "classId":that.data.options.classId || '',
      "nickName": that.data.value,
      "pageNumber": that.data.pageNumber, 
      "theNumber": that.data.theNumber
    },
    success(res) {
      console.log("请求成功")
      if(res.data.code=='10000'){
        if (that.data.ismore) {//这是下拉刷新的
          if (res.data.response.length) {
            let list=that.data.studentList;
            list.concat(res.data.response)
            that.setData({ studentList: list, Period:false})
          } else {
            that.setData({ more: true})//说明已经没有数据，下次不请求后台数据
            wx.showToast({
              title: '没有更多学员',
              icon: 'none'
            })
          }
        }else{//正常搜索加载数据
          if(res.data.response.length){
            that.setData({ studentList: res.data.response, Period: false, height: stystm.windowHeight - 55 })
          }else{
            that.setData({ Period: true, height:0 })
          }
        }
        
      }

    },
    fail(info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
}