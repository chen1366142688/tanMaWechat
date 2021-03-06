// pages/My/My-Index/My-Index.js
const app = getApp().globalData;
Page({
  data: {
    patriarchId: 33, 
    childList: [],
    children:[],
    imgUrl: app.url +'My/head-portrait.png'
  },
  //个人简介
  introduce: function () { 
    wx.navigateTo({
      url: '../../../pages/My/Personal-Information/Personal-Information',
    })
  },
  //单个孩子详情简介
  details: function (e) {
    wx.navigateTo({
      url: '../../../pages/My/Child-Information/Child-Information?childrenid=' + e.currentTarget.dataset.childrenid,
    })
  },
  //去检测
  goTesting(e){
    wx.navigateTo({
      url: '../../../pages/Exercise/Physical-Test/Physical-Test?childrenid=' + e.currentTarget.dataset.childrenid,
    })
  },
  //历史测试
  historyTest(e){
    wx.navigateTo({
      url: '../../../pages/My/Test-Record/Test-Record?childrenName=' + e.currentTarget.dataset.name + '&&childrenId=' + e.currentTarget.dataset.childrenid,
    })
  },
  //历史锻炼
  historyTraining(e){
    wx.navigateTo({
      url: '../../../pages/My/Training-Record/Training-Record?childrenName=' + e.currentTarget.dataset.name + '&&childrenId=' + e.currentTarget.dataset.childrenid,
    })
  },
  // 联系客服
  ContactCustomerService(e) {
    wx.makePhoneCall({ //客服电话待定
      phoneNumber: '13679695212',
    })
  },
  onLoad: function (options) {
    const that = this;
    //通过家长id获取孩子家长的信息列表
    childList(that)
  },
  onReady: function () { 
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').oauthToken.token) {
      children(this)
    } else {
      wx.redirectTo({
        url: '../../../pages/login/Register/Register',
      })
    }
   },
  onShow: function () { 
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').oauthToken.token) {
      children(this)
    } else {
      wx.redirectTo({
        url: '../../../pages/login/Register/Register',
      })
    }
  },
  goHelp(){
    wx.navigateTo({
      url: '../../../pages/h5/help/help',
    })
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  onTabItemTap(item) {},
})
function childList(that) {
  wx.request({
    url: app.rQUrl + '/v1/patriarch/getPatriarchInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { patriarchId: wx.getStorageSync('userInfo').patriarchId },
    success(res) {
      if (res.data.code == '10000') {
        let results = res.data.response;
        let phone = String(results.phoneNum);
        results.phoneNum = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        that.setData({
          childList: results
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail(info) {
      console.log("请求后台失败")
    }
  })
}
function children(that) {
  wx.request({
    url: app.rQUrl + '/v1/childreninfo/getChildrenInfoList',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { parentUserId: wx.getStorageSync('userInfo').patriarchId },
    success(res) {
      if (res.data.code == '10000') {
        // console.log(res)
        let result = res.data.response;
        for(let i =0;i<result.length;i++){
          result[i].bmi = (result[i].bmi).toFixed(2)
        }
        that.setData({ children: result})
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}