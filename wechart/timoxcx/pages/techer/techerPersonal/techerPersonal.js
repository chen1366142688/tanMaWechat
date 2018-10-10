// pages/techer/techerPersonal/techerPersonal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    info:[
      {name:'我的昵称',value:'李华'},
      { name: '教练类型', value: '教练' }
    ], 
    nameInfo: [
      { name: '真实姓名/身份证号', value: '李明（510***********0035）' },
      { name: '住址', value: '四川省成都市高新区益州大道中段1800号移动互联大厦' }
    ],
    setting:[
      { name: '登录密码', value: '修改' },
      { name: '交易密码', value: '修改' }
    ],
    state:'active',
    states:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  switchBtn:function(e){
    console.log(e.currentTarget.dataset.val)
    var _this=this;
    var status = e.currentTarget.dataset.val;
    if(status == 'open'){
      _this.setData({
        state:'active',
        states:''
      })
    }else if(status == 'close'){
      _this.setData({
        state: '',
        states: 'active'
      })
    }
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