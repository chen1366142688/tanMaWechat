// pages/Exercise/Physical-Test/Physical-Test.js
const app = getApp().globalData;
Page({
  data: {
    scroll: true,
    childName: [
      
    ],
    active: '0',
    copyright:[],
    pageNo : 1,
    paramsObj: {
      childId: 0
    },
    testList : [],
    timer : "",
    timer2 : ""
  },
  cilckChild(e) {
    let index = e.currentTarget.dataset.index;
    let that = this;
    this.setData({
      active: index,
      testList: [],
      pageNo: 1
    })
    getTestList(that.data.childName[index].childrenId, that, that.data.pageNo)
  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      paramsObj : {
        childId: options.childrenid
      }
    })

    wx.request({
      url: app.rQUrl + '/v1/childreninfo/getChildrenInfoList',
      method: "GET",
      header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
      data: {
        parentUserId: wx.getStorageSync('userInfo').userId
      },
      success: function (res) {
        // console.log(res)
        let childDetail = res.data.response
        if (res.data.code == 10000) {
          that.setData({
            childName: childDetail
          })
          getTestList(that.data.childName[0].childrenId, that, that.data.pageNo)
        } else {
          
        }
      }
    })
  },
  onReady: function () {},
  onShow: function () {
    let query = wx.createSelectorQuery().select(".patent-preparatory-work")
    let that = this;
    query.boundingClientRect(function (rect) {
      that.setData({
        height: rect.height
      })
    }).exec()
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  // 监听页面滚动
  onPageScroll: function (e) {
    clearInterval(this.data.timer)
    let that = this;
    this.data.timer = setInterval(function(){
      if (e.scrollTop >= that.data.height - 5) {
        that.setData({
          isTop: true
        })
      } else {
        that.setData({
          isTop: false
        })
      }
    },10)
  },
  onReachBottom: function () {
    let that = this;
    getTestList(this.data.paramsObj.childId, that, this.data.pageNo)
  },
  onShareAppMessage: function () {}
})
function copyright(that){
  wx.request({
    url: app.rQUrl +'/v1/help/get/commonInformation',
    method: 'POST',
    data:{
      "codes": ["COPYRIGHT"]
    },
    success(res){
      if(res.data.code == '10000'){
        let result = res.data.response;
        that.setData({ copyright:result})
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}
function getTestList(id, that, pageNo){
  wx.request({
    url: app.rQUrl + '/v1/corporeityTest/getListByChildrenId',
    method : "GET",
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data : {
      childrenId : id,
      pageNo: pageNo,
      pageSize : 2
    },
    success : function(res){
      if (res.data.code == 10000){
        let result = res.data.response;
        that.setData({
          testList: that.data.testList.concat(result),
          pageNo: that.data.pageNo + 1
        })
      }else{
        that.setData({
          isMore : true
        })
      }
    }
  })
}