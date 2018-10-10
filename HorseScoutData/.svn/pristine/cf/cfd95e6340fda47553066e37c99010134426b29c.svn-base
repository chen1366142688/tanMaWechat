// pages/My/Binding-Information/Binding-Information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll: true,
    childName: [
      { "name": '扎合格', "iPhone":'(136****9548)', "active": true },
      { "name": '的回暖', "iPhone": '(136****9548)',  "active": false },
      { "name": "目定口呆", "iPhone": '(136****9548)',  "active": false },
      { "name": '滴的', "iPhone": '(136****9548)',  "active": false }
    ],
    active: 'Exercise-Program-choose-one'
  },
  cilckChild(e) {
    const that = this;
    let index = e.currentTarget.dataset.index;
    let childName = that.data.childName;
    for (let i = 0; i < childName.length; i++) {
      if (index == i) {
        childName[i].active = true;
      } else {
        childName[i].active = false;
      }
    }
    that.setData({ childName: childName })
  },
  onLoad: function (options) { },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})