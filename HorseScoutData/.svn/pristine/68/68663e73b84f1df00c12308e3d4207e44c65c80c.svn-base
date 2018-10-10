// pages/My/Test-Record/Test-Record.js
const app = getApp().globalData
Page({
  data: {
    childrenId: "",
    childrenName: "",
    theNumber: 10,
    pageNumber: 1,
    notHaveMoreData: false,
    listData: []
  },
  onLoad: function (options) {
    this.setData({
      childrenId: options.childrenId,
      childrenName: options.childrenName,
    })
    wx.setNavigationBarTitle({
      title: options.childrenName+"的历史训练记录"
    })
  },
  onReady: function () {},
  onShow: function () {
    this.setData({
      pageNo: 1,
      notHaveMoreData: false,
      listData:[]
    })
    queryHisDataList(this);
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    if (!this.data.notHaveMoreData){
       this.setData({
         pageNumber: this.data.pageNumber+1
       })
       queryHisDataList(this);
     }
  },
  onShareAppMessage: function () {}
})

function queryHisDataList(that) {
  wx.request({
    url: app.rQUrl + '/v1/exercisePlan/getChildrenExerciseResultList',
    method: 'POST',
    header: { 'token': wx.getStorageSync("userInfo").oauthToken.token },
    data: {
      'childrenId': that.data.childrenId,
      "pageNumber": that.data.pageNumber,
      "theNumber": that.data.theNumber,
    },
    success(res) {
      if (res.data.code == '10000') {
        let tempList = res.data.response;
        if (tempList.length < that.data.theNumber){
            that.setData({
              notHaveMoreData:true
            })
        }else{
            that.setData({
              notHaveMoreData: false
            })
        }
        if (tempList.length > 0){
          let oldList = that.data.listData;
          oldList = oldList.concat(tempList);
          that.setData({
            listData: oldList
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        inco: 'none'
      })
    }
  })
}

