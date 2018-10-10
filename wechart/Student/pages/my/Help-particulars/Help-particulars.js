const app = getApp().globalData;
/*
// html富文本编辑器 接口中的html源代码 转换解析成 view 小程序代码
var WxParse = require('../../../wxParse/wxParse.js');
console.log(WxParse)*/
// pages/my/Help-particulars/Help-particulars.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: {},
    helpBox: {},
    helpDetailId:'',
    //list: {}  //帮助详情集合
    urlappxcx: app.htmlUrl //全局的接口请求地址 url app的小程序
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({ helpDetailId: options.helpDetailId });
    console.log(this.data.urlappxcx+"/helpParticulars.html?helpDetailId="+this.data.helpDetailId);
    // helpnotice(that, options.helpDetailId);
    /*var articlea = '<div>我是HTML代码1</div><p>我是HTML代码12</p><img src="http://www.bao.com/1.png">';*/
    /* var thata = this;
     var a = WxParse.wxParse('articlea', 'html', articlea, thata, 5)
     console.log(JSON.parse(a))*/
    /*thata.setData({
      list: a
    })*/
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
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
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
})


/*帮助子标题
  通过帮助详情ID查询详情信息
*/
/*helpDetailId 帮助详情的id */
function helpnotice(that, helpDetailId) {
  wx.request({
    url: app.url + '/v1/help/get/helpDetailInfoByHelpDetailId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'helpDetailId': helpDetailId
    },
    success: function (res) {
      console.log("ok")
      console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        that.setData({
          helpBox: result
        })
      }
      // var article = result.content;
      // console.log(article);
      // var vma = this //别名 vma
      /* var that = this 
      WxParse.wxParse('article', 'html', article, vma, 1); */
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}

/**
* WxParse.wxParse(bindName , type, data, target,imagePadding)
* 1.bindName绑定的数据名(必填)
* 2.type可以为html或者md(必填)
* 3.data为传入的具体数据(必填)
* 4.target为Page对象,一般为this(必填)
* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
*/
