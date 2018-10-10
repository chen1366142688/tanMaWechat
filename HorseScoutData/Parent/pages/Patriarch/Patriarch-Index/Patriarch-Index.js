const app = getApp().globalData

Page({
  data: {
    imgUrl:app.url,
    childInfo:[
      {                'childImg':'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/patriarch/Patriarch/head-portrait.png',
      'name':'刘翔',
      'sex':'1',
      'age':'5',
      'bgColor':''
      },
      {
        'childImg': 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/patriarch/Patriarch/head-portrait.png',
        'name': '这个孩子的名字是很长的名字',
        'sex': '2',
        'age': '23',
        'bgColor':''
      },
      {
        'childImg': 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/patriarch/Patriarch/head-portrait.png',
        'name': '这个孩子的名字是很长的名字',
        'sex': '2',
        'age': '23',
        'bgColor':''
      },
    ],
    scrollX:true
  },
  onLoad: function (options) {
    wx.loadFontFace({
      family: 'STHupo;',
      source: 'url("http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/font/STHUPO.TTF")',
      success: function (res) {
        console.log(res) //  loaded
      },
      fail: function (res) {
        console.log(res.status) //  error
      },
      complete: function (res) {
        console.log(res.status);
      }
    });
    const that = this;
    let childInfo = that.data.childInfo;
    let len = this.data.childInfo.length;
    for(let i = 0; i<len;i++){
      childInfo[i].bgColor = method3()
    }
    that.setData({ childInfo: childInfo})
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})
function method3() {
  return "#" + (function (color) {
    return new Array(7 - color.length).join("0") + color;
  })((Math.random() * 0x1000000 | 0).toString(16));
}