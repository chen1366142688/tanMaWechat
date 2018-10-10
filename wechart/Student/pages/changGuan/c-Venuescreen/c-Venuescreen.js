// pages/changGuan/c-Venuescreen/c-Venuescreen.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    orderState:[
      { name: '00', value: '已下单，待教练确认', classId: '00', checked: true, group: '1'},
      { name: '01', value: '已下单，待学员付款', classId: '01', checked: true, group: '1'},
      { name: '02', value: '课程进行中', classId: '02', checked: true, group: '1'},
      { name: '03', value: '课程已结束', classId: '03', checked: true, group: '2'},
      { name: '04', value: '申请退款中', classId: '04', group: '1'},
      { name: '05', value: '已退款完成', classId: '05', group: '2'},
      { name: '06', value: '申请暂停中', classId: '06', group: '1'},
      { name: '07', value: '课程暂停中', classId: '07', group: '1'},
      { name: '99', value: '订单已取消', classId: '99',group:'2' },
    ],
    selectStatus:[],
    stas:'',
    isSelect:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    _this.setData({
      stas: options.stas
    })
    
    let tempList = this.data.orderState;
    let selectList = wx.getStorageSync("orderStatus");
    console.log(selectList);
    if (selectList && selectList != "" && selectList.length > 0){
      for (let i = 0; i < tempList.length; i++) {
        tempList[i].checked = false;
        for (let j = 0; j < selectList.length;j++){
          if (tempList[i].name == selectList[j]){
            tempList[i].checked = true;
          }
        }
      }
      this.setData({
        orderState: tempList
      })
    }
    wx.setStorageSync("orderListFrom", "select");
  },
  checkboxChange: function (e) {
    var arrList = e.detail.value;
    this.setData({
      selectStatus: arrList,
      isSelect:true
    })
  },
  //获取学员状态管理
  studentState:function(e){
    if (this.data.isSelect){
      wx.setStorageSync("orderStatus", this.data.selectStatus);
    }
    if (wx.getStorageSync("orderStatus") && wx.getStorageSync("orderStatus").length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择筛选条件！',
      })
      return false;
    }
    wx.setStorageSync("orderListChange", true);
     wx.navigateBack({
       delta: 1
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
    app.noType();
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



