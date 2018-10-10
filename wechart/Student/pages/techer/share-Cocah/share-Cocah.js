// pages/techer/share-Cocah/share-Cocah.js
const app = getApp().globalData;
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curriculumInfo : {},
    pageNo : 1,
    cocahId : "",
    classList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    that =this
    this.setData({
      cocahId: options.cocahId ? options.cocahId : "1188",
      userId : wx.getStorageSync("userInfo").userId
    })
    if (this.data.userId == this.data.cocahId){
      this.setData({
        isShare : true
      })
    }else{
      this.setData({
        isShare: false
      })
    }
  },
  back(){
    wx.navigateBackMiniProgram({
      success(res) {
        // 返回成功
      }
    })
  },
  // 跳转详情
  goClassDetail(e){
    wx.navigateTo({
      url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + e.currentTarget.dataset.classid + '&memberState=' + 0,
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
    getCocahInfo(this.data.cocahId);
    getClassList(this.data.cocahId)
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
    getClassList(this.data.cocahId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let shareObj = {
      title: this.data.curriculumInfo.nickName+"的主页",
      path: "pages/techer/share-Cocah/share-Cocah?cocahId=" + this.data.cocahId,
      imgUrl: '',
      success: function (res) {
        console.log(this.data.attendId);
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      }
    }
    return shareObj
  }
})

// 获取教练信息、
function getCocahInfo(cocahId){
  wx.request({
    url: app.url + '/v1/coach/get/queryCoachDetailForShare',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data : {
      userId: cocahId
    },
    success : function(res){
      wx.hideLoading()
      that.setData({
        curriculumInfo: res.data.response,
        // classList: res.data.response.certificateList
      })
    }
  })
}

// 获取课程列表
function getClassList(cocahId){
  wx.request({
    url: app.url + '/v1/coach/get/getCoachClassesForShareByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      userId: cocahId,
      pageNo: that.data.pageNo,
      pageSize : 5
    },
    success: function (res) {
      wx.hideLoading()
      if (res.data.code == 10000){
        that.setData({
          classList: that.data.classList.concat(res.data.response)
        })
        if (res.data.response.length == 0){

        }else{
          that.setData({
            pageNo: that.data.pageNo + 1
          })
        }
      }
    }
  })
}