// pages/techer/techerPersonal/techerPersonal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    info: [
      { name: '我的昵称', value: '李华' }
    ],
    nameInfo: [
      { name: '监护人姓名/身份证号', value: '李明（510*****0035）' },
      { name: '与学员关系', value: '父亲' },
      { name: '监护人住址', value: '四川省成都市高新区益州大道中段1800号移动互联大厦' },
      { name: '监护人手机', value: '136*****556' },
       { name: '监护人微信', value: '12588sdsdd' }
    ],
    setting: [
      { name: '登录密码', value: '修改' },
      { name: '交易密码', value: '修改' }
    ],
    items: [
      { name: 'USA', value: '成人' },
      { name: 'CHN', value: '青少年', checked: 'true' }
    ],
    mans: [
      { name: 'man', value: '男' },
      { name: 'wuman', value: '女', checked: 'true' }
    ],
    array: ['父亲', '母亲', '叔叔', '伯父'],
    objectArray: [
      {
        id: 0,
        name: '父亲'
      },
      {
        id: 1,
        name: '母亲'
      },
      {
        id: 2,
        name: '叔叔'
      },
      {
        id: 3,
        name: '伯父'
      }
    ],
    indexs: 0,
    state: 'active',
    states: '',
    xuaned:false,
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexs: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      xuaned:true
    })
  },
  switchBtn: function (e) {
    console.log(e.currentTarget.dataset.val)
    var _this = this;
    var status = e.currentTarget.dataset.val;
    if (status == 'open') {
      _this.setData({
        state: 'active',
        states: ''
      })
    } else if (status == 'close') {
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