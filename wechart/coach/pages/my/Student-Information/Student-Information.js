// pages/my/Student-Information/Student-Information.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    studentInfo:{},//学员信息
    studentItmeInfo:[]//学员科目信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({options:options})
    studentInfo(this)
    studentItemInfo(this)
  },
  //去聊天
  wechat(e){

  },
  //去详情
  goInfoMation(e){
    console.log(e.currentTarget.dataset.ordercode)
    wx.request({
      url: app.url+'/v1/order/getOrderDetailForCoach',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        orderCode: e.currentTarget.dataset.ordercode
      },
      success(res){
        if(res.data.response){
          let best ='';
          if (res.data.orderStatus == '00') {
            console.log("已下单待教练确认")
            best = '确认已付款'
          } else if (res.data.orderStatus == '01') {
            console.log("已下单待学员支付")
            best = '取消订单'
          } else if (res.data.orderStatus == '02') {
            console.log("已支付课程进行中")
            best = '更多操作'
          } else if (res.data.orderStatus == '04') {
            console.log("退款申请中")
            best = '学员申请退款'
          }
          else if (res.data.orderStatus == '03' || res.data.orderStatus == '05') {
            console.log("评论课程")
            best = '评论学员'
          }
          
          wx.navigateTo({
            url: '../../../pages/curriculum/Order-Form/Order-Form?code=' + e.currentTarget.dataset.ordercode + '&&classId=' + e.currentTarget.dataset.classid + '&&uid=' + wx.getStorageSync('userInfo').userId + '&&status=' + res.data.orderStatus + '&&best=' + best + '&&stas=1',
          })
        }else{
          wx.showToast({
            title: '网络异常，获取详情失败',
            icon:'none'
          })
        }
      }
    })
    
  },
  //call电话
  callPhone(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone  //仅为示例，并非真实的电话号码
    })
  },
  wechat: function (e) {
    let fromPage = wx.setStorageSync("orderListFrom", 'im');
    let studentuserid = e.currentTarget.dataset.studentuserid;
    let nickname = e.currentTarget.dataset.nickname;
    let avatarurl = e.currentTarget.dataset.photo;
    let userimname = "studentIM" + studentuserid;
    wx.navigateTo({
      url: '../../../pages/news/chitchat/chitchat?userimname=' + userimname + '&type=coach&avatarurl=' + avatarurl + '&nickname=' + nickname,
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
function studentInfo(that){
  wx.request({
    url: app.url+'/v1/order/getStudentDeailForMyLearner',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data:{
      studentUserId: that.data.options.studentId
    },
    success(res){
      console.log("请求成功")
      console.log(res)
      if(res.data.code=='10000'){
        that.setData({studentInfo:res.data.response})
      }else{
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon:'none'
      })
    }
  })
}
function studentItemInfo(that) {
  wx.request({
    url: app.url + '/v1/order/getStudentOrderForMyLearner',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      studentUserId: that.data.options.studentId
    },
    success(res) {
      console.log("请求成功2222")
      console.log(res)
      if (res.data.code == '10000') {
        that.setData({ studentItmeInfo: res.data.response })
      } else {
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
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